// LiveModePanel — configure and enable Record-Only Live Mode.
// Lets the user enter a funded UTXO and WIF private key to broadcast real transactions.
// The WIF is held in component state only — never logged, stored, or sent anywhere except
// to @bsv/sdk's signing API in-memory.

import { useState, useCallback, useEffect } from 'react';
import { LiveConfig, LiveNetwork, LiveUTXO, deriveAddress } from '@/bsv/liveTx';
import { Radio, Lock, AlertCircle, ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';

interface Props {
  enabled: boolean;
  onEnable: (config: LiveConfig) => void;
  onDisable: () => void;
  currentUtxo: LiveUTXO | null;
}

export default function LiveModePanel({ enabled, onEnable, onDisable, currentUtxo }: Props) {
  const [expanded, setExpanded] = useState(false);

  // Form state — WIF is never persisted
  const [network, setNetwork] = useState<LiveNetwork>('main');
  const [txid, setTxid] = useState('');
  const [vout, setVout] = useState('0');
  const [satoshis, setSatoshis] = useState('');
  const [wif, setWif] = useState('');
  const [showWif, setShowWif] = useState(false);

  // Derived address preview (computed locally, no network call)
  const [derivedAddress, setDerivedAddress] = useState('');
  const [wifError, setWifError] = useState('');

  useEffect(() => {
    if (!wif.trim()) {
      setDerivedAddress('');
      setWifError('');
      return;
    }
    try {
      const addr = deriveAddress(wif.trim(), network);
      setDerivedAddress(addr);
      setWifError('');
    } catch {
      setDerivedAddress('');
      setWifError('Invalid WIF key for selected network');
    }
  }, [wif, network]);

  const isValid =
    txid.trim().length === 64 &&
    !isNaN(parseInt(vout, 10)) &&
    !isNaN(parseInt(satoshis, 10)) &&
    parseInt(satoshis, 10) > 300 && // sanity: must cover at least a minimal fee
    wif.trim().length > 0 &&
    !wifError;

  const handleEnable = useCallback(() => {
    if (!isValid) return;
    const config: LiveConfig = {
      utxo: {
        txid: txid.trim(),
        vout: parseInt(vout, 10),
        satoshis: parseInt(satoshis, 10),
      },
      wif: wif.trim(),
      network,
    };
    onEnable(config);
    setExpanded(false);
  }, [isValid, txid, vout, satoshis, wif, network, onEnable]);

  const handleDisable = useCallback(() => {
    setWif(''); // clear key from memory
    setDerivedAddress('');
    onDisable();
  }, [onDisable]);

  return (
    <div className="mt-3 border border-border/60 rounded-md overflow-hidden bg-background/30">
      {/* Section header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-xs hover:bg-muted/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-primary" />
          <span className="font-mono uppercase tracking-widest text-foreground">Live Mode</span>
          {enabled && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-primary/20 text-primary border border-primary/30 uppercase tracking-widest">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {enabled && currentUtxo && (
            <span className="text-[10px] font-mono text-chart-3">
              {currentUtxo.satoshis.toLocaleString()} sat available
            </span>
          )}
          {expanded ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-border/40 space-y-4 pt-4">

          {/* Description */}
          <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">
            Provide a funded UTXO and WIF key. Each step broadcasts a real P2PKH + OP_RETURN
            transaction. You confirm the raw hex and fee before anything is sent.
            The WIF is held only in-memory and never stored.
          </p>

          {enabled ? (
            /* ── Currently enabled ── */
            <div className="space-y-3">
              <div className="flex items-start gap-2 p-3 rounded-md bg-primary/5 border border-primary/20">
                <Radio className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-mono text-primary font-semibold uppercase tracking-widest mb-1">
                    Live Mode Active
                  </p>
                  {currentUtxo && (
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-mono text-muted-foreground truncate">
                        UTXO: {currentUtxo.txid.slice(0, 16)}…{currentUtxo.txid.slice(-8)}:{currentUtxo.vout}
                      </p>
                      <p className="text-[10px] font-mono text-muted-foreground">
                        Balance: <span className="text-chart-3">{currentUtxo.satoshis.toLocaleString()} sat</span>
                      </p>
                      <p className="text-[10px] font-mono text-muted-foreground">
                        Network: <span className="text-foreground">{network === 'main' ? 'Mainnet' : 'Testnet'}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleDisable}
                className="w-full px-3 py-2 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-xs font-mono font-medium hover:bg-destructive/20 transition-colors"
              >
                Disable Live Mode
              </button>
            </div>
          ) : (
            /* ── Configuration form ── */
            <div className="space-y-3">

              {/* Network */}
              <div>
                <label className="block text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">
                  Network
                </label>
                <div className="flex gap-2">
                  {(['main', 'test'] as LiveNetwork[]).map((n) => (
                    <button
                      key={n}
                      onClick={() => setNetwork(n)}
                      className={[
                        'px-3 py-1.5 rounded text-xs font-mono border transition-colors',
                        network === n
                          ? 'bg-primary/10 border-primary/40 text-primary'
                          : 'bg-background border-border text-muted-foreground hover:border-primary/30',
                      ].join(' ')}
                    >
                      {n === 'main' ? 'Mainnet' : 'Testnet'}
                    </button>
                  ))}
                </div>
                {network === 'main' && (
                  <p className="text-[10px] font-mono text-primary/60 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Mainnet — real satoshis will be spent
                  </p>
                )}
              </div>

              {/* UTXO TXID */}
              <div>
                <label className="block text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5">
                  Funded UTXO — Transaction ID
                </label>
                <input
                  type="text"
                  value={txid}
                  onChange={(e) => setTxid(e.target.value)}
                  placeholder="64-character hex txid"
                  spellCheck={false}
                  className="w-full bg-background border border-border rounded px-2.5 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-ring"
                />
                {txid && txid.trim().length !== 64 && (
                  <p className="text-[10px] font-mono text-destructive mt-1">TXID must be 64 hex characters</p>
                )}
              </div>

              {/* vout + satoshis */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5">
                    Output Index (vout)
                  </label>
                  <input
                    type="number"
                    value={vout}
                    onChange={(e) => setVout(e.target.value)}
                    min={0}
                    placeholder="0"
                    className="w-full bg-background border border-border rounded px-2.5 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5">
                    Satoshis
                  </label>
                  <input
                    type="number"
                    value={satoshis}
                    onChange={(e) => setSatoshis(e.target.value)}
                    min={300}
                    placeholder="e.g. 10000"
                    className="w-full bg-background border border-border rounded px-2.5 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              {/* WIF Key */}
              <div>
                <label className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5">
                  <Lock className="w-3 h-3" />
                  WIF Private Key
                  <span className="text-muted-foreground/40 normal-case">— in-memory only, never stored</span>
                </label>
                <div className="relative">
                  <input
                    type={showWif ? 'text' : 'password'}
                    value={wif}
                    onChange={(e) => setWif(e.target.value)}
                    placeholder="Starts with 5, K, or L (mainnet) / c or 9 (testnet)"
                    autoComplete="off"
                    spellCheck={false}
                    className="w-full bg-background border border-border rounded px-2.5 py-1.5 pr-9 text-xs font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <button
                    type="button"
                    onClick={() => setShowWif((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showWif ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {wifError && (
                  <p className="text-[10px] font-mono text-destructive mt-1">{wifError}</p>
                )}
                {derivedAddress && (
                  <p className="text-[10px] font-mono text-chart-3 mt-1 break-all">
                    Address: {derivedAddress}
                  </p>
                )}
                {derivedAddress && (
                  <p className="text-[10px] font-mono text-muted-foreground/50 mt-0.5">
                    Verify this matches the address that owns the UTXO above.
                  </p>
                )}
              </div>

              <button
                onClick={handleEnable}
                disabled={!isValid}
                className="w-full px-3 py-2 rounded-md bg-primary text-primary-foreground text-xs font-mono font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              >
                Enable Live Mode
              </button>

              <p className="text-[10px] font-mono text-muted-foreground/50 leading-relaxed">
                You will see the full signed transaction hex, fee, and OP_RETURN payload before
                each broadcast. Nothing is sent without your explicit confirmation.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
