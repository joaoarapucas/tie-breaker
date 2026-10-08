import { lazy } from 'react'
import type { GameMeta } from '../types'

export const shortStraw: GameMeta = {
  id: 'short-straw',
  name: 'Short straw',
  tagline: 'Everyone draws a straw. Shortest one loses.',
  category: 'luck',
  players: '2–10 players',
  emoji: '🥢',
  Component: lazy(() => import('./ShortStraw')),
}
