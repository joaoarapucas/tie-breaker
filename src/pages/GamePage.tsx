import { Suspense } from 'react'
import { Link, useParams } from 'react-router'
import { findGame } from '../games/registry'
import styles from './GamePage.module.css'

export default function GamePage() {
  const { gameId } = useParams()
  const game = gameId ? findGame(gameId) : undefined

  if (!game) {
    return (
      <div className={styles.notFound}>
        <h1>Game not found</h1>
        <p>That link doesn&rsquo;t point to a game.</p>
        <Link to="/" className={styles.back}>
          &larr; All games
        </Link>
      </div>
    )
  }

  const { Component } = game

  return (
    <div>
      <Link to="/" className={styles.back}>
        &larr; All games
      </Link>
      <h1 className={styles.title}>{game.name}</h1>
      <p>{game.tagline}</p>
      <Suspense fallback={<p className={styles.loading}>Loading&hellip;</p>}>
        <Component />
      </Suspense>
    </div>
  )
}
