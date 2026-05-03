// Main hook — wires together the Turing engine, tape, encoder, and TX simulator
// Sequential, deterministic execution. Uses refs to avoid stale-closure bugs in async loops.

import { useCallback, useRef, useState } from 'react';
import { createTape, writeCell, moveHead, tapeToArray, parseTapeString, Tape } from '../core/tape';
import { turingStep, describeStep } from '../core/turing';
import { SimulatedTx, simulateTransaction, downloadCSV } from '../bsv/txSimulator';
import { SimulationWalletAdapter } from '../bsv/walletAdapter';

const DEMO_TAPE_STRING = '0000001101000000';
const DEMO_HEAD = 6;
const DEMO_STATE = 0;
const FUND_AMOUNT = 50_000n;
const FEE_PER_STEP = 1n;
const INITIAL_BALANCE = 100_000n;

export interface TuringMachineState {
  tape: Tape;
  headPosition: number;
  machineState: number;
  stepCount: number;
  running: boolean;
  outOfFunds: boolean;
  transactions: SimulatedTx[];
  balance: bigint;
  speed: number;
}

// Internal mutable snapshot used by the async loop — avoids stale closures
interface MachineSnapshot {
  tape: Tape;
  headPosition: number;
  machineState: number;
  stepCount: number;
  transactions: SimulatedTx[];
  speed: number;
}

const DEFAULT_STATE: TuringMachineState = {
  tape: createTape([0]),
  headPosition: 0,
  machineState: 0,
  stepCount: 0,
  running: false,
  outOfFunds: false,
  transactions: [],
  balance: INITIAL_BALANCE,
  speed: 100,
};

export function useTuringMachine() {
  const [uiState, setUiState] = useState<TuringMachineState>(DEFAULT_STATE);

  // Mutable refs — readable from any async context without stale closures
  const walletRef = useRef(new SimulationWalletAdapter(INITIAL_BALANCE, FEE_PER_STEP));
  const runningRef = useRef(false);
  const abortRef = useRef(false);
  const snapRef = useRef<MachineSnapshot>({
    tape: DEFAULT_STATE.tape,
    headPosition: DEFAULT_STATE.headPosition,
    machineState: DEFAULT_STATE.machineState,
    stepCount: DEFAULT_STATE.stepCount,
    transactions: DEFAULT_STATE.transactions,
    speed: DEFAULT_STATE.speed,
  });
  const speedRef = useRef(DEFAULT_STATE.speed);

  /** Execute one Turing step and return updated snapshot, or null if out of funds. */
  const executeOneStep = useCallback(
    async (snap: MachineSnapshot): Promise<MachineSnapshot | null> => {
      const hasFunds = walletRef.current.deductFee();
      if (!hasFunds) return null;

      const tapeCells = tapeToArray(snap.tape);
      const result = turingStep(tapeCells, snap.headPosition, snap.machineState);

      // Write new symbol
      const tapeAfterWrite = writeCell(snap.tape, snap.headPosition, result.newSymbol);
      // Move head (may expand tape)
      const { tape: newTape, headPosition: newHead } = moveHead(
        tapeAfterWrite,
        snap.headPosition,
        result.direction
      );

      const newStep = snap.stepCount + 1;
      const desc = describeStep(result);
      const newCells = tapeToArray(newTape);

      const tx = await simulateTransaction(newCells, newHead, result.newState, newStep, desc);
      const txWithId: SimulatedTx = {
        ...tx,
        description: `TX-ID: ${tx.txid.slice(0, 8)}…${tx.txid.slice(-6)} | ${desc}`,
      };

      return {
        tape: newTape,
        headPosition: newHead,
        machineState: result.newState,
        stepCount: newStep,
        transactions: [...snap.transactions, txWithId],
        speed: snap.speed,
      };
    },
    []
  );

  /** Single step — usable even while stopped */
  const step = useCallback(async () => {
    if (runningRef.current || uiState.outOfFunds) return;
    const newSnap = await executeOneStep(snapRef.current);
    const balance = await walletRef.current.getBalance();
    if (!newSnap) {
      setUiState((s) => ({ ...s, outOfFunds: true, balance }));
      return;
    }
    snapRef.current = newSnap;
    setUiState((s) => ({
      ...s,
      tape: newSnap.tape,
      headPosition: newSnap.headPosition,
      machineState: newSnap.machineState,
      stepCount: newSnap.stepCount,
      transactions: newSnap.transactions,
      balance,
    }));
  }, [uiState.outOfFunds, executeOneStep]);

  /** Start auto-run loop */
  const start = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    abortRef.current = false;
    setUiState((s) => ({ ...s, running: true }));

    const loop = async () => {
      while (!abortRef.current) {
        const newSnap = await executeOneStep(snapRef.current);
        const balance = await walletRef.current.getBalance();

        if (!newSnap) {
          snapRef.current = { ...snapRef.current };
          setUiState((s) => ({ ...s, outOfFunds: true, running: false, balance }));
          runningRef.current = false;
          return;
        }

        snapRef.current = newSnap;
        setUiState((s) => ({
          ...s,
          tape: newSnap.tape,
          headPosition: newSnap.headPosition,
          machineState: newSnap.machineState,
          stepCount: newSnap.stepCount,
          transactions: newSnap.transactions,
          balance,
        }));

        // Non-blocking delay — read speed from ref to pick up changes mid-run
        const delay = speedRef.current;
        if (delay > 0) {
          await new Promise<void>((resolve) => setTimeout(resolve, delay));
        } else {
          await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        }
      }

      runningRef.current = false;
      setUiState((s) => ({ ...s, running: false }));
    };

    loop();
  }, [executeOneStep]);

  const stop = useCallback(() => {
    abortRef.current = true;
    setUiState((s) => ({ ...s, running: false }));
  }, []);

  const resetMachine = useCallback((
    tape: Tape,
    headPosition: number,
    machineState: number
  ) => {
    abortRef.current = true;
    runningRef.current = false;
    walletRef.current = new SimulationWalletAdapter(INITIAL_BALANCE, FEE_PER_STEP);
    speedRef.current = 100;
    const newSnap: MachineSnapshot = {
      tape,
      headPosition,
      machineState,
      stepCount: 0,
      transactions: [],
      speed: 100,
    };
    snapRef.current = newSnap;
    setUiState({
      tape,
      headPosition,
      machineState,
      stepCount: 0,
      running: false,
      outOfFunds: false,
      transactions: [],
      balance: INITIAL_BALANCE,
      speed: 100,
    });
  }, []);

  const reset = useCallback(() => {
    resetMachine(createTape([0]), 0, 0);
  }, [resetMachine]);

  const loadDemo = useCallback(() => {
    const cells = parseTapeString(DEMO_TAPE_STRING);
    resetMachine(createTape(cells), DEMO_HEAD, DEMO_STATE);
  }, [resetMachine]);

  const fund = useCallback(() => {
    walletRef.current.fund(FUND_AMOUNT);
    setUiState((s) => ({ ...s, outOfFunds: false, balance: s.balance + FUND_AMOUNT }));
  }, []);

  const setSpeed = useCallback((ms: number) => {
    speedRef.current = ms;
    snapRef.current = { ...snapRef.current, speed: ms };
    setUiState((s) => ({ ...s, speed: ms }));
  }, []);

  const exportCSV = useCallback(() => {
    downloadCSV(snapRef.current.transactions);
  }, []);

  const setCustomTape = useCallback((tapeStr: string, head: number, machineState: number) => {
    const cells = parseTapeString(tapeStr);
    if (cells.length === 0) return;
    const clampedHead = Math.max(0, Math.min(head, cells.length - 1));
    const clampedState = machineState === 0 || machineState === 1 ? machineState : 0;
    resetMachine(createTape(cells), clampedHead, clampedState);
  }, [resetMachine]);

  return {
    state: uiState,
    step,
    start,
    stop,
    reset,
    loadDemo,
    fund,
    setSpeed,
    exportCSV,
    setCustomTape,
  };
}
