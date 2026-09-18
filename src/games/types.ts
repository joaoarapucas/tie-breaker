import type { ComponentType, LazyExoticComponent } from 'react'

/** Luck games settle a tie by equal odds; skill games settle it by merit. */
export type GameCategory = 'luck' | 'skill'

export type GameMeta = {
  id: string // URL slug
  name: string
  /** One line, shown on the catalog card. */
  tagline: string
  category: GameCategory
  players: string
  /**
   * Lightweight card icon, so no image asset is needed. Stick to emoji older
   * than Emoji 13 — newer ones render as tofu on stock Windows 10 fonts.
   */
  emoji: string
  bestOn?: 'desktop' //if the game works good on both mobile and desktop
  Component: LazyExoticComponent<ComponentType>
}
