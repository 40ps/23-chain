// Script Mode Selector — shows the three modes with status badges,
// protocol requirements, and the generated script template for the current state.

import { useState } from 'react';
import {
  ScriptMode,
  ScriptModeInfo,
  SCRIPT_MODES,
  generateScriptTemplate,
  ImplStatus,
} from '@/bsv/scriptModes';
import { tapeToArray, Tape } from '@/core/tape';
import { ChevronDown, ChevronRight, CheckCircle, Circle, Clock, Zap } from 'lucide-react';

interface Props {
  selectedMode: ScriptMode;
  onSelectMode: (mode: ScriptMode) => void;
  tape: Tape;
  headPosition: number;
  machineState: number;
}

// ─── Badge helpers ────────────────────────────────────────────────────────────

function StatusBadge({ status, label }: { status: ImplStatus; label: string }) {
  const configs: Record<ImplStatus, { icon: React.ReactNode; className: string }> = {
    active: {
      icon: <CheckCircle className="w-3 h-3" />,
      className: 'bg-chart-3/10 text-chart-3 border border-chart-3/30',
    },
    template: {
      icon: <Circle className="w-3 h-3" />,
      className: 'bg-primary/10 text-primary border border-primary/30',
    },
    todo: {
      icon: <Clock className="w-3 h-3" />,
      className: 'bg-muted text-muted-foreground border border-border',
    },
  };
  const { icon, className } = configs[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium ${className}`}>
      {icon}
      {label}
    </span>
  );
}

function BoolBadge({ value, trueLabel, falseLabel }: { value: boolean; trueLabel: string; falseLabel: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${
        value
          ? 'bg-chart-4/10 text-chart-4 border-chart-4/30'
          : 'bg-muted text-muted-foreground border-border'
      }`}
    >
      {value ? trueLabel : falseLabel}
    </span>
  );
}

// ─── Mode Card ────────────────────────────────────────────────────────────────

function ModeCard({
  info,
  selected,
  onSelect,
  tape,
  headPosition,
  machineState,
}: {
  info: ScriptModeInfo;
  selected: boolean;
  onSelect: () => void;
  tape: Tape;
  headPosition: number;
  machineState: number;
}) {
  const [showTemplate, setShowTemplate] = useState(false);
  const [showOpcodes, setShowOpcodes] = useState(false);

  const cells = tapeToArray(tape);
  const template = generateScriptTemplate(info.id, cells, headPosition, machineState);

  const sinceBadgeColor = (since: string) => {
    if (since === 'Chronicle 2024') return 'text-chart-5';
    if (since === 'Genesis 2020') return 'text-chart-4';
    return 'text-muted-foreground';
  };

  return (
    <div
      className={[
        'rounded-md border transition-all duration-150 cursor-pointer',
        selected
          ? 'border-primary bg-card shadow-md shadow-primary/10'
          : 'border-border bg-card hover:border-border/80',
      ].join(' ')}
      onClick={onSelect}
      data-testid={`mode-card-${info.id}`}
    >
      {/* Header row */}
      <div className="px-4 pt-3 pb-3 flex items-start gap-3">
        {/* Selection indicator */}
        <div
          className={[
            'mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors',
            selected ? 'border-primary' : 'border-muted-foreground/40',
          ].join(' ')}
        >
          {selected && <div className="w-2 h-2 rounded-full bg-primary" />}
        </div>

        {/* Title + badges */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className={`text-sm font-semibold ${selected ? 'text-foreground' : 'text-foreground/80'}`}>
              {info.name}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground/60 truncate">
              {info.protocol}
            </span>
          </div>

          {/* Status row */}
          <div className="flex items-center gap-2 flex-wrap">
            <BoolBadge value={info.recordsState} trueLabel="Records State" falseLabel="No Recording" />
            <BoolBadge
              value={info.verifiesTransition}
              trueLabel="Verifies On-Chain"
              falseLabel="Off-Chain Only"
            />
            <StatusBadge status={info.simulationStatus} label={`Sim: ${info.simulationStatus}`} />
            <StatusBadge status={info.liveStatus} label={`Live: ${info.liveStatus}`} />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-4 pb-3 text-xs text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
        {info.description}
      </div>

      {/* Requirements */}
      <div className="px-4 pb-3">
        <p className="text-[10px] text-muted-foreground/60 font-mono uppercase tracking-widest mb-1.5">
          Requirements
        </p>
        <ul className="space-y-0.5">
          {info.requirements.map((req, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <span className="text-primary/60 mt-0.5 flex-shrink-0">·</span>
              {req}
            </li>
          ))}
        </ul>
      </div>

      {/* Notes */}
      {info.notes.length > 0 && (
        <div className="px-4 pb-3 border-t border-border/30 pt-2">
          {info.notes.map((note, i) => (
            <p key={i} className="text-[10px] font-mono text-muted-foreground/50 leading-relaxed">
              {note}
            </p>
          ))}
        </div>
      )}

      {/* Expand: Opcodes */}
      <div className="border-t border-border/30">
        <button
          className="w-full px-4 py-2 flex items-center gap-2 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
          onClick={(e) => {
            e.stopPropagation();
            setShowOpcodes((v) => !v);
          }}
          data-testid={`toggle-opcodes-${info.id}`}
        >
          {showOpcodes ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          Opcodes ({info.opcodes.length})
        </button>
        {showOpcodes && (
          <div className="px-4 pb-3">
            <table className="w-full text-[10px] font-mono">
              <thead>
                <tr className="text-muted-foreground/50 border-b border-border/30">
                  <th className="text-left pb-1">Opcode</th>
                  <th className="text-left pb-1">Purpose</th>
                  <th className="text-left pb-1">Since</th>
                </tr>
              </thead>
              <tbody>
                {info.opcodes.map((op, i) => (
                  <tr key={i} className="border-b border-border/20 last:border-0">
                    <td className="py-0.5 pr-3 text-primary font-medium">{op.name}</td>
                    <td className="py-0.5 pr-3 text-muted-foreground">{op.purpose}</td>
                    <td className={`py-0.5 ${sinceBadgeColor(op.since)}`}>{op.since}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Expand: Script Template */}
      <div className="border-t border-border/30">
        <button
          className="w-full px-4 py-2 flex items-center gap-2 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
          onClick={(e) => {
            e.stopPropagation();
            setShowTemplate((v) => !v);
          }}
          data-testid={`toggle-template-${info.id}`}
        >
          {showTemplate ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          Script Template (current state)
        </button>

        {showTemplate && (
          <div className="px-4 pb-4 space-y-3" onClick={(e) => e.stopPropagation()}>
            {/* OP_RETURN payload */}
            <div>
              <p className="text-[9px] font-mono text-muted-foreground/50 uppercase tracking-widest mb-1">
                OP_RETURN Payload
              </p>
              <pre className="bg-background border border-border/50 rounded p-2 text-[10px] font-mono text-chart-3 overflow-x-auto whitespace-pre-wrap">
                {template.opReturnPayload}
              </pre>
            </div>

            {/* Locking script */}
            <div>
              <p className="text-[9px] font-mono text-muted-foreground/50 uppercase tracking-widest mb-1">
                Locking Script (scriptPubKey)
              </p>
              <pre className="bg-background border border-border/50 rounded p-2 text-[10px] font-mono text-foreground/70 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {template.lockingScript}
              </pre>
            </div>

            {/* Unlocking script */}
            <div>
              <p className="text-[9px] font-mono text-muted-foreground/50 uppercase tracking-widest mb-1">
                Unlocking Script (scriptSig)
              </p>
              <pre className="bg-background border border-border/50 rounded p-2 text-[10px] font-mono text-foreground/70 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {template.unlockingScript}
              </pre>
            </div>

            {/* Notes */}
            <div>
              <p className="text-[9px] font-mono text-muted-foreground/50 uppercase tracking-widest mb-1">
                Implementation Notes
              </p>
              <pre className="bg-background border border-border/50 rounded p-2 text-[10px] font-mono text-muted-foreground/60 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {template.notes}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ScriptModeSelector({ selectedMode, onSelectMode, tape, headPosition, machineState }: Props) {
  const modes: ScriptMode[] = ['record-only', 'genesis-covenant', 'chronicle-otda'];

  return (
    <div className="px-4 pb-4">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          Script Mode
        </span>
        <div className="flex-1 h-px bg-border/40" />
        <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground/50">
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-chart-3" /> Active
          </span>
          <span className="flex items-center gap-1">
            <Circle className="w-3 h-3 text-primary" /> Template
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-muted-foreground" /> TODO
          </span>
        </div>
      </div>

      {/* Mode cards */}
      <div className="grid grid-cols-1 gap-3">
        {modes.map((id) => (
          <ModeCard
            key={id}
            info={SCRIPT_MODES[id]}
            selected={selectedMode === id}
            onSelect={() => onSelectMode(id)}
            tape={tape}
            headPosition={headPosition}
            machineState={machineState}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-4 text-[10px] font-mono text-muted-foreground/40">
        <span className="text-chart-4">Genesis 2020</span>
        <span>·</span>
        <span className="text-chart-5">Chronicle 2024</span>
        <span>·</span>
        <span className="text-muted-foreground/40">Always available</span>
      </div>
    </div>
  );
}
