# 23-Chain Open Questions

## Source Legend

- [PROMPT] Historical prompt source: `docs/origin/prompts/2026-05-original-hackathon-prompt.md`.
- [README] Current repository README: `README.md`.
- [CODE] Current implementation and project documents under `artifacts/chain23/` and `docs/`.
- [USER] User-provided extraction context: `docs/origin/prompt_extraction_notes.md`.
- [INFERENCE] Inferred open question from the tagged sources; uncertainty is intentional.

## Product Scope

- [INFERENCE] Is the authoritative current scope a research/demo artifact, a live transaction broadcaster, or a stepping stone toward wallet-integrated covenant execution?
- [INFERENCE] Which source should be authoritative when the original prompt, README, current implementation, and future direction disagree?
- [USER] Which hackathon-era assumptions are intentionally retained, and which should be treated as historical artifacts only?
- [USER] Should the possible future BTC variant remain in the current requirements model, or should it be tracked separately?

## Live Mode Status

- [CODE] Is Record-Only Live Mode considered implemented and supported, given that `liveTx.ts` and UI components implement it while `api.ts` and `docs/script-design.md` still say live broadcasting is not implemented?
- [CODE] Should `docs/script-design.md` be interpreted as stale regarding Record-Only Live Mode, or is the code path still experimental?
- [INFERENCE] Should Dry Run advancing local machine state be treated as required behavior, review convenience, or audit ambiguity?
- [INFERENCE] Should dry-run placeholder IDs be allowed in the same transaction log as real TXIDs?
- [PROMPT] Is WhatsOnChain broadcasting acceptable for Record-Only Live Mode, or should ARC be required before the mode is considered complete?
- [USER] What exact behavior is expected for API-key based fast transaction submission?

## Wallet and Key Handling

- [PROMPT] Is direct frontend WIF entry acceptable as a temporary Record-Only Live Mode bridge despite the requirement that the frontend must not directly manage private keys?
- [README] What is the expected boundary between the current placeholder `WalletAdapter` interface and the future BRC-100-compatible wallet path?
- [INFERENCE] Should signing be delegated to the wallet layer for all live modes, or only for future covenant modes?
- [INFERENCE] Is in-memory WIF handling acceptable for demos if the UI makes the risk explicit?

## Money Representation

- [PROMPT] Does the strict `BigInt` requirement apply to all money amounts, including live UTXO satoshis, fees, and change, or only to simulation balance?
- [CODE] If `@bsv/sdk` requires `number` for P2PKH unlocking, is the current live money representation an intentional exception?
- [INFERENCE] What maximum UTXO value or fee range must be supported by the live transaction path?

## Encoding and Replay

- [PROMPT] Should the public function named `encodeState` return hex as the prompt states, or is the current split between `encodeState` and `encodeStateToHex` the accepted contract?
- [INFERENCE] Should decoded state be fully validated for state range, head position, and tape symbols?
- [INFERENCE] Should the rule-table identity be included in replay metadata if future rules such as Rule 110 are supported?
- [INFERENCE] Should chain replay verification treat the log as a sequence of OP_RETURN payloads, a sequence of transaction IDs, or both?
- [INFERENCE] What is the canonical initial state format for verifying a full transaction-chain computation?

## Tape Semantics

- [CODE] Is the current `offset` model part of required tape semantics or only an implementation detail?
- [PROMPT] Does strict left-edge behavior require absolute head positions never to become negative, or should future infinite-left semantics preserve logical negative coordinates?
- [CODE] Should `parseTapeString` continue silently dropping invalid characters when called directly, or should all parsing reject malformed input by default?
- [INFERENCE] What input size counts as "several thousand characters" for acceptance and performance testing?

## Protocol and Script Direction

- [README] Should protocol evolution be defined as three UI modes, four conceptual levels, or both?
- [CODE] Should the state hash commitment level in `docs/script-design.md` become a named mode, or is it only explanatory background?
- [PROMPT] Is Genesis Covenant Mode expected to enforce the complete Wolfram (2,3) transition in Script, or is committing to a precomputed next-state hash sufficient for an intermediate milestone?
- [PROMPT] What evidence is required before Chronicle OTDA support can be marked implementable rather than TODO?
- [USER] What adapter or facade boundary is expected for isolating Chronicle compatibility?
- [INFERENCE] Should opcode availability claims be verified against official BSV documentation before requirements are frozen?

## Testing and Evidence

- [CODE] Are manual test checklists sufficient for the current artifact, or are automated tests required before requirements are finalized?
- [INFERENCE] What minimum acceptance tests prove deterministic replay across simulation, dry run, and record-only live modes?
- [INFERENCE] Should tests assert that simulated TXIDs are stable across browsers and environments?
- [PROMPT] What exact threshold defines "no UI freeze" for more than 1000 steps?
- [INFERENCE] Should large-step performance be measured at 100, 1000, or more steps?

## Documentation Ownership

- [CODE] Which document owns the canonical Live Mode status: `README.md`, `docs/script-design.md`, `scriptModes.ts`, or future requirements files?
- [CODE] Should stale Replit-era references be retained for provenance or removed from future-facing documentation?
- [USER] How should historical email-address audit concerns from Replit-era commits be tracked relative to functional requirements?
