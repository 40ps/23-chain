# 23-Chain: Bitcoin Script Design Document

**Project:** 23-Chain — Wolfram (2,3) Turing Machine as BSV Transaction Chain  
**Version:** 1.0  
**Status:** Simulation Mode active. Live Mode pending Chronicle SDK support.

---

## Overview

This document describes the Bitcoin Script architecture for encoding Turing Machine state transitions as BSV transactions. Each computational step of the Wolfram (2,3) machine corresponds to one BSV transaction, making the chain of transactions a complete, verifiable execution trace of a Turing computation.

---

## State Encoding (OP_RETURN)

Each transaction carries the full Turing machine state in an `OP_RETURN` output.

### Encoding Format

```
{state}|{headPosition}|{tapeBase3}
```

| Field | Description | Example |
|-------|-------------|---------|
| `state` | Current machine state (0 or 1) | `1` |
| `headPosition` | Head index as decimal integer | `42` |
| `tapeBase3` | Tape cells concatenated as base-3 digits (0, 1, 2) | `000120201` |

**Example encoded string:**
```
1|42|000120201
```

**Hex-encoded for OP_RETURN:**
```
313|34327c3030303132303230317c3030303132303230
```
(UTF-8 bytes of the encoded string, as hex)

### Why Not JSON?

- JSON adds overhead (`{`, `"`, `,`, `}` characters) that wastes OP_RETURN space.
- The separator format is minimal and deterministic.
- BSV OP_RETURN supports up to 100KB by default (configurable by miner policy). The base-3 tape encoding is the most space-efficient representation for a 3-symbol alphabet.

---

## TXID Simulation

In simulation mode, TXIDs are computed as:

```
TXID = SHA256(encodedState)
```

- **Deterministic:** Same machine state always produces the same TXID.
- **No randomness:** Reproducible across runs.
- **Collision resistance:** SHA-256 ensures distinct states map to distinct TXIDs.

---

## Locking Script (scriptPubKey)

The locking script for each step output encodes a constraint: the next transaction must provide a valid Turing transition.

### Conceptual Structure (post-Chronicle)

```
OP_RETURN <hexEncodedState>        -- Output 0: state commitment
OP_DUP OP_HASH160 <pubKeyHash>    -- Output 1: P2PKH change (funding continuation)
```

For a stateful covenant approach (requiring Chronicle Script restoration):

```
-- Locking script (conceptual)
OP_PUSHDATA <expectedNextStateHash>
OP_SWAP
OP_SHA256
OP_EQUAL
OP_VERIFY
OP_DUP OP_HASH160 <pubKeyHash>
OP_EQUALVERIFY OP_CHECKSIG
```

This would require:
1. **Chronicle-restored opcodes**: `OP_CAT`, `OP_SUBSTR`, `OP_LEFT`, `OP_RIGHT`, `OP_SPLIT`, `OP_NUM2BIN`, `OP_BIN2NUM` for in-script state manipulation.
2. **UTXO introspection** (if using OTDA): Access to the spending transaction's outputs within the script.

---

## Unlocking Script (scriptSig)

```
<signature>                    -- ECDSA/Schnorr signature
<pubKey>                       -- Public key
<encodedNextState>             -- The next Turing state (verified against locking script)
```

---

## Used Opcodes

| Opcode | Purpose | Chronicle Required? |
|--------|---------|---------------------|
| `OP_RETURN` | State commitment | No (available in all versions) |
| `OP_DUP` | Stack manipulation | No |
| `OP_HASH160` | P2PKH address derivation | No |
| `OP_EQUALVERIFY` | Equality check + verify | No |
| `OP_CHECKSIG` | Signature verification | No |
| `OP_SHA256` | State hash commitment | No |
| `OP_CAT` | Binary concatenation for state assembly | **Yes — Chronicle** |
| `OP_SPLIT` | Parsing tape fields from state | **Yes — Chronicle** |
| `OP_NUM2BIN` | Integer → byte encoding | **Yes — Chronicle** |
| `OP_BIN2NUM` | Byte → integer decoding | **Yes — Chronicle** |

---

## State Transition Validation

### Conceptual Verification

The locking script can encode the Wolfram (2,3) transition table directly in Script. For each step, the unlocking script provides the new state, and the locking script verifies it follows the transition rules.

**Transition table as Script conditions:**

```
-- State 0, Symbol 0 → Write 1, Move Right, New State 1
OP_IF <state==0> OP_IF <symbol==0>
  <check newState==1> <check newSymbol==1> <check direction==Right>
OP_ENDIF OP_ENDIF
...
```

This is feasible in BSV post-Chronicle due to:
- Lifted opcode limits (script size, stack depth)
- `OP_CAT`/`OP_SPLIT` for tape string manipulation
- Arbitrary data push support

---

## OP_RETURN State Encoding

```
OUTPUT[0]:
  scriptPubKey: OP_RETURN <hexEncodedState>
  value: 0 satoshis (unspendable)

OUTPUT[1]:
  scriptPubKey: OP_DUP OP_HASH160 <nextStepPubKeyHash> OP_EQUALVERIFY OP_CHECKSIG
  value: (previous output value) - (miner fee) satoshis
```

The `OP_RETURN` output is unspendable (prunable from UTXO set) and carries the full Turing state as a commitment. Verifiers can reconstruct the entire computation from the chain of `OP_RETURN` outputs.

---

## Chronicle-Related Assumptions

### What is Chronicle?

The **BSV Chronicle** upgrade (2024) restores Bitcoin's original Script semantics as documented in Satoshi Nakamoto's code comments and early Bitcoin forums. Key restorations:

- `OP_CAT` — concatenate two stack items
- `OP_SUBSTR` — extract substring
- `OP_LEFT`, `OP_RIGHT` — string slicing
- `OP_SPLIT` — split byte array at position
- `OP_NUM2BIN`, `OP_BIN2NUM` — numeric/binary conversions
- Lifted script size limit (previously 10KB in BTC, now configurable)
- Lifted stack item size limit (previously 520 bytes in BTC)
- Removal of per-script opcode count limits

### OTDA (Output Template Derivation Algorithm)

OTDA is a Chronicle-era covenant mechanism that allows a locking script to:
1. Inspect the spending transaction's outputs at Script execution time.
2. Enforce that the spending transaction commits to a specific output template.

**SIGHASH Flag:** Chronicle introduces `SIGHASH_OTDA = 0x20`. This flag causes the signature to commit to the output template rather than specific output scripts, enabling flexible covenant chains.

Without `SIGHASH_OTDA` support in the SDK, the covenant chain cannot be implemented safely.

---

## Why Live Mode is Not Implemented

### SDK Status (as of 2025-05)

| Feature | Status |
|---------|--------|
| `@bsv/sdk` basic transaction construction | ✅ Available |
| `@bsv/sdk` P2PKH signing | ✅ Available |
| `@bsv/sdk` OP_RETURN output | ✅ Available |
| Chronicle opcode support (`OP_CAT`, etc.) | ⚠️ Partially available |
| OTDA `SIGHASH = 0x20` flag | ❌ Not in current SDK |
| Chronicle covenant script templates | ❌ Not available |
| ARC broadcasting endpoint | ✅ Available (but requires funded UTXO) |

### Decision

Per the project's **Hard Constraint**: 

> "Before implementing Live Mode, verify that the selected BSV SDK supports the required post-Chronicle Script features. If support is incomplete, build a correct simulation and expose the Script template as documentation instead of broadcasting invalid transactions."

Live Mode is therefore intentionally **not implemented**. The simulation correctly models the transaction chain semantics, and this document provides the full Script specification for future implementation when the Chronicle SDK matures.

---

## BSV Stack Compliance

| Package | Purpose | Official? |
|---------|---------|-----------|
| `@bsv/sdk` | Transaction construction, script assembly | ✅ BSV Association official |
| WhatsOnChain API | TX lookup, fallback broadcasting reference | ✅ BSV ecosystem |
| Web Crypto API | SHA-256 for deterministic TXID simulation | ✅ Browser standard |

### Future Packages (for Live Mode)

| Package | Purpose |
|---------|---------|
| `@bsv/sdk` (Chronicle version) | Chronicle opcodes, OTDA SIGHASH |
| `@bsv/wallet-toolbox` | BRC-100 wallet interaction |
| ARC API | Official BSV broadcasting infrastructure |

---

## Security Considerations

- **No private keys in browser**: The `WalletAdapter` interface delegates signing to the wallet layer.
- **No hardcoded seeds/WIF/mnemonics**: Simulation mode requires no keys whatsoever.
- **Live Mode requires explicit user confirmation**: Any real broadcast must show the user the full transaction details before submission.
- **UTXO management**: In a real implementation, each step consumes one UTXO and creates one new UTXO (the continuation output) plus one `OP_RETURN` (prunable). This keeps UTXO set growth minimal.

---

## README Section: BSV Stack Compliance

```markdown
## BSV Stack Compliance

This project targets the post-Chronicle BSV protocol.

### Packages Used

- **@bsv/sdk** (official BSV Association SDK): Used for transaction construction, 
  script templates, and signing. This is the primary official SDK for BSV development.
  
- **WhatsOnChain API**: Used for transaction lookup and as a reference for broadcasting.
  WhatsOnChain is part of the BSV ecosystem and provides a publicly documented REST API.

### Live Mode Status

Live broadcasting requires Chronicle-specific features (`SIGHASH_OTDA = 0x20`) 
that are not yet available in the stable @bsv/sdk release. Simulation Mode 
provides full computational correctness. See `/docs/script-design.md` for 
the complete Script specification.
```
