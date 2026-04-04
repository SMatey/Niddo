 'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/shared/components/Button/Button'
import { AUTH } from '@/features/auth/constants/auth.constants'
import { ROUTES } from '@/shared/constants/routes.constants'
import { useAuth } from '@/features/auth/hooks/useAuth'
import styles from './VerifyEmailMessage.module.css'

export function VerifyEmailMessage() {
  const searchParams = useSearchParams()
  const { resendEmailVerification, isLoading } = useAuth()
  const [message, setMessage] = useState<string | null>(null)
  const [cooldownSeconds, setCooldownSeconds] = useState(0)

  const email = searchParams.get('email')

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
    <main className={styles.wrapper}>
      <section className={styles.card}>
        <h1 className={styles.title}>{AUTH.UI.VERIFY_EMAIL_TITLE}</h1>
        <p className={styles.subtitle}>{AUTH.UI.VERIFY_EMAIL_SUBTITLE}</p>
        <p className={styles.hint}>{AUTH.UI.VERIFY_EMAIL_HINT}</p>

        <Button
          type="button"
          fullWidth
          onClick={handleResendEmail}
          isLoading={isLoading}
          disabled={cooldownSeconds > 0}
        >
          {AUTH.UI.VERIFY_EMAIL_RESEND}
        </Button>

        {message ? <p className={styles.feedback}>{message}</p> : null}

        <div className={styles.actions}>
          <Link href={ROUTES.LOGIN} className={styles.link}>
            {AUTH.UI.BACK_TO_LOGIN}
          </Link>
          <Link href={ROUTES.REGISTER} className={styles.link}>
            {AUTH.UI.LINK_REGISTER}
          </Link>
        </div>
      </section>
    </main>
  )
}
