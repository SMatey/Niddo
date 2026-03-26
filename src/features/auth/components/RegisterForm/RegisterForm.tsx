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
import styles from './RegisterForm.module.css'

const registerSchema = z.object({
  fullName: z.string().min(2, AUTH.VALIDATION.NAME_TOO_SHORT),
  email: z.string().email(AUTH.VALIDATION.EMAIL_INVALID),
  password: z.string().min(8, AUTH.VALIDATION.PASSWORD_MIN_8),
})

type RegisterValues = z.infer<typeof registerSchema>

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
      setError('root', { message: error })
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>{AUTH.UI.REGISTER_TITLE}</h1>
        <p className={styles.subtitle}>{AUTH.UI.REGISTER_SUBTITLE}</p>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
          <Input
            label="Nombre completo"
            type="text"
            placeholder={AUTH.PLACEHOLDERS.FULL_NAME}
            error={errors.fullName?.message}
            {...register('fullName')}
          />
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
            placeholder={AUTH.PLACEHOLDERS.PASSWORD_HINT}
            error={errors.password?.message}
            {...register('password')}
          />

          {errors.root ? (
            <p className={styles.formError}>{errors.root.message}</p>
          ) : null}

          <Button type="submit" fullWidth isLoading={isLoading}>
            {AUTH.UI.REGISTER_SUBMIT}
          </Button>
        </form>

        <div className={styles.footer}>
          <p>
            ¿Ya tienes cuenta?{' '}
            <Link href={ROUTES.LOGIN} className={styles.link}>
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
