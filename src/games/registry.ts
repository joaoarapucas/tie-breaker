import { coinFlip } from './coin-flip/meta'
import { montyHall } from './monty-hall/meta'
import { shortStraw } from './short-straw/meta'
import type { GameMeta } from './types'

/** Every game in the collection. Adding one means adding a line here. */
export const games: GameMeta[] = [coinFlip, shortStraw, montyHall]

export const findGame = (id: string): GameMeta | undefined =>
  games.find((game) => game.id === id)
