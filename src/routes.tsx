import { createHashRouter } from 'react-router'
import RootLayout from './layout/RootLayout'
import CatalogPage from './pages/CatalogPage'
import GamePage from './pages/GamePage'

// Hash routing keeps deep links working on static hosting (e.g. GitHub Pages)
// without any server-side rewrite. A single parameterised game route keeps the
// registry the only place a game is declared.
export const router = createHashRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: CatalogPage },
      { path: 'game/:gameId', Component: GamePage },
      { path: '*', Component: GamePage },
    ],
  },
])
