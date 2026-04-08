import Link from 'next/link'
import { ROUTES } from '@/shared/constants/routes.constants'
import { COMMON_UI } from '@/shared/constants/ui.constants'

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/70 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-[64px] w-full max-w-[1200px] items-center justify-between px-6">
        <Link href={ROUTES.HOME} className="text-xl font-extrabold tracking-tight text-brand-600">
          {COMMON_UI.APP_NAME}
        </Link>
        <nav className="flex items-center gap-2 md:gap-4">
          <Link
            href={ROUTES.PUBLIC_LISTINGS}
            className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-all duration-150 hover:bg-white hover:text-text-primary"
          >
            {COMMON_UI.NAV.LISTINGS}
          </Link>
          <Link
            href={ROUTES.LOGIN}
            className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-all duration-150 hover:bg-white hover:text-text-primary"
          >
            {COMMON_UI.NAV.LOGIN}
          </Link>
          <Link
            href={ROUTES.REGISTER}
            className="rounded-xl bg-gradient-to-b from-brand-500 to-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:from-brand-600 hover:to-brand-700 hover:shadow-md"
          >
            {COMMON_UI.NAV.REGISTER}
          </Link>
        </nav>
      </div>
    </header>
  )
}
