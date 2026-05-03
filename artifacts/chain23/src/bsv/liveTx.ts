// Record-Only Live Mode — real BSV transaction construction and broadcasting
// Uses @bsv/sdk v2 to build, sign, and broadcast P2PKH + OP_RETURN transactions.
// NO hardcoded keys. The caller provides the WIF at runtime.

import {
  Transaction,
  P2PKH,
  PrivateKey,
  LockingScript,
  SatoshisPerKilobyte,
  WhatsOnChainBroadcaster,
} from '@bsv/sdk';

// ─── Types ───────────────────────────────────────────────────────────────────

export type LiveNetwork = 'main' | 'test';

export interface LiveUTXO {
  txid: string;
  vout: number;
  satoshis: number; // number (not bigint) — required by P2PKH.unlock
}

export interface LiveConfig {
  utxo: LiveUTXO;
  wif: string;
  network: LiveNetwork;
}

export interface LiveTxPreview {
  signedHex: string;
  feeSatoshis: number;
  changeSatoshis: number;
  changeVout: number;
  opReturnPayloadHex: string;
  opReturnPayloadDecoded: string;
  opReturnSizeBytes: number;
  address: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hexToBytes(hex: string): number[] {
  const result: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    result.push(parseInt(hex.substring(i, i + 2), 16));
  }
  return result;
}

export function deriveAddress(wif: string, network: LiveNetwork): string {
  const privateKey = PrivateKey.fromWif(wif);
  return network === 'main' ? privateKey.toAddress() : privateKey.toAddress('testnet');
}

// ─── Transaction builder ──────────────────────────────────────────────────────

/**
 * Build a signed P2PKH + OP_RETURN transaction for the Record-Only Live Mode.
 *
 * Layout:
 *   Input[0]  — spends the funded UTXO (P2PKH)
 *   Output[0] — OP_RETURN <opReturnPayloadHex>  (0 sat, unspendable state record)
 *   Output[1] — P2PKH change back to same address (continuation UTXO)
 *
 * No keys are hardcoded. The WIF is passed at call-time and used only in-memory.
 */
export async function buildRecordOnlyLiveTx(
  config: LiveConfig,
  opReturnPayloadHex: string,
  opReturnPayloadDecoded: string
): Promise<LiveTxPreview> {
  const { utxo, wif, network } = config;

  const privateKey = PrivateKey.fromWif(wif);
  const p2pkh = new P2PKH();
  const address =
    network === 'main' ? privateKey.toAddress() : privateKey.toAddress('testnet');
  const lockingScript = p2pkh.lock(address);

  const tx = new Transaction();

  // Input: spend the funded UTXO
  tx.addInput({
    sourceTXID: utxo.txid,
    sourceOutputIndex: utxo.vout,
    unlockingScriptTemplate: p2pkh.unlock(
      privateKey,
      'all',
      false,
      utxo.satoshis,
      lockingScript
    ),
  });

  // Output[0]: OP_RETURN state record (unspendable, 0 sat)
  const opReturn = new LockingScript();
  opReturn.writeOpCode(106); // OP_RETURN = 0x6a
  opReturn.writeBin(hexToBytes(opReturnPayloadHex));
  tx.addOutput({ lockingScript: opReturn, satoshis: 0 });

  // Output[1]: P2PKH change back to same address (continuation UTXO for next step)
  tx.addOutput({ lockingScript: p2pkh.lock(address), change: true });

  // Compute fee at 1 sat/kb and sign
  await tx.fee(new SatoshisPerKilobyte(1));
  await tx.sign();

  const signedHex = tx.toHex();

  const totalOut = tx.outputs.reduce((sum, o) => sum + (o.satoshis ?? 0), 0);
  const feeSatoshis = utxo.satoshis - totalOut;
  const changeSatoshis = tx.outputs[1]?.satoshis ?? 0;

  return {
    signedHex,
    feeSatoshis,
    changeSatoshis,
    changeVout: 1,
    opReturnPayloadHex,
    opReturnPayloadDecoded,
    opReturnSizeBytes: opReturnPayloadHex.length / 2,
    address,
  };
}

// ─── Broadcaster ─────────────────────────────────────────────────────────────

/**
 * Broadcast a signed raw transaction via WhatsOnChain.
 * Returns the real TXID on success. Throws a descriptive error on failure.
 */
export async function broadcastLiveTx(
  signedHex: string,
  network: LiveNetwork
): Promise<string> {
  const broadcaster = new WhatsOnChainBroadcaster(network);
  const tx = Transaction.fromHex(signedHex);
  const result = await tx.broadcast(broadcaster);
  if (result.status === 'success') {
    return result.txid;
  }
  throw new Error(
    `Broadcast failed [${result.code ?? 'ERR'}]: ${result.description}`
  );
}
