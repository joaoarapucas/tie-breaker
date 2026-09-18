import { coinFlip } from './coin-flip/meta'
import type { GameMeta } from './types'

/** Every game in the collection. Adding one means adding a line here. */
export const games: GameMeta[] = [coinFlip]

export const findGame = (id: string): GameMeta | undefined =>
  games.find((game) => game.id === id)
