// BroadcastDialog — shows full tx details before broadcasting and handles the
// broadcast lifecycle: idle → broadcasting → success | error.
// The user must explicitly confirm before anything is sent.

import { useState, useCallback } from 'react';
import { LiveTxPreview, LiveNetwork, broadcastLiveTx } from '@/bsv/liveTx';
import { ExternalLink, Copy, Check, Loader2, Radio, X, ChevronDown, ChevronRight } from 'lucide-react';

type Phase = 'confirm' | 'broadcasting' | 'success' | 'error';

interface Props {
  open: boolean;
  step: number;
  preview: LiveTxPreview;
  network: LiveNetwork;
  onSuccess: (txid: string, changeSatoshis: number) => void;
  onCancel: () => void;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [text]);
  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors"
      title="Copy"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-chart-3" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export default function BroadcastDialog({ open, step, preview, network, onSuccess, onCancel }: Props) {
  const [phase, setPhase] = useState<Phase>('confirm');
  const [realTxid, setRealTxid] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [hexExpanded, setHexExpanded] = useState(false);

  const wocBase =
    network === 'main'
      ? 'https://whatsonchain.com/tx/'
      : 'https://test.whatsonchain.com/tx/';

  const handleBroadcast = useCallback(async () => {
    setPhase('broadcasting');
    setErrorMsg('');
    try {
      const txid = await broadcastLiveTx(preview.signedHex, network);
      setRealTxid(txid);
      setPhase('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setPhase('error');
    }
  }, [preview.signedHex, network]);

  const handleSuccess = useCallback(() => {
    onSuccess(realTxid, preview.changeSatoshis);
    setPhase('confirm');
    setRealTxid('');
  }, [realTxid, preview.changeSatoshis, onSuccess]);

  const handleCancel = useCallback(() => {
    if (phase === 'broadcasting') return;
    setPhase('confirm');
    setRealTxid('');
    setErrorMsg('');
    setHexExpanded(false);
    onCancel();
  }, [phase, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && handleCancel()}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* dialog */}
      <div className="relative z-10 w-full max-w-lg mx-4 bg-card border border-border rounded-xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm font-semibold text-foreground">
              {phase === 'success'
                ? 'Transaction Confirmed'
                : phase === 'error'
                ? 'Broadcast Failed'
                : `Broadcast Step #${step}`}
            </span>
          </div>
          <button
            onClick={handleCancel}
            disabled={phase === 'broadcasting'}
            className="p-1.5 rounded hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">

          {/* ── SUCCESS ── */}
          {phase === 'success' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 rounded-md bg-chart-3/10 border border-chart-3/30">
                <Check className="w-4 h-4 text-chart-3 flex-shrink-0" />
                <span className="text-xs font-mono text-chart-3">
                  Successfully broadcast to BSV {network === 'main' ? 'mainnet' : 'testnet'}
                </span>
              </div>

              <div className="bg-background border border-border rounded-md p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Real TXID</span>
                  <CopyButton text={realTxid} />
                </div>
                <p className="text-xs font-mono text-primary break-all">{realTxid}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-background border border-border rounded-md p-3 text-center">
                  <p className="text-xs text-muted-foreground font-mono mb-1">Fee Paid</p>
                  <p className="text-sm font-mono font-bold text-destructive">{preview.feeSatoshis} sat</p>
                </div>
                <div className="bg-background border border-border rounded-md p-3 text-center">
                  <p className="text-xs text-muted-foreground font-mono mb-1">Change UTXO</p>
                  <p className="text-sm font-mono font-bold text-chart-3">{preview.changeSatoshis} sat</p>
                </div>
              </div>

              <a
                href={`${wocBase}${realTxid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-md bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View on WhatsOnChain
              </a>
            </div>
          )}

          {/* ── ERROR ── */}
          {phase === 'error' && (
            <div className="space-y-4">
              <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/30">
                <X className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-xs font-mono text-destructive break-words">{errorMsg}</p>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                The transaction was not broadcast. You can try again or cancel to go back.
              </p>
            </div>
          )}

          {/* ── CONFIRM / BROADCASTING ── */}
          {(phase === 'confirm' || phase === 'broadcasting') && (
            <>
              {/* OP_RETURN payload */}
              <div className="bg-background border border-border rounded-md p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground uppercase tracking-widest font-mono">OP_RETURN Payload</span>
                  <CopyButton text={preview.opReturnPayloadHex} />
                </div>
                <p className="text-xs font-mono text-foreground break-all">{preview.opReturnPayloadDecoded}</p>
                <p className="text-[10px] font-mono text-muted-foreground/60 break-all">{preview.opReturnPayloadHex}</p>
                <p className="text-[10px] font-mono text-muted-foreground/40">
                  {preview.opReturnSizeBytes} bytes
                </p>
              </div>

              {/* Fee / Change summary */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-background border border-border rounded-md p-2">
                  <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mb-1">Network</p>
                  <p className="text-xs font-mono font-bold text-foreground">
                    {network === 'main' ? 'Mainnet' : 'Testnet'}
                  </p>
                </div>
                <div className="bg-background border border-border rounded-md p-2">
                  <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mb-1">Fee</p>
                  <p className="text-xs font-mono font-bold text-destructive">{preview.feeSatoshis} sat</p>
                </div>
                <div className="bg-background border border-border rounded-md p-2">
                  <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mb-1">Change</p>
                  <p className="text-xs font-mono font-bold text-chart-3">{preview.changeSatoshis} sat</p>
                </div>
              </div>

              {/* Address */}
              <div className="bg-background border border-border rounded-md p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">From / To Address</span>
                  <CopyButton text={preview.address} />
                </div>
                <p className="text-[10px] font-mono text-muted-foreground break-all">{preview.address}</p>
              </div>

              {/* Raw TX hex — collapsible */}
              <div className="bg-background border border-border rounded-md overflow-hidden">
                <button
                  onClick={() => setHexExpanded((v) => !v)}
                  className="flex items-center justify-between w-full px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {hexExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    <span className="font-mono uppercase tracking-widest">
                      Raw Transaction Hex
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground/50">
                      {preview.signedHex.length / 2} bytes
                    </span>
                    <CopyButton text={preview.signedHex} />
                  </div>
                </button>
                {hexExpanded && (
                  <div className="px-3 pb-3 border-t border-border/50">
                    <pre className="text-[10px] font-mono text-muted-foreground/60 break-all whitespace-pre-wrap mt-2 max-h-32 overflow-y-auto">
                      {preview.signedHex}
                    </pre>
                  </div>
                )}
              </div>

              {/* Warning */}
              <p className="text-[10px] font-mono text-muted-foreground/60 leading-relaxed">
                This will broadcast a real transaction to BSV {network === 'main' ? 'mainnet' : 'testnet'}.
                The fee of {preview.feeSatoshis} satoshis is non-refundable. Review the details above before confirming.
              </p>
            </>
          )}
        </div>

        {/* Footer buttons */}
        <div className="px-5 py-4 border-t border-border flex gap-3">
          {phase === 'success' ? (
            <button
              onClick={handleSuccess}
              className="flex-1 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Continue
            </button>
          ) : phase === 'error' ? (
            <>
              <button
                onClick={() => setPhase('confirm')}
                className="flex-1 px-4 py-2 rounded-md bg-secondary text-secondary-foreground border border-border text-sm font-medium hover:opacity-80 transition-opacity"
              >
                Try Again
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 rounded-md bg-secondary text-secondary-foreground border border-border text-sm font-medium hover:opacity-80 transition-opacity"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCancel}
                disabled={phase === 'broadcasting'}
                className="flex-1 px-4 py-2 rounded-md bg-secondary text-secondary-foreground border border-border text-sm font-medium hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              >
                Cancel
              </button>
              <button
                onClick={handleBroadcast}
                disabled={phase === 'broadcasting'}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
              >
                {phase === 'broadcasting' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Broadcasting…
                  </>
                ) : (
                  <>
                    <Radio className="w-3.5 h-3.5" />
                    Broadcast
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
