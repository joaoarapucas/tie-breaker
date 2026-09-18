import { Link } from 'react-router'
import type { GameMeta } from '../games/types'
import styles from './GameCard.module.css'
  
export function GameCard({ game }: { game: GameMeta }) {
  return (
    <Link to={`/game/${game.id}`} className={styles.card}>
      <span className={styles.emoji} aria-hidden="true">
        {game.emoji}
      </span>
      <h3>{game.name}</h3>
      <p className={styles.tagline}>{game.tagline}</p>
      <p className={styles.meta}>
        <span>{game.players}</span>
        {game.bestOn === 'desktop' && <span>Best on desktop</span>}
      </p>
    </Link>
  )
}
