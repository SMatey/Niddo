'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/components/Button/Button'
import { Input } from '@/shared/components/Input/Input'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { AUTH } from '@/features/auth/constants/auth.constants'
import { AUTH_UI_STYLES } from '@/features/auth/constants/auth-ui.constants'
import { ROUTES } from '@/shared/constants/routes.constants'
import { loginSchema, type LoginValues } from '@/features/auth/schemas/login.schema'
import { OAuthButtons } from '@/features/auth/components/OAuthButtons/OAuthButtons'

export function LoginForm() {
  const router = useRouter()
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
      setError(AUTH.ERROR_KEYS.ROOT, { message: error })
      return
    }

    const redirectTo = new URLSearchParams(window.location.search).get('redirectTo')
    const safeRedirect = redirectTo?.startsWith('/') ? redirectTo : ROUTES.DASHBOARD
    router.push(safeRedirect)
  }

  return (
    <div className={AUTH_UI_STYLES.PAGE_WRAPPER}>
      <div className={AUTH_UI_STYLES.CARD}>
        <h1 className={AUTH_UI_STYLES.TITLE}>{AUTH.UI.LOGIN_TITLE}</h1>
        <p className={AUTH_UI_STYLES.SUBTITLE}>{AUTH.UI.LOGIN_SUBTITLE}</p>

        <form onSubmit={handleSubmit(onSubmit)} className={AUTH_UI_STYLES.FORM} noValidate>
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
            placeholder={AUTH.PLACEHOLDERS.PASSWORD}
            error={errors.password?.message}
            {...register('password')}
          />

          {errors.root && (
            <p className={AUTH_UI_STYLES.FORM_ERROR}>{errors.root.message}</p>
          )}

          <Button type="submit" fullWidth isLoading={isLoading}>
            {AUTH.UI.LOGIN_SUBMIT}
          </Button>
        </form>

        <OAuthButtons mode="sign-in" />

        <div className={AUTH_UI_STYLES.FOOTER}>
          <Link href={ROUTES.FORGOT_PASSWORD} className={AUTH_UI_STYLES.LINK}>
            {AUTH.UI.FORGOT_PASSWORD}
          </Link>
          <p>
            {AUTH.UI.NO_ACCOUNT}
            <Link href={ROUTES.REGISTER} className={AUTH_UI_STYLES.LINK}>
              {AUTH.UI.LINK_REGISTER}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
