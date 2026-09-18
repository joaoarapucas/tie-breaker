import { useEffect, useState, type CSSProperties } from 'react'
import { flip, type Side } from './flip'
import styles from './CoinFlip.module.css'

const FLIP_MS = 1200
const SPINS = 4
const SIDES: Side[] = ['heads', 'tails']
const LABEL: Record<Side, string> = { heads: 'Heads', tails: 'Tails' }

type State =
  | { phase: 'choosing' }
  | { phase: 'flipping'; call: Side; result: Side }
  | { phase: 'result'; call: Side; result: Side }

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function CoinFlip() {
  const [state, setState] = useState<State>({ phase: 'choosing' })
  // Grows monotonically so the coin always spins forward, landing on a multiple
  // of 360deg for heads and 360deg + 180deg for tails.
  const [spin, setSpin] = useState(0)

  useEffect(() => {
    if (state.phase !== 'flipping') return
    const duration = prefersReducedMotion() ? 0 : FLIP_MS
    const timer = setTimeout(
      () => setState({ ...state, phase: 'result' }),
      duration,
    )
    return () => clearTimeout(timer)
  }, [state])

  const call = (side: Side) => {
    const result = flip()
    const facing = result === 'heads' ? 0 : 180
    setSpin(spin + SPINS * 360 + ((facing - (spin % 360) + 360) % 360))
    setState({ phase: 'flipping', call: side, result })
  }

  const done = state.phase === 'result'
  const won = done && state.call === state.result

  return (
    <div className={styles.game}>
      <div
        className={styles.coin}
        style={{ '--spin': `${spin}deg` } as CSSProperties}
        aria-hidden="true"
      >
        <div className={`${styles.face} ${styles.heads}`}>H</div>
        <div className={`${styles.face} ${styles.tails}`}>T</div>
      </div>

      <p className={styles.verdict} aria-live="polite">
        {state.phase === 'choosing' && 'Call it.'}
        {state.phase === 'flipping' && 'Flipping…'}
        {done &&
          `${LABEL[state.result]} — ${won ? 'you win!' : 'you lose.'}`}
      </p>

      {state.phase === 'choosing' ? (
        <div className={styles.actions}>
          {SIDES.map((side) => (
            <button
              key={side}
              type="button"
              className={styles.button}
              onClick={() => call(side)}
            >
              {LABEL[side]}
            </button>
          ))}
        </div>
      ) : (
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.button}
            disabled={!done}
            onClick={() => setState({ phase: 'choosing' })}
          >
            Flip again
          </button>
        </div>
      )}
    </div>
  )
}
