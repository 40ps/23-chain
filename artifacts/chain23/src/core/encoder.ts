// State encoding for OP_RETURN
// Format: "{state}|{headPosition}|{tapeBase3}"
// Example: "1|42|000120201"
// This is then hex-encoded for OP_RETURN embedding.

/**
 * Encode the current Turing machine state as a compact string.
 * Tape uses base-3 (characters 0,1,2 only) — NOT JSON.
 */
export function encodeState(
  tape: number[],
  headPosition: number,
  state: number
): string {
  const tapeBase3 = tape.join(''); // Already base-3
  return `${state}|${headPosition}|${tapeBase3}`;
}

/**
 * Convert encoded state string to hex — suitable for OP_RETURN payload.
 */
export function encodeStateToHex(
  tape: number[],
  headPosition: number,
  state: number
): string {
  const encoded = encodeState(tape, headPosition, state);
  const bytes = new TextEncoder().encode(encoded);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Decode a hex-encoded state back to its components.
 * Returns null if the hex is malformed.
 */
export function decodeStateFromHex(
  hex: string
): { state: number; headPosition: number; tape: number[] } | null {
  try {
    const pairs = hex.match(/.{1,2}/g);
    if (!pairs) return null;
    const bytes = new Uint8Array(pairs.map((b) => parseInt(b, 16)));
    const decoded = new TextDecoder().decode(bytes);
    const [statePart, headPart, tapePart] = decoded.split('|');
    if (statePart === undefined || headPart === undefined || tapePart === undefined)
      return null;
    return {
      state: parseInt(statePart, 10),
      headPosition: parseInt(headPart, 10),
      tape: tapePart.split('').map(Number),
    };
  } catch {
    return null;
  }
}
