// Wolfram (2,3) Turing Machine — pure logic, no BSV dependency
// Stateless: takes current state and returns result of one step

export const wolfram23Lookup: Record<number, Record<number, [number, number, number]>> = {
  0: {
    0: [1, 1, 1],
    1: [1, 2, -1],
    2: [0, 1, -1],
  },
  1: {
    0: [1, 2, 1],
    1: [0, 2, 1],
    2: [0, 0, -1],
  },
};

export interface StepResult {
  prevState: number;
  prevSymbol: number;
  newState: number;
  newSymbol: number;
  direction: -1 | 1;
}

/**
 * Execute one Turing step. Returns the result — does NOT mutate anything.
 * The caller is responsible for applying the result to the tape and head.
 */
export function turingStep(
  tape: number[],
  headPosition: number,
  state: number
): StepResult {
  const prevSymbol = tape[headPosition] ?? 0;
  const lookup = wolfram23Lookup[state];
  if (!lookup) throw new Error(`Invalid state: ${state}`);
  const rule = lookup[prevSymbol];
  if (!rule) throw new Error(`No rule for state=${state} symbol=${prevSymbol}`);

  const [newState, newSymbol, direction] = rule;

  return {
    prevState: state,
    prevSymbol,
    newState,
    newSymbol,
    direction: direction as -1 | 1,
  };
}

/**
 * Human-readable description of a step result for logs.
 */
export function describeStep(result: StepResult): string {
  const dirLabel = result.direction === 1 ? 'Right' : 'Left';
  return `Input: (State ${result.prevState}, Color ${result.prevSymbol}) -> Output: (State ${result.newState}, Color ${result.newSymbol}, Move ${dirLabel})`;
}
