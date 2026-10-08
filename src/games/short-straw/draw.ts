export const MIN_PLAYERS = 2
export const MAX_PLAYERS = 10

/** Visible length of the shortest straw, as a fraction of the longest. */
const SHORTEST = 0.35
/** The other straws are spread evenly between these, so the loser is obvious. */
const LONG_MIN = 0.6
const LONG_MAX = 1

/**
 * Uniform integer in [0, max) from the crypto RNG. Rejection sampling discards
 * the top sliver of the 32-bit range that would otherwise make low values
 * slightly more likely (modulo bias).
 */
export const randomInt = (max: number): number => {
  if (!Number.isInteger(max) || max < 1 || max > 2 ** 32) {
    throw new RangeError(`randomInt: max must be an integer in [1, 2^32], got ${max}`)
  }
  const limit = 2 ** 32 - (2 ** 32 % max)
  const buffer = new Uint32Array(1)
  for (;;) {
    crypto.getRandomValues(buffer)
    if (buffer[0] < limit) return buffer[0] % max
  }
}

/** Fisher–Yates shuffle into a new array; every permutation is equally likely. */
export const shuffle = <T>(items: readonly T[]): T[] => {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * One straw per player, all of distinct lengths (fractions of the longest),
 * in random order. Exactly one is the shortest. Because the order is a uniform
 * shuffle, each position is equally likely to hold it, whatever the players pick.
 */
export const drawStraws = (count: number): number[] => {
  if (!Number.isInteger(count) || count < MIN_PLAYERS || count > MAX_PLAYERS) {
    throw new RangeError(
      `drawStraws: count must be an integer in [${MIN_PLAYERS}, ${MAX_PLAYERS}], got ${count}`,
    )
  }
  const longOnes = count - 1
  const step = longOnes > 1 ? (LONG_MAX - LONG_MIN) / (longOnes - 1) : 0
  const lengths = [SHORTEST]
  for (let i = 0; i < longOnes; i++) lengths.push(LONG_MAX - i * step)
  return shuffle(lengths)
}

/** Index of the shortest straw. */
export const shortestIndex = (straws: readonly number[]): number =>
  straws.reduce((best, length, i) => (length < straws[best] ? i : best), 0)
