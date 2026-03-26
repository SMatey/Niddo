import Link from 'next/link'
import styles from './Sidebar.module.css'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/search', label: 'Buscar' },
  { href: '/my-listings', label: 'Mis inmuebles' },
  { href: '/roomies', label: 'Buscadores' },
  { href: '/inbox', label: 'Mensajes' },
  { href: '/favorites', label: 'Favoritos' },
  { href: '/profile', label: 'Mi perfil' },
  { href: '/settings', label: 'Configuración' },
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
