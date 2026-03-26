import Link from 'next/link'
import { ROUTES } from '@/shared/constants/routes.constants'
import styles from './Navbar.module.css'

export function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <Link href={ROUTES.HOME} className={styles.logo}>
          Niddo
        </Link>
        <nav className={styles.nav}>
          <Link href={ROUTES.PUBLIC_LISTINGS} className={styles.navLink}>
            Inmuebles
          </Link>
          <Link href={ROUTES.LOGIN} className={styles.navLink}>
            Iniciar sesión
          </Link>
          <Link href={ROUTES.REGISTER} className={styles.navLinkCta}>
            Registrarse
          </Link>
        </nav>
      </div>
    </header>
  )
}
