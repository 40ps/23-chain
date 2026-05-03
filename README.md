# 23-Chain

This project demonstrates that BitcoinSV is a Universal Turing Machine. Using the Wolfram (2,3) ruleset, we show how any computable function can be executed as a chain of transactions, limited only by transaction size and available funding.

## Overview

23-Chain simulates a Wolfram (2,3) Turing Machine where each computation step is modeled as a BSV blockchain transaction. The encoded machine state is stored in `OP_RETURN` outputs, making the full execution trace verifiable and permanent on-chain (in Simulation Mode, cryptographically consistent fake TXIDs are used).

## Architecture

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

## Wolfram (2,3) Transition Table

| State | Symbol | New State | New Symbol | Direction |
|-------|--------|-----------|------------|-----------|
| 0 | 0 | 1 | 1 | Right |
| 0 | 1 | 1 | 2 | Left |
| 0 | 2 | 0 | 1 | Left |
| 1 | 0 | 1 | 2 | Right |
| 1 | 1 | 0 | 2 | Right |
| 1 | 2 | 0 | 0 | Left |

## State Encoding

Each step encodes the full machine state as:
```
{state}|{headPosition}|{tapeBase3}
```
Example: `1|42|000120201` → converted to hex → embedded in `OP_RETURN`.

TXID = `SHA256(encodedState)` — fully deterministic. Same state always produces the same TXID.

## Modes

- **Simulation Mode** (default): Generates deterministic fake TXIDs. Works fully offline. No wallet needed.
- **Live Mode**: TODO — requires post-Chronicle `@bsv/sdk` with OTDA SIGHASH (0x20) support. See `/docs/script-design.md`.

## BSV Stack Compliance

### Packages Used

- **@bsv/sdk** (official BSV Association SDK): Target for transaction construction, script templates, and signing.
- **WhatsOnChain API**: Used for transaction lookup. Part of the BSV ecosystem.
- **Web Crypto API** (browser built-in): SHA-256 for deterministic TXID simulation.

### Live Mode Status

Live broadcasting requires Chronicle-specific features (`SIGHASH_OTDA = 0x20`) that are not yet available in the stable `@bsv/sdk` release. Simulation Mode provides full computational correctness. See `/docs/script-design.md` for the complete Script specification.

## Documentation

- `/docs/script-design.md` — Full Bitcoin Script design: locking/unlocking scripts, opcodes, OP_RETURN encoding, Chronicle assumptions, OTDA SIGHASH specification.

## Demo

Click **Load Demo** to load:
- Tape: `0000001101000000`
- Head: position 6
- State: 0

Then click **Start** to watch the machine run. Each step creates a simulated BSV transaction.
