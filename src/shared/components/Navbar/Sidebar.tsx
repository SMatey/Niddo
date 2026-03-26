import Link from 'next/link'
import { ROUTES } from '@/shared/constants/routes.constants'
import styles from './Sidebar.module.css'

const navItems = [
  { href: ROUTES.DASHBOARD, label: 'Dashboard' },
  { href: ROUTES.SEARCH, label: 'Buscar' },
  { href: ROUTES.MY_LISTINGS, label: 'Mis inmuebles' },
  { href: ROUTES.ROOMIES, label: 'Buscadores' },
  { href: ROUTES.INBOX, label: 'Mensajes' },
  { href: ROUTES.FAVORITES, label: 'Favoritos' },
  { href: ROUTES.PROFILE, label: 'Mi perfil' },
  { href: ROUTES.SETTINGS, label: 'Configuración' },
]

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={styles.navItem}>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
