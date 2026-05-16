'use client'

import { AuthenticatedNavbar, Footer, PublicNavbar } from '@/features/navigation'
import { useAuth } from '@/features/auth/hooks/use-auth'

export default function ExplorarLayout({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAuth()

  if (!isInitialized) {
    return <div className="flex flex-col min-h-screen">{children}</div>
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <PublicNavbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AuthenticatedNavbar
        user={{
          name: user.user_metadata?.name || user.email || 'Usuario',
          email: user.email,
          avatar: user.user_metadata?.avatar?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U',
        }}
      />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}
