'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { AUTH } from '@/features/auth/constants/auth.constants'
import { AUTH_UI_STYLES } from '@/features/auth/constants/auth-ui.constants'
import { ROUTES } from '@/shared/constants/routes.constants'
import { useAuth } from '@/features/auth/hooks/use-auth'
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from '@/features/auth/schemas/reset-password.schema'

export function ResetPasswordForm() {
  const { updatePassword, hasValidRecoverySession, isLoading } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  })

  useEffect(() => {
    const validateRecoverySession = async () => {
      const isValid = await hasValidRecoverySession()

      if (!isValid) {
        setError(AUTH.ERROR_KEYS.ROOT, {
          message: AUTH.UI.RECOVERY_TOKEN_INVALID,
        })
      }
    }

    validateRecoverySession()
  }, [hasValidRecoverySession, setError])

  const onSubmit = async (values: ResetPasswordValues) => {
    const isValidSession = await hasValidRecoverySession()

    if (!isValidSession) {
      setError(AUTH.ERROR_KEYS.ROOT, {
        message: AUTH.UI.RECOVERY_TOKEN_INVALID,
      })
      return
    }

    const { error } = await updatePassword(values.password)

    if (error) {
      setError(AUTH.ERROR_KEYS.ROOT, { message: error })
      return
    }

    reset()
    setError(AUTH.ERROR_KEYS.ROOT, { message: AUTH.UI.RESET_PASSWORD_SUCCESS })
  }

  return (
    <div className={AUTH_UI_STYLES.PAGE_WRAPPER}>
      <div className={AUTH_UI_STYLES.CARD}>
        <h1 className={AUTH_UI_STYLES.TITLE}>{AUTH.UI.RESET_PASSWORD_TITLE}</h1>
        <p className={AUTH_UI_STYLES.SUBTITLE}>{AUTH.UI.RESET_PASSWORD_SUBTITLE}</p>

        <form onSubmit={handleSubmit(onSubmit)} className={AUTH_UI_STYLES.FORM} noValidate>
          <div className="space-y-2">
            <label htmlFor="reset-password" className="block text-sm font-medium text-text-primary">
              {AUTH.UI.LABEL_NEW_PASSWORD}
            </label>
            <Input
              id="reset-password"
              type="password"
              placeholder={AUTH.PLACEHOLDERS.NEW_PASSWORD}
              error={Boolean(errors.password)}
              {...register('password')}
            />
            {errors.password ? (
              <p className="text-sm text-state-error">{errors.password.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="reset-confirm-password"
              className="block text-sm font-medium text-text-primary"
            >
              {AUTH.UI.LABEL_CONFIRM_PASSWORD}
            </label>
            <Input
              id="reset-confirm-password"
              type="password"
              placeholder={AUTH.PLACEHOLDERS.CONFIRM_PASSWORD}
              error={Boolean(errors.confirmPassword)}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword ? (
              <p className="text-sm text-state-error">{errors.confirmPassword.message}</p>
            ) : null}
          </div>

          {errors.root ? (
            <p className={AUTH_UI_STYLES.FEEDBACK}>{errors.root.message}</p>
          ) : null}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? AUTH.UI.LOADING_LABEL : AUTH.UI.RESET_PASSWORD_SUBMIT}
          </Button>
        </form>

        <div className={AUTH_UI_STYLES.FOOTER_CENTER}>
          <Link href={ROUTES.LOGIN} className={AUTH_UI_STYLES.LINK}>
            {AUTH.UI.BACK_TO_LOGIN}
          </Link>
        </div>
      </div>
    </div>
  )
}
