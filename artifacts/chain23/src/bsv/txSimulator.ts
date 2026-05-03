// Simulated BSV transaction layer
// TXIDs are deterministic: SHA256(encodedState) — same state always produces same TXID.
// No real broadcasting. Full offline support.

import { encodeState, encodeStateToHex } from '../core/encoder';

export type TxMode = 'simulation' | 'live-dry-run' | 'live-broadcast';

export interface SimulatedTx {
  txid: string;
  step: number;
  stateBefore: string;      // encoded state before this transition
  encodedState: string;     // encoded state after this transition (goes in OP_RETURN)
  hexEncodedState: string;
  opReturnData: string;
  description: string;
  timestamp: number;
  mode: TxMode;
  payloadSizeBytes: number; // byte length of the OP_RETURN payload
}

/**
 * Compute SHA-256 of a string and return as hex.
 * Uses the Web Crypto API — deterministic and side-effect-free.
 */
export async function sha256Hex(data: string): Promise<string> {
  const encoded = new TextEncoder().encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Create a simulated transaction for a given Turing machine state.
 * TXID = SHA256(encodedState) — fully deterministic, no randomness.
 * @param stateBefore - encoded state before this step (for audit trail)
 */
export async function simulateTransaction(
  tape: number[],
  headPosition: number,
  state: number,
  step: number,
  stepDescription: string,
  stateBefore: string
): Promise<SimulatedTx> {
  const encodedState = encodeState(tape, headPosition, state);
  const hexEncodedState = encodeStateToHex(tape, headPosition, state);
  const txid = await sha256Hex(encodedState);
  const payloadSizeBytes = hexEncodedState.length / 2;

  return {
    txid,
    step,
    stateBefore,
    encodedState,
    hexEncodedState,
    opReturnData: `OP_RETURN ${hexEncodedState}`,
    description: stepDescription,
    timestamp: Date.now(),
    mode: 'simulation',
    payloadSizeBytes,
  };
}

/**
 * Export a list of transactions as a CSV string.
 * Columns: Step, Timestamp, Mode, TXID, StateBefore, StateAfter, EncodedStateHex, PayloadBytes, Description
 */
export function exportTransactionsAsCSV(transactions: SimulatedTx[]): string {
  const header =
    'Step,Timestamp,Mode,TXID,StateBefore,StateAfter,EncodedStateHex,PayloadBytes,Description';
  const escape = (s: string) => `"${s.replace(/"/g, '""')}"`;
  const rows = transactions.map(
    (tx) =>
      [
        tx.step,
        tx.timestamp,
        tx.mode,
        tx.txid,
        escape(tx.stateBefore),
        escape(tx.encodedState),
        tx.hexEncodedState,
        tx.payloadSizeBytes,
        escape(tx.description),
      ].join(',')
  );
  return [header, ...rows].join('\n');
}

/**
 * Trigger a CSV download in the browser.
 */
export function downloadCSV(transactions: SimulatedTx[], filename = '23chain-log.csv'): void {
  const csv = exportTransactionsAsCSV(transactions);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
