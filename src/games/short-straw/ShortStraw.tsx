import { useEffect, useState, type CSSProperties } from 'react'
import {
  MAX_PLAYERS,
  MIN_PLAYERS,
  drawStraws,
  shortestIndex,
} from './draw'
import styles from './ShortStraw.module.css'

const REVEAL_MS = 900
const DEFAULT_PLAYERS = 3

type State =
  | { phase: 'setup' }
  /** owners[i] is the index of the player holding straw i, or null if untaken. */
  | { phase: 'drawing'; straws: number[]; owners: (number | null)[] }
  | { phase: 'revealing' | 'result'; straws: number[]; owners: number[] }

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const displayName = (names: string[], player: number) =>
  names[player].trim() || `Player ${player + 1}`

export default function ShortStraw() {
  const [names, setNames] = useState<string[]>(() =>
    Array<string>(DEFAULT_PLAYERS).fill(''),
  )
  const [state, setState] = useState<State>({ phase: 'setup' })

  useEffect(() => {
    if (state.phase !== 'revealing') return
    const duration = prefersReducedMotion() ? 0 : REVEAL_MS
    const timer = setTimeout(
      () => setState({ ...state, phase: 'result' }),
      duration,
    )
    return () => clearTimeout(timer)
  }, [state])

  const setCount = (count: number) =>
    setNames((current) =>
      count > current.length
        ? [...current, ...Array<string>(count - current.length).fill('')]
        : current.slice(0, count),
    )

  const start = () =>
    setState({
      phase: 'drawing',
      straws: drawStraws(names.length),
      owners: Array<null>(names.length).fill(null),
    })

  const pick = (straw: number) => {
    if (state.phase !== 'drawing' || state.owners[straw] !== null) return
    const owners = [...state.owners]
    const taken = owners.filter((owner) => owner !== null).length
    owners[straw] = taken
    // The last player has no choice to make, so hand them the remaining straw.
    if (taken === owners.length - 2) {
      owners[owners.indexOf(null)] = owners.length - 1
      setState({
        phase: 'revealing',
        straws: state.straws,
        owners: owners as number[],
      })
    } else {
      setState({ ...state, owners })
    }
  }

  if (state.phase === 'setup') {
    return (
      <form
        className={styles.game}
        onSubmit={(event) => {
          event.preventDefault()
          start()
        }}
      >
        <div className={styles.counter}>
          <span id="player-count-label">Players</span>
          <button
            type="button"
            className={styles.step}
            aria-label="Remove a player"
            disabled={names.length <= MIN_PLAYERS}
            onClick={() => setCount(names.length - 1)}
          >
            &minus;
          </button>
          <output
            className={styles.count}
            aria-labelledby="player-count-label"
            aria-live="polite"
          >
            {names.length}
          </output>
          <button
            type="button"
            className={styles.step}
            aria-label="Add a player"
            disabled={names.length >= MAX_PLAYERS}
            onClick={() => setCount(names.length + 1)}
          >
            +
          </button>
        </div>

        <ol className={styles.names}>
          {names.map((name, i) => (
            <li key={i}>
              <label>
                <span className={styles.badge}>{i + 1}</span>
                <input
                  className={styles.input}
                  value={name}
                  maxLength={24}
                  placeholder={`Player ${i + 1}`}
                  aria-label={`Name of player ${i + 1}`}
                  onChange={(event) =>
                    setNames(
                      names.map((n, j) => (j === i ? event.target.value : n)),
                    )
                  }
                />
              </label>
            </li>
          ))}
        </ol>

        <button type="submit" className={styles.button}>
          Draw straws
        </button>
      </form>
    )
  }

  const { straws, owners } = state
  const revealed = state.phase !== 'drawing'
  const done = state.phase === 'result'
  const shortest = shortestIndex(straws)
  const loser = done ? owners[shortest] : null
  const current =
    state.phase === 'drawing'
      ? owners.filter((owner) => owner !== null).length
      : null

  return (
    <div className={styles.game}>
      <p className={styles.verdict} aria-live="polite">
        {current !== null && (
          <>
            <strong>{displayName(names, current)}</strong>, pick a straw.
          </>
        )}
        {state.phase === 'revealing' && 'Revealing…'}
        {loser !== null && (
          <>
            <strong>{displayName(names, loser)}</strong> drew the short straw.
          </>
        )}
      </p>

      <div className={styles.bundle}>
        {straws.map((length, i) => {
          const owner = owners[i]
          const classes = [
            styles.straw,
            revealed && styles.revealed,
            done && i === shortest && styles.loser,
          ]
            .filter(Boolean)
            .join(' ')
          return (
            <div key={i} className={styles.slot}>
              <button
                type="button"
                className={classes}
                // Lengths stay out of the DOM until the reveal, so there is
                // nothing to peek at in dev tools.
                style={
                  revealed
                    ? ({ '--len': length } as CSSProperties)
                    : undefined
                }
                disabled={owner !== null}
                aria-label={
                  owner === null
                    ? `Straw ${i + 1}`
                    : `Straw ${i + 1}, taken by ${displayName(names, owner)}`
                }
                onClick={() => pick(i)}
              />
              <span className={styles.badge} aria-hidden="true">
                {owner === null ? '' : owner + 1}
              </span>
            </div>
          )
        })}
      </div>

      {done && (
        <ol className={styles.results}>
          {names.map((_, player) => (
            <li
              key={player}
              className={
                player === loser ? styles.loserRow : undefined
              }
            >
              <span className={styles.badge}>{player + 1}</span>
              {displayName(names, player)}
            </li>
          ))}
        </ol>
      )}

      {state.phase !== 'drawing' && (
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.button}
            disabled={!done}
            onClick={start}
          >
            Draw again
          </button>
          <button
            type="button"
            className={styles.button}
            disabled={!done}
            onClick={() => setState({ phase: 'setup' })}
          >
            Change players
          </button>
        </div>
      )}
    </div>
  )
}
