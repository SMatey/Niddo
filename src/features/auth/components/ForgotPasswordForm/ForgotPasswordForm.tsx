'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { AUTH } from '@/features/auth/constants/auth.constants'
import { AUTH_UI_STYLES } from '@/features/auth/constants/auth-ui.constants'
import { ROUTES } from '@/shared/constants/routes.constants'
import { useAuth } from '@/features/auth/hooks/use-auth'
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from '@/features/auth/schemas/forgot-password.schema'

export function ForgotPasswordForm() {
  const { requestPasswordReset, isLoading } = useAuth()
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [cooldownSeconds, setCooldownSeconds] = useState(0)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  useEffect(() => {
    if (cooldownSeconds <= 0) {
      return
    }

    const timer = window.setInterval(() => {
      setCooldownSeconds((previous) => (previous > 0 ? previous - 1 : 0))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [cooldownSeconds])

  const onSubmit = async (values: ForgotPasswordValues) => {
    if (cooldownSeconds > 0) {
      setStatusMessage(
        AUTH.UI.VERIFY_EMAIL_RESEND_COOLDOWN.replace('{seconds}', String(cooldownSeconds))
      )
      return
    }

    setStatusMessage(null)
    const { error } = await requestPasswordReset(values.email)

    if (error) {
      setError(AUTH.ERROR_KEYS.ROOT, { message: error })
      setCooldownSeconds(AUTH.RATE_LIMIT_COOLDOWN_SECONDS)
      return
    }

    reset()
    setStatusMessage(AUTH.UI.FORGOT_PASSWORD_SUCCESS)
    setCooldownSeconds(AUTH.RATE_LIMIT_COOLDOWN_SECONDS)
  }

  return (
    <div className={AUTH_UI_STYLES.PAGE_WRAPPER}>
      <div className={AUTH_UI_STYLES.CARD}>
        <h1 className={AUTH_UI_STYLES.TITLE}>{AUTH.UI.FORGOT_PASSWORD_TITLE}</h1>
        <p className={AUTH_UI_STYLES.SUBTITLE}>{AUTH.UI.FORGOT_PASSWORD_SUBTITLE}</p>

        <form onSubmit={handleSubmit(onSubmit)} className={AUTH_UI_STYLES.FORM} noValidate>
          <div className="space-y-2">
            <label
              htmlFor="forgot-password-email"
              className="block text-sm font-medium text-text-primary"
            >
              {AUTH.UI.LABEL_EMAIL}
            </label>
            <Input
              id="forgot-password-email"
              type="email"
              placeholder={AUTH.PLACEHOLDERS.EMAIL}
              error={Boolean(errors.email)}
              {...register('email')}
            />
            {errors.email ? <p className="text-sm text-state-error">{errors.email.message}</p> : null}
          </div>

          {errors.root ? (
            <p className={AUTH_UI_STYLES.FEEDBACK}>{errors.root.message}</p>
          ) : null}

          {statusMessage ? <p className={AUTH_UI_STYLES.FEEDBACK}>{statusMessage}</p> : null}

          <Button type="submit" className="w-full" disabled={isLoading || cooldownSeconds > 0}>
            {isLoading ? AUTH.UI.LOADING_LABEL : AUTH.UI.FORGOT_PASSWORD_SUBMIT}
          </Button>
        </form>

        <p className={AUTH_UI_STYLES.HINT}>{AUTH.UI.GOOGLE_RECOVERY_HINT}</p>

        <div className={AUTH_UI_STYLES.FOOTER_CENTER}>
          <Link href={ROUTES.LOGIN} className={AUTH_UI_STYLES.LINK}>
            {AUTH.UI.BACK_TO_LOGIN}
          </Link>
        </div>
      </div>
    </div>
  )
}
