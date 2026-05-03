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
- `artifacts/chain23/src/bsv/txSimulator.ts` — TXID = SHA256(encodedState)
- `artifacts/chain23/src/bsv/walletAdapter.ts` — BRC-100 wallet interface
- `artifacts/chain23/src/bsv/api.ts` — WhatsOnChain API stub
- `artifacts/chain23/src/hooks/useTuringMachine.ts` — Main React hook
- `artifacts/chain23/src/pages/SimulatorPage.tsx` — Full simulator UI
- `docs/script-design.md` — Bitcoin Script design document (Phase 2)

Modes: Simulation (active), Live (TODO — requires Chronicle SDK).

### api-server (Express 5, path: /api)
Backend API server. Currently only health check. No database provisioned yet.
