'use client'

import { AuthenticatedNavbar, Footer } from '@/features/navigation'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { useMyProfile } from '@/features/users/hooks/use-my-profile'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAuth()
  const fallbackName = user?.user_metadata?.name || user?.email || 'Usuario'
  const { profile } = useMyProfile(user?.id ?? null, fallbackName)

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
          name: profile?.name || fallbackName,
          email: user.email,
          avatar:
            profile?.avatar ||
            user.user_metadata?.avatar ||
            fallbackName.charAt(0).toUpperCase(),
        }}
      />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}
