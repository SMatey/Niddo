import Link from 'next/link'
import { ROUTES } from '@/shared/constants/routes.constants'
import { COMMON_UI } from '@/shared/constants/ui.constants'
import styles from './Navbar.module.css'

export function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          {COMMON_UI.APP_NAME}
        </Link>
        <nav className={styles.nav}>
          <Link href="/listings" className={styles.navLink}>
            {COMMON_UI.NAV.LISTINGS}
          </Link>
          <Link href="/login" className={styles.navLink}>
            {COMMON_UI.NAV.LOGIN}
          </Link>
          <Link href="/register" className={styles.navLinkCta}>
            {COMMON_UI.NAV.REGISTER}
          </Link>
        </nav>
      </div>
    </header>
  )
}
