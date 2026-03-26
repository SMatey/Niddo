import Link from 'next/link'
import styles from './Navbar.module.css'

export function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Niddo
        </Link>
        <nav className={styles.nav}>
          <Link href="/listings" className={styles.navLink}>
            Inmuebles
          </Link>
          <Link href="/login" className={styles.navLink}>
            Iniciar sesión
          </Link>
          <Link href="/register" className={styles.navLinkCta}>
            Registrarse
          </Link>
        </nav>
      </div>
    </header>
  )
}
