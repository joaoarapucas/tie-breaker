import { GameCard } from '../components/GameCard'
import { games } from '../games/registry'
import type { GameCategory } from '../games/types'
import styles from './CatalogPage.module.css'

const SECTIONS: { category: GameCategory; title: string; blurb: string }[] = [
  {
    category: 'luck',
    title: 'Pure luck',
    blurb: 'Even odds, so nobody can complain.',
  },
  {
    category: 'skill',
    title: 'Pure skill',
    blurb: 'Earn it. Best player takes the tie.',
  },
]

export default function CatalogPage() {
  return (
    <div className={styles.catalog}>
      {SECTIONS.map(({ category, title, blurb }) => {
        const entries = games.filter((game) => game.category === category)
        return (
          <section key={category}>
            <h2>{title}</h2>
            <p className={styles.blurb}>{blurb}</p>
            {entries.length > 0 ? (
              <div className={styles.grid}>
                {entries.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <p className={styles.empty}>Nothing here yet.</p>
            )}
          </section>
        )
      })}
    </div>
  )
}
