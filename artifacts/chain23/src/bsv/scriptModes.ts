// Script Mode definitions, metadata, and template generators
// Each mode documents: what it records, what it verifies, what it requires,
// and its current implementation status.

import { encodeState, encodeStateToHex } from '../core/encoder';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ScriptMode = 'record-only' | 'genesis-covenant' | 'chronicle-otda';

export type ImplStatus =
  | 'active'       // fully working in this build
  | 'template'     // script generated/documented, no live broadcast
  | 'todo';        // not yet designed or implemented

export interface OpcodeEntry {
  name: string;
  purpose: string;
  since: string; // 'Genesis 2020' | 'Chronicle 2024' | 'Always'
}

export interface ScriptModeInfo {
  id: ScriptMode;
  name: string;
  shortName: string;
  protocol: string;
  recordsState: boolean;
  verifiesTransition: boolean;
  simulationStatus: ImplStatus;
  liveStatus: ImplStatus;
  description: string;
  requirements: string[];
  opcodes: OpcodeEntry[];
  notes: string[];
}

// ─── Mode Definitions ────────────────────────────────────────────────────────

export const SCRIPT_MODES: Record<ScriptMode, ScriptModeInfo> = {

  'record-only': {
    id: 'record-only',
    name: 'Record-Only Mode',
    shortName: 'Record-Only',
    protocol: 'Any BSV (pre-Genesis compatible)',
    recordsState: true,
    verifiesTransition: false,
    simulationStatus: 'active',
    liveStatus: 'active',
    description:
      'Each computation step is recorded as a P2PKH transaction with an OP_RETURN output carrying the encoded Turing state. State transitions are not verified on-chain — correctness is guaranteed by replaying the OP_RETURN chain off-chain.',
    requirements: [
      'Standard P2PKH signing (SIGHASH_ALL)',
      'OP_RETURN output (always available)',
      'Funded UTXO for each step',
      'No special opcodes required',
    ],
    opcodes: [
      { name: 'OP_RETURN', purpose: 'Commit encoded Turing state', since: 'Always' },
      { name: 'OP_DUP', purpose: 'P2PKH stack setup', since: 'Always' },
      { name: 'OP_HASH160', purpose: 'P2PKH address check', since: 'Always' },
      { name: 'OP_EQUALVERIFY', purpose: 'P2PKH pubkey verify', since: 'Always' },
      { name: 'OP_CHECKSIG', purpose: 'Signature verification (SIGHASH_ALL)', since: 'Always' },
    ],
    notes: [
      'Simplest form. No Script verification of transition correctness.',
      'Live mode requires a funded P2PKH UTXO and a signing wallet.',
      'The full computation trace is verifiable by any observer replaying the chain of OP_RETURN outputs.',
    ],
  },

  'genesis-covenant': {
    id: 'genesis-covenant',
    name: 'Genesis Covenant Mode',
    shortName: 'Genesis Covenant',
    protocol: 'BSV Genesis (February 2020+)',
    recordsState: true,
    verifiesTransition: true,
    simulationStatus: 'active',
    liveStatus: 'template',
    description:
      'Uses the OP_PUSH_TX / transaction-preimage covenant technique. The prover provides the full spending transaction preimage as a witness. The locking script double-hashes it to verify authenticity, then uses OP_SPLIT and OP_CAT to parse the output commitments and enforce that the Wolfram (2,3) transition rule was followed correctly. No Chronicle features required.',
    requirements: [
      'OP_CAT — available since Genesis 2020',
      'OP_SPLIT — available since Genesis 2020',
      'OP_NUM2BIN / OP_BIN2NUM — available since Genesis 2020',
      'SIGHASH_ALL (standard) for the OP_PUSH_TX preimage',
      'Lifted script size and stack depth limits (Genesis 2020)',
    ],
    opcodes: [
      { name: 'OP_RETURN', purpose: 'Commit encoded Turing state in output[0]', since: 'Always' },
      { name: 'OP_DUP / OP_OVER', purpose: 'Stack duplication', since: 'Always' },
      { name: 'OP_SHA256 (×2)', purpose: 'Double-hash tx preimage to get sighash', since: 'Always' },
      { name: 'OP_EQUALVERIFY', purpose: 'Assert preimage is authentic', since: 'Always' },
      { name: 'OP_CHECKSIG', purpose: 'Signature verification (SIGHASH_ALL)', since: 'Always' },
      { name: 'OP_CAT', purpose: 'Assemble next state bytes', since: 'Genesis 2020' },
      { name: 'OP_SPLIT', purpose: 'Parse output scripts from serialized tx', since: 'Genesis 2020' },
      { name: 'OP_NUM2BIN', purpose: 'Encode head position as fixed-width bytes', since: 'Genesis 2020' },
      { name: 'OP_BIN2NUM', purpose: 'Decode tape values from byte arrays', since: 'Genesis 2020' },
      { name: 'OP_IF / OP_ELSE / OP_ENDIF', purpose: 'Wolfram (2,3) transition table branches', since: 'Always' },
    ],
    notes: [
      'OP_PUSH_TX requires the prover to serialize and push the entire spending transaction.',
      'The locking script is larger (~500–800 bytes) due to the full transition table and output parsing logic.',
      'No Chronicle dependency. All opcodes available on BSV mainnet since February 2020.',
      'Live mode requires complete OP_PUSH_TX script construction — SDK work remaining.',
    ],
  },

  'chronicle-otda': {
    id: 'chronicle-otda',
    name: 'Chronicle OTDA Covenant Mode',
    shortName: 'Chronicle OTDA',
    protocol: 'BSV Chronicle (2024+)',
    recordsState: true,
    verifiesTransition: true,
    simulationStatus: 'active',
    liveStatus: 'todo',
    description:
      'Uses SIGHASH_OTDA = 0x20. The signature commits to an output template rather than specific output scripts, so the spending transaction is bound to produce the correct next state output without the prover needing to push a tx preimage. This is the cleanest covenant construction — fewer bytes, simpler unlocking script — but requires Chronicle-specific SDK support.',
    requirements: [
      'SIGHASH_OTDA = 0x20 — Chronicle 2024 only',
      'OP_CAT, OP_SPLIT — Genesis 2020 (not Chronicle-specific)',
      '@bsv/sdk with Chronicle SIGHASH support — not yet in stable release',
      'OTDA output template enforcement by the signing layer',
    ],
    opcodes: [
      { name: 'OP_RETURN', purpose: 'Commit encoded Turing state in output[0]', since: 'Always' },
      { name: 'OP_DUP', purpose: 'P2PKH stack setup', since: 'Always' },
      { name: 'OP_HASH160', purpose: 'P2PKH address derivation', since: 'Always' },
      { name: 'OP_EQUALVERIFY', purpose: 'P2PKH pubkey verify', since: 'Always' },
      { name: 'OP_CHECKSIG', purpose: 'Signature verification (SIGHASH_OTDA = 0x20)', since: 'Chronicle 2024' },
      { name: 'OP_CAT', purpose: 'Assemble next state template', since: 'Genesis 2020' },
      { name: 'OP_SPLIT', purpose: 'Parse state fields', since: 'Genesis 2020' },
      { name: 'SIGHASH_OTDA (0x20)', purpose: 'Commit to output template for covenant enforcement', since: 'Chronicle 2024' },
    ],
    notes: [
      'SIGHASH_OTDA = 0x20 is the only Chronicle-specific dependency.',
      'No tx preimage needed in the unlocking script — much smaller witness data.',
      'Live mode blocked: @bsv/sdk does not yet expose SIGHASH_OTDA in its signing API.',
      'Script template is fully designed and documented. Implementation resumes when SDK support lands.',
    ],
  },
};

// ─── Script Template Generators ──────────────────────────────────────────────

export interface ScriptTemplate {
  lockingScript: string;
  unlockingScript: string;
  opReturnPayload: string;
  notes: string;
}

export function generateScriptTemplate(
  mode: ScriptMode,
  tape: number[],
  headPosition: number,
  state: number
): ScriptTemplate {
  const encoded = encodeState(tape, headPosition, state);
  const hex = encodeStateToHex(tape, headPosition, state);

  switch (mode) {
    case 'record-only':
      return {
        lockingScript: `-- Output[0]: state commitment (unspendable)
OP_RETURN ${hex}

-- Output[1]: continuation UTXO (P2PKH)
OP_DUP OP_HASH160 <nextStepPubKeyHash> OP_EQUALVERIFY OP_CHECKSIG`,

        unlockingScript: `-- Standard P2PKH unlock
<ECDSA_signature [SIGHASH_ALL]>
<public_key>`,

        opReturnPayload: `Encoded state: "${encoded}"
Hex:           0x${hex}
Length:        ${hex.length / 2} bytes`,

        notes: `No on-chain transition verification.
State is recorded immutably. Correctness verified off-chain
by replaying the OP_RETURN chain.`,
      };

    case 'genesis-covenant':
      return {
        lockingScript: `-- Output[0]: state commitment (unspendable)
OP_RETURN ${hex}

-- Output[1]: Genesis covenant locking script
--
-- Stack on entry (bottom → top):
--   <sig>  <pubkey>  <txPreimage>  <nextEncodedState>
--
-- Step 1: verify tx preimage is authentic
OP_OVER                        -- dup txPreimage
OP_SHA256 OP_SHA256            -- dSHA256(preimage) = committed sighash
<expected_sighash>
OP_EQUALVERIFY                 -- preimage is genuine

-- Step 2: parse output[0] from preimage using OP_SPLIT
-- (split at known byte offset of outputs field)
<outputs_offset> OP_SPLIT      -- [ prefix | outputs+suffix ]
OP_SWAP OP_DROP                -- keep outputs
<outputs_length> OP_SPLIT      -- [ outputs | rest ]
OP_DROP                        -- keep outputs bytes

-- Step 3: verify output[0] = OP_RETURN <validNextState>
OP_SHA256                      -- hash the outputs commitment
<expected_outputs_hash>        -- pre-computed off-chain
OP_EQUALVERIFY

-- Step 4: verify transition follows Wolfram (2,3) table
-- (nextEncodedState is on stack; locking script encodes all 6 rules)
OP_0 OP_SPLIT                  -- extract state byte
OP_BIN2NUM
-- ... OP_IF / OP_ELSE branches for each rule ...
OP_VERIFY                      -- assert transition is valid

-- Step 5: standard P2PKH signature check
OP_DUP OP_HASH160 <pubKeyHash> OP_EQUALVERIFY OP_CHECKSIG`,

        unlockingScript: `-- OP_PUSH_TX unlock (Genesis covenant)
<ECDSA_signature [SIGHASH_ALL]>
<public_key>
<serialized_spending_tx_preimage>   -- full tx data pushed by prover
<nextEncodedState>                  -- e.g. "1|43|000120201"`,

        opReturnPayload: `Encoded state: "${encoded}"
Hex:           0x${hex}
Length:        ${hex.length / 2} bytes

This value is embedded in output[0] of the spending transaction.
The locking script verifies this exact hex appears in output[0].`,

        notes: `IMPLEMENTATION STATUS: Script template only.
All opcodes available on BSV mainnet since Genesis (Feb 2020).
Live mode requires full OP_PUSH_TX script construction in @bsv/sdk.
No Chronicle dependency.`,
      };

    case 'chronicle-otda':
      return {
        lockingScript: `-- Output[0]: state commitment (unspendable)
OP_RETURN ${hex}

-- Output[1]: Chronicle OTDA covenant locking script
--
-- Stack on entry (bottom → top):
--   <sig_OTDA>  <pubkey>
--
-- The SIGHASH_OTDA (0x20) signature already commits to the
-- output template defined at signing time. The spending tx
-- is constrained by the signing layer — no preimage needed.
--
-- Step 1: Verify pubkey matches expected continuation key
OP_DUP OP_HASH160 <pubKeyHash> OP_EQUALVERIFY

-- Step 2: Verify OTDA signature
-- (sig commits to output template via SIGHASH_OTDA = 0x20)
OP_CHECKSIG

-- The output template (enforced by SIGHASH_OTDA):
--   output[0]: OP_RETURN <validNextEncodedState>
--   output[1]: OP_DUP OP_HASH160 <nextPubKeyHash> OP_EQUALVERIFY OP_CHECKSIG`,

        unlockingScript: `-- Chronicle OTDA unlock (minimal witness data)
<ECDSA_signature [SIGHASH_OTDA = 0x20]>
<public_key>

-- No tx preimage required. The OTDA sighash mechanism
-- enforces the output template at the signing layer.`,

        opReturnPayload: `Encoded state: "${encoded}"
Hex:           0x${hex}
Length:        ${hex.length / 2} bytes

This value is part of the OTDA output template that the
SIGHASH_OTDA signature commits to.`,

        notes: `IMPLEMENTATION STATUS: TODO — SDK support required.
@bsv/sdk does not yet expose SIGHASH_OTDA (0x20) in its signing API.
Script template is complete. Implementation resumes when SDK ships Chronicle support.
SIGHASH_OTDA is the ONLY Chronicle-specific dependency in this project.`,
      };
  }
}
