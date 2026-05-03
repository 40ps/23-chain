import { useRef, useEffect, useState, useCallback } from "react";
import { useTuringMachine } from "@/hooks/useTuringMachine";
import { tapeToArray, validateTapeString } from "@/core/tape";
import ScriptModeSelector from "@/components/ScriptModeSelector";
import LiveModePanel from "@/components/LiveModePanel";
import BroadcastDialog from "@/components/BroadcastDialog";
import { SCRIPT_MODES } from "@/bsv/scriptModes";
import { LiveConfig, LiveUTXO, LiveTxPreview } from "@/bsv/liveTx";
import {
  Play,
  Square,
  RotateCcw,
  Zap,
  Coins,
  Download,
  ChevronDown,
  ChevronRight,
  Cpu,
  Hash,
  Activity,
  Database,
  Radio,
  AlertCircle,
  Loader2,
} from "lucide-react";

const CELL_W = 44;

export default function SimulatorPage() {
  const {
    state,
    step,
    start,
    stop,
    reset,
    loadDemo,
    fund,
    setSpeed,
    exportCSV,
    setCustomTape,
    setScriptMode,
    buildLiveStep,
    commitLiveStep,
    cancelLiveStep,
  } = useTuringMachine();

  const cells = tapeToArray(state.tape);
  const tapeScrollRef = useRef<HTMLDivElement>(null);
  const headCellRef = useRef<HTMLDivElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  const [transitionOpen, setTransitionOpen] = useState(false);
  const [customTapeStr, setCustomTapeStr] = useState("0000001101000000");
  const [customHead, setCustomHead] = useState("6");
  const [customStateNum, setCustomStateNum] = useState("0");
  const [customTapeError, setCustomTapeError] = useState<string | null>(null);

  // ── Live Mode state ──────────────────────────────────────────────────────
  const [liveEnabled, setLiveEnabled] = useState(false);
  const [liveConfig, setLiveConfig] = useState<LiveConfig | null>(null);
  const [currentUtxo, setCurrentUtxo] = useState<LiveUTXO | null>(null);
  const [livePreview, setLivePreview] = useState<LiveTxPreview | null>(null);
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [liveBuilding, setLiveBuilding] = useState(false);
  const [liveBuildError, setLiveBuildError] = useState("");

  const isLiveMode =
    liveEnabled && liveConfig !== null && state.scriptMode === "record-only";

  // Auto-scroll tape to keep head in view
  useEffect(() => {
    if (!tapeScrollRef.current || !headCellRef.current) return;
    const container = tapeScrollRef.current;
    const head = headCellRef.current;
    const containerRect = container.getBoundingClientRect();
    const headRect = head.getBoundingClientRect();
    const offset = headRect.left - containerRect.left - containerRect.width / 2 + CELL_W / 2;
    container.scrollLeft += offset;
  }, [state.headPosition, cells.length]);

  // Auto-scroll log to bottom
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.transactions.length]);

  const handleCustomLoad = useCallback(() => {
    const tapeErr = validateTapeString(customTapeStr);
    if (tapeErr) {
      setCustomTapeError(tapeErr);
      return;
    }
    setCustomTapeError(null);
    const h = parseInt(customHead, 10);
    const s = parseInt(customStateNum, 10);
    if (isNaN(h) || isNaN(s) || s < 0 || s > 1) return;
    setCustomTape(customTapeStr, h, s);
  }, [customTapeStr, customHead, customStateNum, setCustomTape]);

  // ── Live Step handler ───────────────────────────────────────────────────
  const handleLiveStep = useCallback(async () => {
    if (!liveConfig || liveBuilding) return;
    setLiveBuildError("");
    setLiveBuilding(true);
    try {
      const preview = await buildLiveStep(liveConfig);
      setLivePreview(preview);
      setBroadcastOpen(true);
    } catch (err) {
      setLiveBuildError(
        err instanceof Error ? err.message : "Failed to build transaction"
      );
    } finally {
      setLiveBuilding(false);
    }
  }, [liveConfig, liveBuilding, buildLiveStep]);

  const handleBroadcastSuccess = useCallback(
    (txid: string, changeSatoshis: number) => {
      setBroadcastOpen(false);
      // Advance the machine state (always — real broadcast or dry run)
      commitLiveStep(txid);
      // Update UTXO only for real broadcasts — dry run leaves UTXO unchanged
      if (livePreview && liveConfig && !liveConfig.dryRun) {
        const newUtxo: LiveUTXO = {
          txid,
          vout: livePreview.changeVout,
          satoshis: changeSatoshis,
        };
        setCurrentUtxo(newUtxo);
        setLiveConfig({ ...liveConfig, utxo: newUtxo });
      }
      setLivePreview(null);
    },
    [commitLiveStep, livePreview, liveConfig]
  );

  const handleBroadcastCancel = useCallback(() => {
    setBroadcastOpen(false);
    setLivePreview(null);
    cancelLiveStep();
  }, [cancelLiveStep]);

  const handleEnableLive = useCallback((config: LiveConfig) => {
    setLiveConfig(config);
    setCurrentUtxo(config.utxo);
    setLiveEnabled(true);
    setLiveBuildError("");
  }, []);

  const handleDisableLive = useCallback(() => {
    setLiveEnabled(false);
    setLiveConfig(null);
    setCurrentUtxo(null);
    setLiveBuildError("");
    cancelLiveStep();
  }, [cancelLiveStep]);

  const balanceStr = state.balance.toString();
  const shortTxid = (txid: string) => txid.slice(0, 16) + "…" + txid.slice(-8);

  const symbolColors: Record<number, string> = {
    0: "tape-symbol-0",
    1: "tape-symbol-1",
    2: "tape-symbol-2",
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* scanlines overlay */}
      <div className="fixed inset-0 scanlines pointer-events-none z-0 opacity-30" />

      {/* ── HEADER ── */}
      <header className="relative z-10 border-b border-border px-6 py-4 flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight leading-none text-foreground">
                23-Chain
              </h1>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                BitcoinSV Universal Turing Machine
              </p>
            </div>
          </div>

          {/* Status row */}
          <div className="flex items-center gap-5 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs uppercase tracking-widest">State</span>
              <span
                data-testid="status-machine-state"
                className="font-mono text-base font-bold text-primary w-5 text-center"
              >
                {state.machineState}
              </span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-muted-foreground text-xs uppercase tracking-widest">Transactions</span>
              <span data-testid="status-step-count" className="font-mono font-bold text-foreground">
                {state.stepCount.toLocaleString()}
              </span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-muted-foreground" />
              {isLiveMode ? (
                <>
                  <Radio className="w-3 h-3 text-primary animate-pulse" />
                  <span className="text-muted-foreground text-xs uppercase tracking-widest">UTXO</span>
                  <span className="font-mono font-bold text-primary">
                    {currentUtxo ? `${currentUtxo.satoshis.toLocaleString()} sat` : "—"}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-muted-foreground text-xs uppercase tracking-widest">Balance</span>
                  <span
                    data-testid="status-balance"
                    className={`font-mono font-bold ${state.outOfFunds ? "text-destructive" : "text-primary"}`}
                  >
                    {balanceStr} sat
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Info banner */}
        <div className="bg-card border border-border rounded-md px-4 py-2.5 text-xs text-muted-foreground leading-relaxed max-w-4xl">
          This initial state represents the problem to be solved. Since the Wolfram (2,3) machine is
          universal, any computable function can be represented through appropriate tape initialization.
        </div>

        {/* Control buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            data-testid="button-start"
            onClick={start}
            disabled={state.running || (isLiveMode ? false : state.outOfFunds) || isLiveMode}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            title={isLiveMode ? "Auto-run disabled in Live Mode — use Step" : undefined}
          >
            <Play className="w-3.5 h-3.5" />
            Start
          </button>

          <button
            data-testid="button-step"
            onClick={isLiveMode ? handleLiveStep : step}
            disabled={state.running || (!isLiveMode && state.outOfFunds) || liveBuilding}
            className={[
              "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium border transition-opacity",
              isLiveMode
                ? "bg-primary/10 border-primary/40 text-primary hover:bg-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
                : "bg-secondary text-secondary-foreground hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed border-border",
            ].join(" ")}
          >
            {liveBuilding ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Building…
              </>
            ) : isLiveMode ? (
              <>
                <Radio className="w-3.5 h-3.5" />
                Live Step
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                Step
              </>
            )}
          </button>

          <button
            data-testid="button-stop"
            onClick={stop}
            disabled={!state.running}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed border border-border transition-opacity"
          >
            <Square className="w-3.5 h-3.5" />
            Stop
          </button>

          <button
            data-testid="button-reset"
            onClick={reset}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:opacity-80 border border-border transition-opacity"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>

          <button
            data-testid="button-load-demo"
            onClick={loadDemo}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:opacity-80 border border-border transition-opacity"
          >
            Load Demo
          </button>

          {!isLiveMode && (
            <button
              data-testid="button-fund"
              onClick={fund}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:opacity-80 border border-primary/30 text-primary transition-opacity"
            >
              <Coins className="w-3.5 h-3.5" />
              Fund Machine
            </button>
          )}

          <button
            data-testid="button-export-csv"
            onClick={exportCSV}
            disabled={state.transactions.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:opacity-80 border border-border disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>

        {/* Live build error */}
        {liveBuildError && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-xs font-mono">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {liveBuildError}
          </div>
        )}
      </header>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 flex flex-col lg:flex-row flex-1 min-h-0">

        {/* ── LEFT / MAIN COLUMN ── */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Out-of-funds banner (simulation mode only) */}
          {state.outOfFunds && !isLiveMode && (
            <div className="mx-4 mt-4 px-4 py-3 rounded-md bg-destructive/10 border border-destructive/40 text-destructive text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-destructive animate-pulse flex-shrink-0" />
              Out of Funds — click Fund Machine to continue
            </div>
          )}

          {/* ── TAPE SECTION ── */}
          <div className="px-4 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
                Tape — Head @ {state.headPosition}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {cells.length} cells
              </span>
            </div>

            <div className="relative bg-card border border-border rounded-md overflow-hidden">
              {/* Index row */}
              <div
                ref={tapeScrollRef}
                className="overflow-x-auto scrollbar-thin"
                style={{ scrollBehavior: "auto" }}
              >
                {/* Index numbers */}
                <div className="flex border-b border-border/50">
                  {cells.map((_, i) => (
                    <div
                      key={`idx-${i}`}
                      style={{ minWidth: CELL_W, width: CELL_W }}
                      className="text-center text-[9px] font-mono text-muted-foreground/50 py-0.5 flex-shrink-0"
                    >
                      {i % 5 === 0 ? i : ""}
                    </div>
                  ))}
                </div>

                {/* Cells */}
                <div className="flex py-2">
                  {cells.map((symbol, i) => {
                    const isHead = i === state.headPosition;
                    return (
                      <div
                        key={`cell-${i}`}
                        ref={isHead ? headCellRef : null}
                        data-testid={`tape-cell-${i}`}
                        style={{ minWidth: CELL_W, width: CELL_W }}
                        className={[
                          "flex-shrink-0 mx-0.5 rounded text-center font-mono font-bold text-base py-2 transition-all duration-100 select-none",
                          symbolColors[symbol] ?? "tape-symbol-0",
                          isHead ? "tape-head-active tape-head-pulse" : "",
                        ].join(" ")}
                      >
                        {symbol}
                      </div>
                    );
                  })}
                </div>

                {/* Head marker arrow */}
                <div className="flex pb-1">
                  {cells.map((_, i) => (
                    <div
                      key={`arrow-${i}`}
                      style={{ minWidth: CELL_W, width: CELL_W }}
                      className="text-center flex-shrink-0"
                    >
                      {i === state.headPosition && (
                        <span className="text-primary text-xs font-mono">▲</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Symbol legend */}
            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded tape-symbol-0 inline-flex items-center justify-center text-[10px] font-mono font-bold">0</span>
                Symbol 0 (blank)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded tape-symbol-1 inline-flex items-center justify-center text-[10px] font-mono font-bold">1</span>
                Symbol 1
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded tape-symbol-2 inline-flex items-center justify-center text-[10px] font-mono font-bold">2</span>
                Symbol 2
              </span>
              <span className="flex items-center gap-1.5 ml-auto">
                <span className="text-primary font-mono">▲</span>
                Read/Write Head
              </span>
            </div>
          </div>

          {/* ── SPEED + CUSTOM INPUT ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pt-4">
            {/* Speed slider */}
            <div className="bg-card border border-border rounded-md p-4">
              <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-3 font-mono">
                Execution Speed
              </label>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground font-mono w-6">Fast</span>
                <input
                  data-testid="input-speed"
                  type="range"
                  min={0}
                  max={500}
                  step={10}
                  value={state.speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="flex-1 accent-primary"
                />
                <span className="text-xs text-muted-foreground font-mono w-12 text-right">Slow</span>
                <span className="text-xs font-mono text-primary w-14 text-right">
                  {state.speed}ms
                </span>
              </div>
            </div>

            {/* Custom tape loader */}
            <div className="bg-card border border-border rounded-md p-4">
              <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-3 font-mono">
                Custom Tape
              </label>
              <div className="flex flex-col gap-2">
                <input
                  data-testid="input-custom-tape"
                  type="text"
                  value={customTapeStr}
                  onChange={(e) => setCustomTapeStr(e.target.value)}
                  placeholder="Tape (0,1,2 chars only)"
                  className="w-full bg-background border border-border rounded px-2.5 py-1.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <div className="flex gap-2">
                  <input
                    data-testid="input-custom-head"
                    type="number"
                    value={customHead}
                    onChange={(e) => setCustomHead(e.target.value)}
                    placeholder="Head pos"
                    min={0}
                    className="w-24 bg-background border border-border rounded px-2.5 py-1.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <select
                    data-testid="select-custom-state"
                    value={customStateNum}
                    onChange={(e) => setCustomStateNum(e.target.value)}
                    className="w-24 bg-background border border-border rounded px-2.5 py-1.5 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="0">State 0</option>
                    <option value="1">State 1</option>
                  </select>
                  <button
                    data-testid="button-load-custom"
                    onClick={handleCustomLoad}
                    className="px-3 py-1.5 rounded bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                  >
                    Load
                  </button>
                </div>
                {customTapeError && (
                  <p className="text-[10px] font-mono text-destructive mt-1.5 flex items-start gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                    {customTapeError}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── TRANSITION TABLE ── */}
          <div className="px-4 pt-4 pb-4">
            <button
              data-testid="button-toggle-transition-table"
              onClick={() => setTransitionOpen((v) => !v)}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest font-mono mb-2"
            >
              {transitionOpen ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
              Wolfram (2,3) Transition Table
            </button>

            {transitionOpen && (
              <div className="bg-card border border-border rounded-md overflow-hidden">
                <table className="w-full text-sm font-mono">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-widest">
                      <th className="px-4 py-2 text-left">State</th>
                      <th className="px-4 py-2 text-left">Symbol</th>
                      <th className="px-4 py-2 text-left">New State</th>
                      <th className="px-4 py-2 text-left">New Symbol</th>
                      <th className="px-4 py-2 text-left">Direction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      [0, 0, 1, 1, "Right"],
                      [0, 1, 1, 2, "Left"],
                      [0, 2, 0, 1, "Left"],
                      [1, 0, 1, 2, "Right"],
                      [1, 1, 0, 2, "Right"],
                      [1, 2, 0, 0, "Left"],
                    ].map(([s, sym, ns, nsym, dir], i) => (
                      <tr
                        key={i}
                        className={[
                          "border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors",
                          state.machineState === s ? "bg-primary/5" : "",
                        ].join(" ")}
                      >
                        <td className="px-4 py-2 text-primary">{s}</td>
                        <td className="px-4 py-2">{sym}</td>
                        <td className="px-4 py-2 text-primary">{ns}</td>
                        <td className="px-4 py-2">{nsym}</td>
                        <td
                          className={`px-4 py-2 ${dir === "Right" ? "text-chart-4" : "text-chart-3"}`}
                        >
                          {String(dir)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── SCRIPT MODE SELECTOR ── */}
          <ScriptModeSelector
            selectedMode={state.scriptMode}
            onSelectMode={setScriptMode}
            tape={state.tape}
            headPosition={state.headPosition}
            machineState={state.machineState}
          />

          {/* ── LIVE MODE PANEL (record-only only) ── */}
          {state.scriptMode === "record-only" && (
            <div className="px-4 pb-4">
              <LiveModePanel
                enabled={liveEnabled}
                onEnable={handleEnableLive}
                onDisable={handleDisableLive}
                currentUtxo={currentUtxo}
              />
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN: TX LOG ── */}
        <div className="w-full lg:w-96 xl:w-[440px] border-t lg:border-t-0 lg:border-l border-border flex flex-col min-h-0 max-h-[60vh] lg:max-h-none">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
                Transaction Log
              </span>
              {isLiveMode && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-primary/20 text-primary border border-primary/30 uppercase">
                  Live
                </span>
              )}
            </div>
            <span className="text-xs font-mono text-primary">
              {state.transactions.length} tx
            </span>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            {state.transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <Activity className="w-8 h-8 mb-3 opacity-20" />
                <p className="text-xs font-mono">No transactions yet</p>
                <p className="text-xs text-muted-foreground/50 mt-1">
                  {isLiveMode ? "Click Live Step to broadcast" : "Press Start or Step to begin"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {state.transactions.map((tx) => {
                  const isLiveTx = tx.description.startsWith("LIVE |");
                  return (
                    <div
                      key={tx.txid}
                      data-testid={`tx-entry-${tx.step}`}
                      className={[
                        "px-4 py-2.5 hover:bg-muted/10 transition-colors",
                        isLiveTx ? "border-l-2 border-primary/40" : "",
                      ].join(" ")}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-muted-foreground/60 w-8 flex-shrink-0">
                          #{tx.step}
                        </span>
                        {isLiveTx && (
                          <Radio className="w-2.5 h-2.5 text-primary flex-shrink-0" />
                        )}
                        <span className="text-[10px] font-mono text-primary truncate">
                          {shortTxid(tx.txid)}
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-muted-foreground leading-relaxed pl-10 break-all">
                        {tx.description
                          .replace(/^TX-ID: [a-f0-9]+…[a-f0-9]+ \| /, "")
                          .replace(/^LIVE \| [a-f0-9]+…[a-f0-9]+ \| /, "")}
                      </p>
                    </div>
                  );
                })}
                <div ref={logEndRef} />
              </div>
            )}
          </div>

          {state.transactions.length > 0 && (
            <div className="px-4 py-3 border-t border-border">
              <button
                data-testid="button-export-csv-log"
                onClick={exportCSV}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-primary/5 border border-primary/20 text-primary text-xs font-medium hover:bg-primary/10 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Export {state.transactions.length} Transactions as CSV
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-border px-6 py-2 flex items-center gap-4 text-[10px] text-muted-foreground/40 font-mono flex-wrap">
        <span>{isLiveMode ? "Live Mode — BSV Mainnet" : "Simulation Mode"}</span>
        <span className="w-px h-3 bg-border" />
        <span>{isLiveMode ? "TXID = WhatsOnChain broadcast" : "TXID = SHA256(encodedState)"}</span>
        <span className="w-px h-3 bg-border" />
        <span>
          Script:{" "}
          <span className="text-primary/60">{SCRIPT_MODES[state.scriptMode].shortName}</span>
          {" · "}
          Sim: <span className="text-chart-3">{SCRIPT_MODES[state.scriptMode].simulationStatus}</span>
          {" · "}
          Live: <span className={SCRIPT_MODES[state.scriptMode].liveStatus === 'active' ? 'text-chart-3' : 'text-muted-foreground/60'}>
            {SCRIPT_MODES[state.scriptMode].liveStatus}
          </span>
        </span>
        <span className="w-px h-3 bg-border" />
        <span>OP_CAT: Genesis 2020</span>
        <span className="w-px h-3 bg-border" />
        <span>SIGHASH_OTDA: Chronicle only</span>
        <span className="w-px h-3 bg-border" />
        <span>@bsv/sdk v2</span>
      </footer>

      {/* ── BROADCAST DIALOG ── */}
      {livePreview && (
        <BroadcastDialog
          open={broadcastOpen}
          step={state.stepCount + 1}
          preview={livePreview}
          network={liveConfig?.network ?? "main"}
          dryRun={liveConfig?.dryRun ?? false}
          onSuccess={handleBroadcastSuccess}
          onCancel={handleBroadcastCancel}
        />
      )}
    </div>
  );
}
