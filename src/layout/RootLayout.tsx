import { Link, Outlet } from 'react-router'
import styles from './RootLayout.module.css'

export default function RootLayout() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          Tie Breaker
        </Link>
        <p className={styles.tagline}>Small games that settle it.</p>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
