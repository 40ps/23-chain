// WhatsOnChain API integration
// Used for TX lookup only in the current build.
// Live broadcasting requires post-Chronicle @bsv/sdk — see /docs/script-design.md.

const WOC_BASE = 'https://api.whatsonchain.com/v1/bsv/main';

/** Rate limit without an API key: 1 req/sec */
export const DEFAULT_RATE_LIMIT_MS = 1000;

export interface WoCTxInfo {
  txid: string;
  confirmations: number;
  blockheight: number;
}

async function fetchWithBackoff(
  url: string,
  apiKey?: string,
  maxRetries = 4,
  baseDelayMs = 1000
): Promise<Response> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (apiKey) headers['woc-api-key'] = apiKey;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch(url, { headers });
    if (res.status !== 429) return res;

    const backoff = baseDelayMs * Math.pow(2, attempt);
    await new Promise((r) => setTimeout(r, backoff));
  }

  throw new Error(`HTTP 429 — rate limited after ${maxRetries} retries`);
}

/**
 * Look up a transaction on WhatsOnChain.
 * Returns null if the TXID does not exist on-chain (simulation TXIDs will not be found).
 */
export async function getTxInfo(txid: string, apiKey?: string): Promise<WoCTxInfo | null> {
  try {
    const res = await fetchWithBackoff(`${WOC_BASE}/tx/hash/${txid}`, apiKey);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      txid: data.txid,
      confirmations: data.confirmations ?? 0,
      blockheight: data.blockheight ?? -1,
    };
  } catch {
    return null;
  }
}

/**
 * TODO: Live broadcast — requires post-Chronicle @bsv/sdk with OTDA SIGHASH (0x20) support.
 * Current @bsv/sdk does not expose Chronicle-specific locking/unlocking primitives.
 * Do NOT call this function — it will throw intentionally.
 */
export async function broadcastTransaction(
  _rawTx: string,
  _apiKey?: string
): Promise<string> {
  throw new Error(
    'Live broadcasting is not implemented. ' +
      'Chronicle SDK (@bsv/sdk) with OTDA SIGHASH (0x20) support is required. ' +
      'See /docs/script-design.md for full technical specification.'
  );
}
