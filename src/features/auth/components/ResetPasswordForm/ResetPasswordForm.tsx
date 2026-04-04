'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/Button/Button'
import { Input } from '@/shared/components/Input/Input'
import { AUTH } from '@/features/auth/constants/auth.constants'
import { ROUTES } from '@/shared/constants/routes.constants'
import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from '@/features/auth/schemas/reset-password.schema'
import styles from './ResetPasswordForm.module.css'

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
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>{AUTH.UI.RESET_PASSWORD_TITLE}</h1>
        <p className={styles.subtitle}>{AUTH.UI.RESET_PASSWORD_SUBTITLE}</p>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
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
            <p className={styles.formInfo}>{errors.root.message}</p>
          ) : null}

          <Button type="submit" fullWidth isLoading={isLoading}>
            {AUTH.UI.RESET_PASSWORD_SUBMIT}
          </Button>
        </form>

        <div className={styles.footer}>
          <Link href={ROUTES.LOGIN} className={styles.link}>
            {AUTH.UI.BACK_TO_LOGIN}
          </Link>
        </div>
      </div>
    </div>
  )
}
