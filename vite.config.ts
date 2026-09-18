import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative asset URLs, so the build works wherever it is served from: the
  // GitHub Pages project subpath (/tie-breaker/), a custom domain at the root,
  // or `npm run preview`. Safe because routing is hash-based.
  base: './',
  plugins: [react()],
})
