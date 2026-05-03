# 23-Chain: Bitcoin Script Design Document

**Project:** 23-Chain — Wolfram (2,3) Turing Machine as BSV Transaction Chain  
**Version:** 1.1  
**Status:** Simulation Mode active. Live Mode pending SIGHASH_OTDA SDK support (OTDA path) or OP_PUSH_TX implementation (Genesis-compatible path).

---

## Overview

This document describes the Bitcoin Script architecture for encoding Turing Machine state transitions as BSV transactions. Each computational step of the Wolfram (2,3) machine corresponds to one BSV transaction, making the chain of transactions a complete, verifiable execution trace of a Turing computation.

---

## BSV Protocol Upgrade Timeline (relevant to this project)

| Upgrade | Date | What it enabled |
|---------|------|-----------------|
| **Genesis** | Feb 2020 | Restored `OP_CAT`, `OP_SPLIT`, `OP_NUM2BIN`, `OP_BIN2NUM`, `OP_SUBSTR`, `OP_LEFT`, `OP_RIGHT`. Lifted script size and stack depth limits. |
| **Chronicle** | 2024 | Introduced OTDA (Output Template Derivation Algorithm) and `SIGHASH_OTDA = 0x20`. Does NOT re-introduce opcodes that Genesis already restored. |

**Important:** `OP_CAT`, `OP_SPLIT`, and all related data-manipulation opcodes are available on BSV **since Genesis (2020)**. They are not Chronicle-specific. Chronicle's unique contribution is the OTDA covenant mechanism and its associated sighash flag.

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

## Transaction Structure

Each step produces two outputs:

```
OUTPUT[0]:
  scriptPubKey: OP_RETURN <hexEncodedState>
  value: 0 satoshis (unspendable, prunable from UTXO set)

OUTPUT[1]:
  scriptPubKey: OP_DUP OP_HASH160 <nextStepPubKeyHash> OP_EQUALVERIFY OP_CHECKSIG
  value: (previous output value) - (miner fee) satoshis
```

This structure works on vanilla BSV (pre-Genesis, Genesis, and Chronicle). The `OP_RETURN` output carries the state commitment. The P2PKH output funds the next step.

---

## Locking Script (scriptPubKey)

### Level 1 — State Logging (works on all BSV, no special opcodes)

Simple P2PKH with an `OP_RETURN` commitment. No on-chain verification of transition correctness — correctness is verified off-chain by replaying the OP_RETURN chain.

```
OP_DUP OP_HASH160 <pubKeyHash> OP_EQUALVERIFY OP_CHECKSIG
```

### Level 2 — State Commitment Verification (requires Genesis 2020+)

The locking script commits to the hash of the next valid state. The spender must provide the next encoded state that satisfies the Turing transition rules.

```
-- Locking script
OP_PUSHDATA <SHA256(validNextEncodedState)>
OP_SWAP
OP_SHA256
OP_EQUAL
OP_VERIFY
OP_DUP OP_HASH160 <pubKeyHash>
OP_EQUALVERIFY OP_CHECKSIG
```

This requires `OP_SHA256` (always available) and `OP_SWAP`/`OP_VERIFY` (always available). No Genesis opcodes needed for this basic form — but the next-state hash must be pre-computed off-chain and embedded at script creation time.

### Level 3 — Full Covenant with OP_PUSH_TX (requires Genesis 2020+)

Using the transaction preimage technique (OP_PUSH_TX), the locking script can inspect the spending transaction's outputs at execution time. The prover provides the full transaction preimage; the script verifies it matches the sighash commitment, then parses the outputs using `OP_SPLIT`/`OP_CAT` to enforce the next state.

```
-- Conceptual OP_PUSH_TX covenant (Genesis-compatible)
<serialized spending tx preimage pushed by prover>
OP_DUP
OP_SHA256 OP_SHA256          -- double-SHA256
<expected sighash>
OP_EQUALVERIFY               -- verify preimage is authentic
-- now parse output[0] of the spending tx using OP_SPLIT/OP_CAT
-- verify it contains OP_RETURN <validNextState>
-- apply Wolfram (2,3) transition table in script
```

`OP_CAT` and `OP_SPLIT` are available since **Genesis 2020** — no Chronicle required for this approach.

### Level 4 — OTDA Covenant (requires Chronicle SIGHASH_OTDA)

The cleanest covenant form. The locking script uses `SIGHASH_OTDA = 0x20` so the signature commits to the output template rather than specific output scripts. The script then enforces that the spending transaction's outputs include a valid next state.

This is the only part that requires Chronicle. It is the most elegant implementation but not strictly necessary — Level 3 (OP_PUSH_TX) achieves equivalent enforcement with Genesis opcodes at the cost of more complex script construction.

---

## Unlocking Script (scriptSig)

```
<signature>                    -- ECDSA signature (SIGHASH_ALL or SIGHASH_OTDA)
<pubKey>                       -- Public key
<encodedNextState>             -- The next Turing state (verified against locking script)
```

For Level 3 (OP_PUSH_TX):
```
<signature>
<pubKey>
<encodedNextState>
<serialized spending tx preimage>   -- additional witness data for covenant enforcement
```

---

## Used Opcodes

| Opcode | Purpose | Available Since |
|--------|---------|-----------------|
| `OP_RETURN` | State commitment output | Always (Satoshi) |
| `OP_DUP` | Stack manipulation | Always |
| `OP_HASH160` | P2PKH address derivation | Always |
| `OP_EQUALVERIFY` | Equality check + verify | Always |
| `OP_CHECKSIG` | Signature verification | Always |
| `OP_SHA256` | State hash commitment | Always |
| `OP_SWAP` | Stack reordering | Always |
| `OP_VERIFY` | Assert top of stack is true | Always |
| `OP_CAT` | Binary concatenation for state assembly | **Genesis 2020** |
| `OP_SPLIT` | Parsing tape fields from state string | **Genesis 2020** |
| `OP_NUM2BIN` | Integer → byte encoding | **Genesis 2020** |
| `OP_BIN2NUM` | Byte → integer decoding | **Genesis 2020** |
| `OP_SUBSTR` | Substring extraction | **Genesis 2020** |
| `SIGHASH_OTDA (0x20)` | Output template sighash for OTDA covenants | **Chronicle only** |

---

## State Transition Validation

The locking script can encode the Wolfram (2,3) transition table directly in Script. For each step, the unlocking script provides the new state, and the locking script verifies it follows the transition rules.

**Transition table as Script conditions (Genesis-compatible):**

```
-- State 0, Symbol 0 → Write 1, Move Right, New State 1
OP_IF <state==0> OP_IF <symbol==0>
  <check newState==1> <check newSymbol==1> <check direction==Right>
OP_ENDIF OP_ENDIF
...
```

This is feasible in BSV since **Genesis 2020** because:
- `OP_CAT`/`OP_SPLIT` for tape string parsing and assembly are available
- No opcode count limits (lifted by Genesis)
- Lifted script size limits (lifted by Genesis)
- Stack items can be arbitrary length (lifted by Genesis)

Chronicle's OTDA makes this *cleaner* (no need to push the full tx preimage) but is not the only path.

---

## What is the Only Chronicle-Specific Obstacle?

**Yes — `SIGHASH_OTDA = 0x20` is the only Chronicle-specific blocker for the OTDA covenant path.**

For the OP_PUSH_TX covenant path (Level 3 above), **no Chronicle features are needed at all**. The Genesis opcodes (`OP_CAT`, `OP_SPLIT`, `OP_NUM2BIN`) restored in February 2020 are fully sufficient to implement on-chain state transition verification. The implementation is more verbose than OTDA but produces equivalent enforcement guarantees.

### Summary of paths to Live Mode

| Approach | Protocol required | On-chain verification | Complexity |
|----------|------------------|-----------------------|------------|
| P2PKH + OP_RETURN (logging only) | Pre-Genesis | Off-chain only | Low |
| State hash commitment | Pre-Genesis | Hash match only | Low |
| OP_PUSH_TX covenant | Genesis 2020 | Full Turing rule | High |
| OTDA covenant | Chronicle | Full Turing rule | Medium |

---

## Why Live Mode is Not Yet Implemented

### SDK Status (as of 2025-05)

| Feature | Status |
|---------|--------|
| `@bsv/sdk` basic transaction construction | ✅ Available |
| `@bsv/sdk` P2PKH signing | ✅ Available |
| `@bsv/sdk` OP_RETURN output | ✅ Available |
| `OP_CAT`, `OP_SPLIT`, `OP_NUM2BIN` (Genesis) | ✅ Available on-chain since 2020 |
| Custom script construction via `@bsv/sdk` | ✅ Available (manual opcode assembly) |
| OTDA `SIGHASH = 0x20` flag | ❌ Not in current SDK |
| OTDA covenant script templates | ❌ Not available |
| ARC broadcasting endpoint | ✅ Available (requires funded UTXO) |

### Decision

The current blocker for the OTDA path is solely `SIGHASH_OTDA = 0x20` not being exposed by the stable `@bsv/sdk`. For the OP_PUSH_TX path, all required opcodes are available on-chain — the remaining work is SDK-level script construction and a funded wallet integration. Neither path requires waiting for Chronicle SDK support at the opcode level.

Live Mode is intentionally not implemented in this build to avoid broadcasting transactions without complete covenant verification. The simulation correctly models all transaction chain semantics.

---

## Chronicle-Related Assumptions

### What is Chronicle?

**BSV Chronicle** (2024) introduced:
- **OTDA** (Output Template Derivation Algorithm) — allows a locking script to enforce the structure of the spending transaction's outputs
- **`SIGHASH_OTDA = 0x20`** — causes the signature to commit to the output template, enabling flexible covenant chains without pushing the full tx preimage

Chronicle does **not** re-introduce `OP_CAT`, `OP_SPLIT`, or related opcodes — those were already restored by the Genesis upgrade in February 2020.

### Genesis (February 2020)

The Genesis upgrade restored:
- `OP_CAT`, `OP_SUBSTR`, `OP_LEFT`, `OP_RIGHT`, `OP_SPLIT`, `OP_NUM2BIN`, `OP_BIN2NUM`
- Lifted the 10KB script size limit
- Lifted the 520-byte stack item size limit
- Removed the per-script opcode count limit

These are all available today on mainnet BSV without any Chronicle dependency.

---

## BSV Stack Compliance

| Package | Purpose | Official? |
|---------|---------|-----------|
| `@bsv/sdk` | Transaction construction, script assembly | ✅ BSV Association official |
| WhatsOnChain API | TX lookup, fallback broadcasting reference | ✅ BSV ecosystem |
| Web Crypto API | SHA-256 for deterministic TXID simulation | ✅ Browser standard |

### Future Packages (for Live Mode)

| Package | Purpose | Required for |
|---------|---------|--------------|
| `@bsv/sdk` (with OTDA support) | SIGHASH_OTDA signing | OTDA covenant path |
| `@bsv/wallet-toolbox` | BRC-100 wallet interaction | Both live paths |
| ARC API | Official BSV broadcasting | Both live paths |

---

## Security Considerations

- **No private keys in browser**: The `WalletAdapter` interface delegates signing to the wallet layer.
- **No hardcoded seeds/WIF/mnemonics**: Simulation mode requires no keys whatsoever.
- **Live Mode requires explicit user confirmation**: Any real broadcast must show the user the full transaction details before submission.
- **UTXO management**: Each step consumes one UTXO (continuation input) and creates one new UTXO (continuation output) plus one `OP_RETURN` (prunable). UTXO set growth is O(1) per run — always exactly one live continuation UTXO.

---

## README Section: BSV Stack Compliance

```markdown
## BSV Stack Compliance

This project targets post-Genesis BSV (February 2020+). Chronicle is referenced
only for the OTDA covenant path; the OP_PUSH_TX covenant path requires only Genesis.

### Packages Used

- **@bsv/sdk** (official BSV Association SDK): Used for transaction construction,
  script templates, and signing.

- **WhatsOnChain API**: Used for transaction lookup. Part of the BSV ecosystem.

### Opcode Availability

`OP_CAT`, `OP_SPLIT`, `OP_NUM2BIN`, `OP_BIN2NUM` and all data-manipulation opcodes
are available on BSV mainnet since the Genesis upgrade (February 2020).
They are not Chronicle-specific.

### Live Mode Status

The only Chronicle-specific dependency is `SIGHASH_OTDA = 0x20`, required for the
OTDA covenant path. An alternative implementation using the OP_PUSH_TX technique
(Genesis-compatible) requires no Chronicle features. See `/docs/script-design.md`.
```
