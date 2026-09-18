import { lazy } from 'react'
import type { GameMeta } from '../types'

//ADD GAMES HERE

export const coinFlip: GameMeta = {
  id: 'coin-flip',
  name: 'Coin flip',
  tagline: 'Call it in the air. One toss, one winner.',
  category: 'luck',
  players: '2 players',
  emoji: '🥇',
  Component: lazy(() => import('./CoinFlip')),
}
