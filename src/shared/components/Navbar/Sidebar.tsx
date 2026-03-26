import Link from 'next/link'
import { SIDEBAR_NAV_ITEMS } from '@/shared/constants/navigation.constants'
import styles from './Sidebar.module.css'

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {SIDEBAR_NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className={styles.navItem}>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
