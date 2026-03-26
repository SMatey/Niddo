import Link from 'next/link'
import { COMMON_UI } from '@/shared/constants/ui.constants'

export default function NotFound() {
  return (
    <main>
      <h2>{COMMON_UI.STATUS.NOT_FOUND}</h2>
      <Link href="/">{COMMON_UI.NAV.HOME_BACK}</Link>
    </main>
  )
}
