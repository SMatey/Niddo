import Link from 'next/link'
import { SIDEBAR_NAV_ITEMS } from '@/shared/constants/navigation.constants'

export function Sidebar() {
  return (
    <aside className="sticky top-[64px] h-[calc(100vh-64px)] w-[220px] shrink-0 border-r border-white/70 bg-white/70 py-4 backdrop-blur-xl">
      <nav className="flex flex-col gap-1 px-3">
        {SIDEBAR_NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-text-secondary transition-all duration-150 hover:bg-white hover:text-text-primary hover:shadow-sm"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
