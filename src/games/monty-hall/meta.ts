import { lazy } from 'react'
import type { GameMeta } from '../types'

export const montyHall: GameMeta = {
  id: 'monty-hall',
  name: 'Monty Hall',
  tagline: 'Three doors, one trophy. A goat door opens — stay or switch?',
  category: 'luck',
  players: '1 player',
  emoji: '🚪',
  Component: lazy(() => import('./MontyHall')),
}
