# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### chain23 (React + Vite, path: /)
**23-Chain: BitcoinSV Universal Turing Machine**

A Wolfram (2,3) Turing Machine simulator where each computation step is modeled as a BSV blockchain transaction.

Key files:
- `artifacts/chain23/src/core/turing.ts` — Wolfram (2,3) Turing logic (pure, no BSV)
- `artifacts/chain23/src/core/tape.ts` — Dynamic infinite tape
- `artifacts/chain23/src/core/encoder.ts` — State → base-3 → hex encoding
- `artifacts/chain23/src/bsv/txSimulator.ts` — TXID = SHA256(encodedState), SimulatedTx type
- `artifacts/chain23/src/bsv/walletAdapter.ts` — Simulated wallet adapter
- `artifacts/chain23/src/bsv/liveTx.ts` — Real P2PKH + OP_RETURN tx builder/broadcaster (@bsv/sdk v2)
- `artifacts/chain23/src/bsv/scriptModes.ts` — Three script mode definitions + template generators
- `artifacts/chain23/src/hooks/useTuringMachine.ts` — Main hook; includes buildLiveStep/commitLiveStep
- `artifacts/chain23/src/components/ScriptModeSelector.tsx` — Three-mode expandable card selector
- `artifacts/chain23/src/components/LiveModePanel.tsx` — UTXO + WIF config for live broadcasting
- `artifacts/chain23/src/components/BroadcastDialog.tsx` — Pre-broadcast confirmation dialog
- `artifacts/chain23/src/pages/SimulatorPage.tsx` — Full simulator UI
- `docs/script-design.md` — Bitcoin Script design document (Phase 2)

Key protocol facts:
- Genesis 2020: restored OP_CAT, OP_SPLIT, OP_NUM2BIN, OP_BIN2NUM
- Chronicle 2024: introduced SIGHASH_OTDA = 0x20 (only Chronicle-specific blocker for live mode)
- OP_PUSH_TX (genesis-covenant mode): no Chronicle dependency

Modes:
- Record-Only: Sim active ✓, Live active ✓ (@bsv/sdk — builds/signs/broadcasts real P2PKH + OP_RETURN)
- Genesis Covenant: Sim active ✓, Live template (SDK work remaining for OP_PUSH_TX)
- Chronicle OTDA: Sim active ✓, Live TODO (blocked on SIGHASH_OTDA SDK support)

### api-server (Express 5, path: /api)
Backend API server. Currently only health check. No database provisioned yet.
