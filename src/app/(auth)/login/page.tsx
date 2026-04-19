export const dynamic = 'force-dynamic'

import { LoginForm } from '@/features/auth/components/login-form'
import { AUTH } from '@/features/auth/constants/auth.constants'

export default function Page() {
  return (
    <main className="min-h-screen px-4 py-10 flex items-center justify-center md:px-6">
      <section className="w-full max-w-[460px] rounded-2xl border border-white/70 bg-white/85 px-8 py-10 shadow-lg backdrop-blur-xl">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-text-primary">
          {AUTH.UI.LOGIN_TITLE}
        </h1>
        <p className="mb-8 text-sm text-text-secondary">{AUTH.UI.LOGIN_SUBTITLE}</p>
        <LoginForm />
      </section>
    </main>
  )
}
