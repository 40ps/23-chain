// Simulated BSV transaction layer
// TXIDs are deterministic: SHA256(encodedState) — same state always produces same TXID.
// No real broadcasting. Full offline support.

import { encodeState, encodeStateToHex } from '../core/encoder';

export interface SimulatedTx {
  txid: string;
  step: number;
  encodedState: string;
  hexEncodedState: string;
  opReturnData: string;
  description: string;
  timestamp: number;
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
 */
export async function simulateTransaction(
  tape: number[],
  headPosition: number,
  state: number,
  step: number,
  stepDescription: string
): Promise<SimulatedTx> {
  const encodedState = encodeState(tape, headPosition, state);
  const hexEncodedState = encodeStateToHex(tape, headPosition, state);
  const txid = await sha256Hex(encodedState);

  return {
    txid,
    step,
    encodedState,
    hexEncodedState,
    opReturnData: `OP_RETURN ${hexEncodedState}`,
    description: stepDescription,
    timestamp: Date.now(),
  };
}

/**
 * Export a list of transactions as a CSV string.
 */
export function exportTransactionsAsCSV(transactions: SimulatedTx[]): string {
  const header = 'Step,TXID,EncodedState,OPReturn,Description,Timestamp';
  const rows = transactions.map(
    (tx) =>
      `${tx.step},${tx.txid},${tx.encodedState},"${tx.opReturnData}","${tx.description}",${tx.timestamp}`
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
