# 23-Chain — BitcoinSV Turing Machine Demo
*A Turing Machine executed as a chain of Bitcoin SV transactions*

23-Chain is a visual demonstration of how a universal (2,3) Wolfram Turing Machine can be modeled as a sequence of Bitcoin SV transactions.

The application simulates a Turing machine step-by-step and represents each state transition as a blockchain transaction — either in simulation or as a real on-chain record using OP_RETURN.

---

## 🚀 What this project shows

This project explores the boundary between:

- **recording computation on-chain**
- **enforcing computation on-chain via Bitcoin Script**

It demonstrates how computation can be serialized into transaction chains, and how future covenant designs could validate state transitions directly in Script.

---

## 📊 Demo

Quick demo:

1. Click **Load Demo**
2. Click **Step** multiple times
3. Observe state transitions
4. (Optional) Enable **Dry Run** or **Live Mode**

---

## 🧠 Core Concepts

- **Wolfram (2,3) Turing Machine**
  - 2 states (0, 1)
  - 3 symbols (0, 1, 2)
- **Deterministic state transitions**
- **Infinite tape abstraction**
- **Blockchain as state transition log**

## 🔢 Wolfram (2,3) Transition Rules


| State | Symbol | New State | New Symbol | Direction |
|-------|--------|-----------|------------|-----------|
| 0 | 0 | 1 | 1 | Right |
| 0 | 1 | 1 | 2 | Left |
| 0 | 2 | 0 | 1 | Left |
| 1 | 0 | 1 | 2 | Right |
| 1 | 1 | 0 | 2 | Right |
| 1 | 2 | 0 | 0 | Left |

```javascript
const wolfram23Lookup = {
  0: {
    0: [1, 1, 1],
    1: [1, 2, -1],
    2: [0, 1, -1]
  },
  1: {
    0: [1, 2, 1],
    1: [0, 2, 1],
    2: [0, 0, -1]
  }
};
```


---

## ⚙️ Features

### 🎛️ Interactive Simulation
- Visual tape representation
- Step-by-step execution
- Deterministic transition log
- Loadable demo preset

### ⛓️ Record-Only Live Mode
- Builds and broadcasts real Bitcoin SV transactions
- Encodes machine state into `OP_RETURN`
- Uses standard **P2PKH + OP_RETURN**
- No on-chain enforcement of transitions (recording only)

### 🧪 Dry Run Mode
- Builds full transaction
- Shows:
  - raw transaction hex
  - estimated fee
  - payload size
- Does **not broadcast**
- Safe for testing

### 📜 Transaction Log
- Deterministic TXIDs (simulation)
- Real TXIDs (live mode)
- Full audit trail of transitions

### 📤 CSV Export
Includes:
- timestamp
- mode (simulation / dry-run / live)
- state before / after
- encoded state hex
- payload size

---

## 🔄 Execution Modes

### 1. Simulation Mode
- Pure in-browser execution
- Deterministic and fast
- No blockchain interaction

---

### 2. Record-Only Live Mode
- Real BSV transaction broadcast
- State stored in OP_RETURN
- Does **not validate transitions on-chain**

---

## 🧾 Script Modes (Conceptual)
These modes illustrate increasing levels of on-chain verification:

### 🟢 Record-Only Mode
- P2PKH + OP_RETURN
- Records state only
- No validation in Script

### 🟡 Genesis Covenant Mode (Template)
- OP_PUSH_TX style construction
- Uses Genesis-restored opcodes (e.g. OP_CAT, OP_SPLIT)
- Intended to validate transitions on-chain
- Not yet fully implemented

### 🔵 Chronicle OTDA Mode (Template)
- Uses `SIGHASH_OTDA = 0x20`
- Cleaner covenant construction
- Depends on Chronicle-compatible tooling

---

## 🧮 State Encoding

Each step encodes the full machine state as:
```
{state}|{headPosition}|{tapeBase3}
```
Example: `1|42|000120201` → converted to hex → embedded in `OP_RETURN`.

TXID = `SHA256(encodedState)` 

→ deterministic mapping:
same state → same TXID

---

## 💸 Funding Model

- Each step consumes transaction fees
- Live mode requires:
  - a valid UTXO
  - a WIF private key (not stored)
- No keys are persisted or logged

---

## 🔐 Security Notes

- Private keys are never stored
- WIF is only used in-memory for signing
- Explicit user confirmation required before broadcast
- Dry Run mode available for safe testing

---

## 🧪 Testing

See:

docs/testing.md

---


## 🧱 Architecture

Core logic and UI are separated from blockchain interaction:

```
artifacts/chain23/src/
├── core/
│   ├── turing.ts       # Wolfram (2,3) Turing logic — pure, no BSV dependency
│   ├── tape.ts         # Dynamic infinite tape (auto-expands in both directions)
│   └── encoder.ts      # State → base-3 string → hex (for OP_RETURN)
├── bsv/
│   ├── txSimulator.ts  # Simulated transactions: TXID = SHA256(encodedState)
│   ├── api.ts          # WhatsOnChain API stub (lookup + rate limit handling)
│   └── walletAdapter.ts # BRC-100 wallet interface + SimulationWalletAdapter
├── hooks/
│   └── useTuringMachine.ts  # Main React hook wiring everything together
└── pages/
    └── SimulatorPage.tsx    # Full UI: tape, log, controls, transition table
```

---

## 🔮 Roadmap

- [ ] Genesis Covenant Live Mode
- [ ] Chronicle OTDA Live Mode
- [ ] WalletAdapter (BRC-100 compatible)
- [ ] Multi-UTXO funding
- [ ] Chain replay verifier

---

## 📜 License

MIT License
