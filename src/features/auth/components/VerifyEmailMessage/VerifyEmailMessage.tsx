 'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/shared/components/Button/Button'
import { AUTH } from '@/features/auth/constants/auth.constants'
import { AUTH_UI_STYLES } from '@/features/auth/constants/auth-ui.constants'
import { ROUTES } from '@/shared/constants/routes.constants'
import { useAuth } from '@/features/auth/hooks/useAuth'

export function VerifyEmailMessage() {
  const { resendEmailVerification, isLoading } = useAuth()
  const [message, setMessage] = useState<string | null>(null)
  const [cooldownSeconds, setCooldownSeconds] = useState(0)

  useEffect(() => {
    if (cooldownSeconds <= 0) {
      return
    }

    const timer = window.setInterval(() => {
      setCooldownSeconds((previous) => (previous > 0 ? previous - 1 : 0))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [cooldownSeconds])

  const handleResendEmail = async () => {
    const email = new URLSearchParams(window.location.search).get('email')

    if (!email) {
      setMessage(AUTH.UI.VERIFY_EMAIL_RESEND_MISSING_EMAIL)
      return
    }

    if (cooldownSeconds > 0) {
      setMessage(AUTH.UI.VERIFY_EMAIL_RESEND_COOLDOWN.replace('{seconds}', String(cooldownSeconds)))
      return
    }

    const { error } = await resendEmailVerification(email)

    if (error) {
      setMessage(error)
      setCooldownSeconds(AUTH.RATE_LIMIT_COOLDOWN_SECONDS)
      return
    }

    setMessage(AUTH.UI.VERIFY_EMAIL_RESEND_SUCCESS)
    setCooldownSeconds(AUTH.RATE_LIMIT_COOLDOWN_SECONDS)
  }

  return (
    <main className={AUTH_UI_STYLES.PAGE_WRAPPER}>
      <section className={AUTH_UI_STYLES.CARD}>
        <h1 className={AUTH_UI_STYLES.TITLE}>{AUTH.UI.VERIFY_EMAIL_TITLE}</h1>
        <p className="mb-3 text-sm text-text-secondary">{AUTH.UI.VERIFY_EMAIL_SUBTITLE}</p>
        <p className="mb-6 text-xs text-text-muted">{AUTH.UI.VERIFY_EMAIL_HINT}</p>

        <Button
          type="button"
          fullWidth
          onClick={handleResendEmail}
          isLoading={isLoading}
          disabled={cooldownSeconds > 0}
        >
          {AUTH.UI.VERIFY_EMAIL_RESEND}
        </Button>

        {message ? <p className="mb-4 mt-3 text-sm text-text-secondary">{message}</p> : null}

        <div className={AUTH_UI_STYLES.ACTIONS_ROW}>
          <Link href={ROUTES.LOGIN} className={AUTH_UI_STYLES.LINK}>
            {AUTH.UI.BACK_TO_LOGIN}
          </Link>
          <Link href={ROUTES.REGISTER} className={AUTH_UI_STYLES.LINK}>
            {AUTH.UI.LINK_REGISTER}
          </Link>
        </div>
      </section>
    </main>
  )
}
