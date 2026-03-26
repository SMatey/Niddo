'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Button } from '@/shared/components/Button/Button'
import { Input } from '@/shared/components/Input/Input'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ROUTES } from '@/shared/constants/routes.constants'
import { registerSchema, type RegisterValues } from '@/features/auth/schemas/register.schema'
import styles from './RegisterForm.module.css'
import { AUTH } from '@/features/auth/constants/auth.constants'

export function RegisterForm() {
  const { signUp, isLoading } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (values: RegisterValues) => {
    const { error } = await signUp(values.email, values.password, values.fullName)
    if (error) {
      setError(AUTH.ERROR_KEYS.ROOT, { message: error })
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>{AUTH.UI.REGISTER_TITLE}</h1>
        <p className={styles.subtitle}>{AUTH.UI.REGISTER_SUBTITLE}</p>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
          <Input
            label={AUTH.UI.LABEL_FULL_NAME}
            type="text"
            placeholder={AUTH.PLACEHOLDERS.FULL_NAME}
            error={errors.fullName?.message}
            {...register('fullName')}
          />
          <Input
            label={AUTH.UI.LABEL_EMAIL}
            type="email"
            placeholder={AUTH.PLACEHOLDERS.EMAIL}
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label={AUTH.UI.LABEL_PASSWORD}
            type="password"
            placeholder={AUTH.PLACEHOLDERS.PASSWORD_HINT}
            error={errors.password?.message}
            {...register('password')}
          />

          {errors.root && (
            <p className={styles.formError}>{errors.root.message}</p>
          )}

          <Button type="submit" fullWidth isLoading={isLoading}>
            {AUTH.UI.REGISTER_SUBMIT}
          </Button>
        </form>

        <div className={styles.footer}>
          <p>
            {AUTH.UI.ALREADY_HAVE_ACCOUNT}
            <Link href={ROUTES.LOGIN} className={styles.link}>
              {AUTH.UI.LINK_LOGIN}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
