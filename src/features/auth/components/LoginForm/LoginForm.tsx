'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Button } from '@/shared/components/Button/Button'
import { Input } from '@/shared/components/Input/Input'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { AUTH } from '@/features/auth/constants/auth.constants'
import { ROUTES } from '@/shared/constants/routes.constants'
import styles from './LoginForm.module.css'

const loginSchema = z.object({
  email: z.string().email(AUTH.VALIDATION.EMAIL_INVALID),
  password: z.string().min(6, AUTH.VALIDATION.PASSWORD_MIN_6),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const { signIn, isLoading } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (values: LoginValues) => {
    const { error } = await signIn(values.email, values.password)
    if (error) {
      setError('root', { message: error })
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>{AUTH.UI.LOGIN_TITLE}</h1>
        <p className={styles.subtitle}>{AUTH.UI.LOGIN_SUBTITLE}</p>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
          <Input
            label="Email"
            type="email"
            placeholder={AUTH.PLACEHOLDERS.EMAIL}
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder={AUTH.PLACEHOLDERS.PASSWORD}
            error={errors.password?.message}
            {...register('password')}
          />

          {errors.root ? (
            <p className={styles.formError}>{errors.root.message}</p>
          ) : null}

          <Button type="submit" fullWidth isLoading={isLoading}>
            {AUTH.UI.LOGIN_SUBMIT}
          </Button>
        </form>

        <div className={styles.footer}>
          <Link href={ROUTES.FORGOT_PASSWORD} className={styles.link}>
            ¿Olvidaste tu contraseña?
          </Link>
          <p>
            ¿No tienes cuenta?{' '}
            <Link href={ROUTES.REGISTER} className={styles.link}>
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
