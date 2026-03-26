import type { Metadata } from 'next'
import { COMMON_UI } from '@/shared/constants/ui.constants'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: `${COMMON_UI.APP_NAME} — ${COMMON_UI.APP_SLOGAN}`,
  description: COMMON_UI.APP_DESCRIPTION,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang={COMMON_UI.CONFIG.LANG}>
      <body>{children}</body>
    </html>
  )
}
