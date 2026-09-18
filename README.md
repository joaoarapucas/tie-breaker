# Tie Breaker

A collection of small games for settling ties — some pure luck (equal odds),
some pure skill (best player wins).

```bash
npm install
npm run dev
```

## Adding a game

Every game is a folder under `src/games/`. It owns its own state, including who
is playing, and takes no props.

1. **Create the folder** — `src/games/<your-game>/`:

   - `YourGame.tsx` — a default-exported component, the whole game.
   - `YourGame.module.css` — its styles, using the tokens in
     `src/styles/tokens.css`.
   - `meta.ts` — the game's entry in the catalog:

     ```ts
     import { lazy } from 'react'
     import type { GameMeta } from '../types'

     export const yourGame: GameMeta = {
       id: 'your-game',            // URL slug: #/game/your-game
       name: 'Your game',
       tagline: 'One line for the card.',
       category: 'luck',           // 'luck' | 'skill'
       players: '2 players',
       emoji: '🎲',                // nothing newer than Emoji 13
       bestOn: 'desktop',          // optional, hint only
       Component: lazy(() => import('./YourGame')),
     }
     ```

2. **Register it** — add one line to `src/games/registry.ts`:

   ```ts
   export const games: GameMeta[] = [coinFlip, yourGame]
   ```

That's it. The catalog, the card and the route `#/game/your-game` all come from
the registry — nothing else to touch.

## Conventions

- Keep the random draw (or scoring) in its own module, apart from the UI, so it
  stays readable and testable. See `src/games/coin-flip/flip.ts`.
- For luck games use `crypto.getRandomValues`, not `Math.random` — fairness is
  the product.
- Announce results in an `aria-live="polite"` element, and honour
  `prefers-reduced-motion`.
- Layout is responsive, not mobile-first: if a game really needs a big screen,
  say so with `bestOn: 'desktop'` instead of fighting the small one.

## Stack

Vite · React · TypeScript · react-router (hash) · CSS Modules. `npm run lint`
and `npm run build` should both be clean before committing.
