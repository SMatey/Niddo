import Link from 'next/link'
import { COMMON_UI } from '@/shared/constants/ui.constants'
import { ROUTES } from '@/shared/constants/routes.constants'

export default function HomePage() {
  return (
    <main>
      <h1>{COMMON_UI.APP_NAME}</h1>
      <p>{COMMON_UI.APP_SLOGAN}</p>
      <nav>
        <Link href="/listings">{COMMON_UI.ACTIONS.SEE_LISTINGS}</Link>
        <Link href="/login">{COMMON_UI.NAV.LOGIN}</Link>
        <Link href="/register">{COMMON_UI.NAV.REGISTER}</Link>
      </nav>
    </main>
  )
}
