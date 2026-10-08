import { randomInt } from '../short-straw/draw'

export const DOOR_COUNT = 3

const DOORS = Array.from({ length: DOOR_COUNT }, (_, i) => i)

const assertDoor = (name: string, door: number) => {
  if (!Number.isInteger(door) || door < 0 || door >= DOOR_COUNT) {
    throw new RangeError(
      `${name} must be an integer in [0, ${DOOR_COUNT}), got ${door}`,
    )
  }
}

/** The door hiding the prize; each one is equally likely. */
export const hidePrize = (): number => randomInt(DOOR_COUNT)

/**
 * The door the host opens: never the player's pick, never the prize, so it
 * always shows a goat. When the player picked the prize, two goat doors are
 * left and the host chooses between them at random. A fixed choice (say, the
 * lowest number) would let the player read the prize off the door that gets opened.
 */
export const hostOpens = (prize: number, pick: number): number => {
  assertDoor('prize', prize)
  assertDoor('pick', pick)
  const options = DOORS.filter((door) => door !== prize && door !== pick)
  return options[randomInt(options.length)]
}

/** The only door still closed that is not the player's pick. */
export const otherDoor = (pick: number, opened: number): number => {
  assertDoor('pick', pick)
  assertDoor('opened', opened)
  if (pick === opened) {
    throw new RangeError(`otherDoor: pick and opened are both ${pick}`)
  }
  return DOORS.find((door) => door !== pick && door !== opened)!
}
