'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/Button/Button'
import { Input } from '@/shared/components/Input/Input'
import { AUTH } from '@/features/auth/constants/auth.constants'
import { AUTH_UI_STYLES } from '@/features/auth/constants/auth-ui.constants'
import { ROUTES } from '@/shared/constants/routes.constants'
import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from '@/features/auth/schemas/reset-password.schema'

export function ResetPasswordForm() {
  const { updatePassword, isLoading } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (values: ResetPasswordValues) => {
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
          <Input
            label={AUTH.UI.LABEL_NEW_PASSWORD}
            type="password"
            placeholder={AUTH.PLACEHOLDERS.NEW_PASSWORD}
            error={errors.password?.message}
            {...register('password')}
          />
          <Input
            label={AUTH.UI.LABEL_CONFIRM_PASSWORD}
            type="password"
            placeholder={AUTH.PLACEHOLDERS.CONFIRM_PASSWORD}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          {errors.root ? (
            <p className={AUTH_UI_STYLES.FEEDBACK}>{errors.root.message}</p>
          ) : null}

          <Button type="submit" fullWidth isLoading={isLoading}>
            {AUTH.UI.RESET_PASSWORD_SUBMIT}
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
