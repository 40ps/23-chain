// Dynamic tape — infinite in both directions
// All operations are pure: they return new tape objects, never mutate

export interface Tape {
  cells: number[];
  /** Number of cells prepended to the left. Converts absolute head index to array index. */
  offset: number;
}

export function createTape(initialCells: number[] = [], initialOffset = 0): Tape {
  if (initialCells.length === 0) {
    return { cells: [0], offset: 0 };
  }
  return { cells: [...initialCells], offset: initialOffset };
}

/** Convert an absolute head position to the array index inside cells[]. */
function toLocal(tape: Tape, absoluteIndex: number): number {
  return absoluteIndex + tape.offset;
}

export function readCell(tape: Tape, absoluteIndex: number): number {
  const local = toLocal(tape, absoluteIndex);
  if (local < 0 || local >= tape.cells.length) return 0;
  return tape.cells[local];
}

export function writeCell(tape: Tape, absoluteIndex: number, value: number): Tape {
  let cells = [...tape.cells];
  let { offset } = tape;
  let local = toLocal({ cells, offset }, absoluteIndex);

  // Expand left
  while (local < 0) {
    cells = [0, ...cells];
    offset++;
    local = absoluteIndex + offset;
  }

  // Expand right
  while (local >= cells.length) {
    cells = [...cells, 0];
  }

  cells[local] = value;
  return { cells, offset };
}

/**
 * Move the head. Returns new tape + new head position.
 * Guarantees head is never out of bounds.
 */
export function moveHead(
  tape: Tape,
  headPosition: number,
  direction: -1 | 1
): { tape: Tape; headPosition: number } {
  const next = headPosition + direction;

  if (direction === -1 && next < 0) {
    // Prepend a 0 and keep head at absolute 0
    const newTape: Tape = {
      cells: [0, ...tape.cells],
      offset: tape.offset + 1,
    };
    return { tape: newTape, headPosition: 0 };
  }

  if (direction === 1) {
    const local = toLocal(tape, next);
    if (local >= tape.cells.length) {
      const newTape: Tape = {
        cells: [...tape.cells, 0],
        offset: tape.offset,
      };
      return { tape: newTape, headPosition: next };
    }
  }

  return { tape, headPosition: next };
}

export function tapeToArray(tape: Tape): number[] {
  return [...tape.cells];
}

/**
 * Parse a tape string: accepts characters '0', '1', '2'.
 * Silently drops any other characters.
 */
export function parseTapeString(input: string): number[] {
  return input
    .split('')
    .filter((c) => c === '0' || c === '1' || c === '2')
    .map(Number);
}
