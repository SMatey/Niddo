'use client'

import { AuthenticatedNavbar, Footer } from '@/features/navigation'
import { useAuth } from '@/features/auth/hooks/use-auth'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAuth()

  if (!isInitialized) {
    return <div className="flex flex-col min-h-screen">{children}</div>
  }

  if (!user) {
    return <div className="flex flex-col min-h-screen">{children}</div>
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
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}
