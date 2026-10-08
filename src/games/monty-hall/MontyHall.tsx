import { useEffect, useState } from 'react'
import goat from '../../assets/goat.png'
import trophy from '../../assets/trophy.png'
import { DOOR_COUNT, hidePrize, hostOpens, otherDoor } from './doors'
import styles from './MontyHall.module.css'

const REVEAL_MS = 900
const DOORS = Array.from({ length: DOOR_COUNT }, (_, i) => i)

type Choice = 'stay' | 'switch'
type Tally = Record<Choice, { played: number; won: number }>

type State =
  | { phase: 'picking'; prize: number }
  /** pick is the first choice; opened is the goat door the host revealed. */
  | { phase: 'deciding'; prize: number; pick: number; opened: number }
  /** pick is the final choice, after staying or switching. */
  | {
      phase: 'revealing' | 'result'
      prize: number
      pick: number
      opened: number
      choice: Choice
    }

const EMPTY_TALLY: Tally = {
  stay: { played: 0, won: 0 },
  switch: { played: 0, won: 0 },
}

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const newRound = (): State => ({ phase: 'picking', prize: hidePrize() })

const rate = ({ played, won }: Tally[Choice]) =>
  played === 0 ? '—' : `${Math.round((won / played) * 100)}%`

export default function MontyHall() {
  const [state, setState] = useState<State>(newRound)
  const [tally, setTally] = useState<Tally>(EMPTY_TALLY)

  // Fetch both pictures up front, so a door never swings open onto nothing.
  useEffect(() => {
    for (const src of [goat, trophy]) new Image().src = src
  }, [])

  useEffect(() => {
    if (state.phase !== 'revealing') return
    const duration = prefersReducedMotion() ? 0 : REVEAL_MS
    const timer = setTimeout(() => {
      const { choice, pick, prize } = state
      setTally((current) => ({
        ...current,
        [choice]: {
          played: current[choice].played + 1,
          won: current[choice].won + (pick === prize ? 1 : 0),
        },
      }))
      setState({ ...state, phase: 'result' })
    }, duration)
    return () => clearTimeout(timer)
  }, [state])

  const choose = (door: number) => {
    if (state.phase === 'picking') {
      setState({
        phase: 'deciding',
        prize: state.prize,
        pick: door,
        opened: hostOpens(state.prize, door),
      })
    } else if (state.phase === 'deciding' && door !== state.opened) {
      setState({
        ...state,
        phase: 'revealing',
        pick: door,
        choice: door === state.pick ? 'stay' : 'switch',
      })
    }
  }

  const { phase, prize } = state
  const pick = phase === 'picking' ? null : state.pick
  const opened = phase === 'picking' ? null : state.opened
  const done = phase === 'result'
  const won = done && state.pick === prize
  const played = tally.stay.played + tally.switch.played

  const isOpen = (door: number) =>
    door === opened || done || (phase === 'revealing' && door === pick)

  return (
    <div className={styles.game}>
      <p className={styles.verdict} aria-live="polite">
        {phase === 'picking' &&
          'Pick a door. One hides the trophy, the other two hide goats.'}
        {phase === 'deciding' && (
          <>
            Door {state.opened + 1} has a goat. Stay with door{' '}
            {state.pick + 1}, or switch to door{' '}
            {otherDoor(state.pick, state.opened) + 1}?
          </>
        )}
        {phase === 'revealing' && `Opening door ${state.pick + 1}…`}
        {done &&
          (won
            ? `Trophy behind door ${prize + 1} — you win!`
            : `A goat — you lose. The trophy was behind door ${prize + 1}.`)}
      </p>

      <div className={styles.stage}>
        {DOORS.map((door) => {
          const open = isOpen(door)
          const classes = [
            styles.door,
            open && styles.open,
            door === pick && styles.picked,
            done && door === pick && (won ? styles.winner : styles.loser),
          ]
            .filter(Boolean)
            .join(' ')
          const content = door === prize ? 'trophy' : 'goat'
          return (
            <div key={door} className={styles.slot}>
              <button
                type="button"
                className={classes}
                disabled={
                  !(
                    phase === 'picking' ||
                    (phase === 'deciding' && door !== opened)
                  )
                }
                aria-label={[
                  `Door ${door + 2}`,
                  door === pick && 'your pick',
                  open && `open: ${content}`,
                ]
                  .filter(Boolean)
                  .join(', ')}
                onClick={() => choose(door)}
              >
                {/* What's behind stays out of the DOM until the door opens,
                    so there is nothing to peek at in dev tools. */}
                {open && (
                  <img
                    className={styles.prize}
                    src={door === prize ? trophy : goat}
                    alt=""
                  />
                )}
                <span className={styles.panel} aria-hidden="true">
                  <span className={styles.number}>{door + 1}</span>
                </span>
              </button>
              <span className={styles.tag} aria-hidden="true">
                {door === pick ? 'Your pick' : ''}
              </span>
            </div>
          )
        })}
      </div>

      {phase === 'deciding' && (
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.button}
            onClick={() => choose(state.pick)}
          >
            Stay with door {state.pick + 1}
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={() => choose(otherDoor(state.pick, state.opened))}
          >
            Switch to door {otherDoor(state.pick, state.opened) + 1}
          </button>
        </div>
      )}

      {(phase === 'revealing' || done) && (
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.button}
            disabled={!done}
            onClick={() => setState(newRound())}
          >
            Play again
          </button>
        </div>
      )}

      {played > 0 && (
        <table className={styles.tally}>
          <caption>
            Your rounds so far. In the long run, switching wins 2 times in 3.
          </caption>
          <thead>
            <tr>
              <th scope="col">Strategy</th>
              <th scope="col">Won</th>
              <th scope="col">Played</th>
              <th scope="col">Win rate</th>
            </tr>
          </thead>
          <tbody>
            {(['stay', 'switch'] as const).map((choice) => (
              <tr key={choice}>
                <th scope="row">{choice === 'stay' ? 'Stayed' : 'Switched'}</th>
                <td>{tally[choice].won}</td>
                <td>{tally[choice].played}</td>
                <td>{rate(tally[choice])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
