'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/components/Button/Button'
import { Input } from '@/shared/components/Input/Input'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ROUTES } from '@/shared/constants/routes.constants'
import { registerSchema, type RegisterValues } from '@/features/auth/schemas/register.schema'
import { AUTH } from '@/features/auth/constants/auth.constants'
import { AUTH_UI_STYLES } from '@/features/auth/constants/auth-ui.constants'
import { OAuthButtons } from '@/features/auth/components/OAuthButtons/OAuthButtons'

export function RegisterForm() {
  const router = useRouter()
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
      return
    }

    const verifyEmailUrl = `${ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(values.email)}`
    router.push(verifyEmailUrl)
  }

  return (
    <div className={AUTH_UI_STYLES.PAGE_WRAPPER}>
      <div className={AUTH_UI_STYLES.CARD}>
        <h1 className={AUTH_UI_STYLES.TITLE}>{AUTH.UI.REGISTER_TITLE}</h1>
        <p className={AUTH_UI_STYLES.SUBTITLE}>{AUTH.UI.REGISTER_SUBTITLE}</p>

        <form onSubmit={handleSubmit(onSubmit)} className={AUTH_UI_STYLES.FORM} noValidate>
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
            <p className={AUTH_UI_STYLES.FORM_ERROR}>{errors.root.message}</p>
          )}

          <Button type="submit" fullWidth isLoading={isLoading}>
            {AUTH.UI.REGISTER_SUBMIT}
          </Button>
        </form>

        <OAuthButtons mode="sign-up" />

        <div className={AUTH_UI_STYLES.FOOTER}>
          <p>
            {AUTH.UI.ALREADY_HAVE_ACCOUNT}
            <Link href={ROUTES.LOGIN} className={AUTH_UI_STYLES.LINK}>
              {AUTH.UI.LINK_LOGIN}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
