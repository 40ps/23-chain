# 23-Chain: BSV Universal Turing Machine

A Wolfram (2,3) Turing Machine simulator where each computation step is modeled as a BitcoinSV blockchain transaction. Built with React + Vite + TypeScript + `@bsv/sdk v2`.

---

## What It Demonstrates

The Wolfram (2,3) Turing Machine — 2 states, 3 symbols — is provably universal (Smith 2007). This means any computable function can be represented through appropriate tape initialization. 23-Chain makes each transition step a BSV transaction, encoding the resulting machine state in an `OP_RETURN` output.

---

## Simulation Mode (default)

Steps run entirely offline. Each step:

1. Reads the current tape cell and machine state
2. Applies the Wolfram (2,3) transition rule
3. Writes the new symbol, moves the head, updates state
4. Creates a *simulated* transaction: `TXID = SHA256(encodedState)` (deterministic, no randomness)
5. Encodes the resulting state as `OP_RETURN` hex in the transaction log

No network access is required. The simulated balance and TXID are local only.

---

## Record-Only Live Mode

**What it does:** Each computation step is recorded as a real P2PKH transaction on BSV, with an `OP_RETURN` output encoding the resulting Turing state.

**What it does NOT do:** It does not enforce transition validity on-chain. The locking script is a standard P2PKH — any correctly signed spend is valid. Correctness of the state transition is guaranteed *off-chain* by replaying the `OP_RETURN` chain and verifying the transition table was followed.

### Transaction layout (per step)

```
Input[0]   — spends the funded UTXO (P2PKH, SIGHASH_ALL)
Output[0]  — OP_RETURN <encodedStateHex>  (0 sat, unspendable state record)
Output[1]  — P2PKH change to same address (next UTXO for the following step)
```

### OP_RETURN payload format

```
{state}|{headPosition}|{tapeBase3}
```

Example: `1|42|000120201` — then UTF-8 hex-encoded for `OP_RETURN`.

### Requirements

- A funded P2PKH UTXO on BSV mainnet or testnet (minimum 600 sat recommended)
- The WIF private key that controls that UTXO
- Network connectivity to WhatsOnChain for broadcasting

### Security notes

- The WIF is held **only in component state** (React memory). It is never written to localStorage, sessionStorage, a server, or any log.
- The address is derived locally and shown in the UI before activation so you can verify it matches the UTXO owner.
- Each step shows the full signed raw transaction hex, fee, and payload **before broadcast**. Nothing is sent without explicit confirmation.

### Dry Run mode

Enable Dry Run in the Live Mode panel to build and sign the transaction without broadcasting. The full signed hex and would-be fee are displayed. The machine state advances locally so you can verify payload correctness without spending satoshis.

---

## Script Modes

| Mode | Sim | Live | Notes |
|------|-----|------|-------|
| Record-Only | Active | **Active** | P2PKH + OP_RETURN. No Script enforcement of transitions. |
| Genesis Covenant | Active | Template | Uses OP_PUSH_TX / OP_SPLIT / OP_CAT to verify transitions on-chain. SDK work remaining. |
| Chronicle OTDA | Active | TODO | Requires SIGHASH_OTDA (0x20) — Chronicle 2024 only. Not yet in stable SDK. |

---

## CSV Export

Exported columns:

| Column | Description |
|--------|-------------|
| `Step` | Step number |
| `Timestamp` | Unix millisecond timestamp |
| `Mode` | `simulation`, `live-dry-run`, or `live-broadcast` |
| `TXID` | Real TXID (live) or SHA256(encodedState) (sim) or `DRY-RUN:…` |
| `StateBefore` | Encoded state before this transition |
| `StateAfter` | Encoded state after this transition (matches OP_RETURN payload) |
| `EncodedStateHex` | Hex of the OP_RETURN payload |
| `PayloadBytes` | Byte length of the OP_RETURN payload |
| `Description` | Human-readable step description |

---

## TODO: Upcoming Milestones

### Genesis Covenant Live Mode
Build the full OP_PUSH_TX transaction preimage and covenant locking script using `@bsv/sdk` Script primitives. The locking script double-hashes the spending transaction preimage, then uses `OP_SPLIT` / `OP_CAT` to parse output commitments and enforce the transition rule on-chain. All opcodes (OP_CAT, OP_SPLIT, OP_NUM2BIN) are available since BSV Genesis 2020.

### Chronicle OTDA Live Mode
Use `SIGHASH_OTDA = 0x20` (introduced Chronicle 2024) to commit to an output template rather than the specific output scripts. This eliminates the need to push the full spending tx preimage — the signing layer enforces that the correct next state is produced. Blocked on `@bsv/sdk` Chronicle support reaching stable release.

### WalletAdapter / BRC-100 Integration
Replace the WIF field with a BRC-100 wallet interface so users can sign with a desktop or mobile BSV wallet without exposing their private key to the browser.

### Multi-UTXO Funding
Allow the user to specify a list of UTXOs to use in sequence, or fund from a wallet adapter that manages UTXO selection automatically.

---

## Key Files

| File | Purpose |
|------|---------|
| `src/core/turing.ts` | Wolfram (2,3) transition table — pure, no BSV |
| `src/core/tape.ts` | Dynamic infinite tape, pure immutable operations |
| `src/core/encoder.ts` | State → `{state}\|{head}\|{tapeBase3}` → hex |
| `src/bsv/txSimulator.ts` | Offline simulation, SHA256 TXID, CSV export |
| `src/bsv/liveTx.ts` | Real tx builder / broadcaster (`@bsv/sdk v2`) |
| `src/bsv/scriptModes.ts` | Script mode definitions + template generators |
| `src/hooks/useTuringMachine.ts` | Main hook: engine + sim + live step lifecycle |
| `src/components/LiveModePanel.tsx` | UTXO + WIF + Dry Run configuration |
| `src/components/BroadcastDialog.tsx` | Pre-broadcast review + lifecycle UI |
| `src/pages/SimulatorPage.tsx` | Full simulator UI |
| `docs/testing.md` | Manual test checklist |

---

## Protocol Notes

- **Genesis 2020**: restored `OP_CAT`, `OP_SPLIT`, `OP_NUM2BIN`, `OP_BIN2NUM` on BSV mainnet
- **Chronicle 2024**: introduced `SIGHASH_OTDA = 0x20`
- `OP_PUSH_TX` (Genesis Covenant mode) has no Chronicle dependency — it works with `SIGHASH_ALL`
