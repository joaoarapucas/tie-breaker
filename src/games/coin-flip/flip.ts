export type Side = 'heads' | 'tails'

/**
 * Uses the crypto RNG rather than Math.random: in an app whose whole point is a
 * fair draw, the randomness source is the feature. Testing the low bit of a byte
 * is exactly 50/50 across the 256 possible values, so there is no modulo bias.
 */
export const flip = (): Side =>
  (crypto.getRandomValues(new Uint8Array(1))[0] & 1) === 0 ? 'heads' : 'tails'
