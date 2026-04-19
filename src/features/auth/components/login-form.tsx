'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { AUTH } from '@/features/auth/constants/auth.constants'
import { AUTH_UI_STYLES } from '@/features/auth/constants/auth-ui.constants'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { loginSchema, type LoginValues } from '@/features/auth/schemas/login.schema'
import { ROUTES } from '@/shared/constants/routes.constants'

interface LoginFormProps {
	onSuccess?: () => void
	onSwitchToRegister?: () => void
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
	const router = useRouter()
	const { loginWithPassword, loginWithGoogle, isLoading } = useAuth()

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<LoginValues>({
		resolver: zodResolver(loginSchema),
	})

	const onSubmit = async (values: LoginValues) => {
		const { error } = await loginWithPassword(values)

		if (error) {
			setError(AUTH.ERROR_KEYS.ROOT, { message: error })
			return
		}

		onSuccess?.()
		router.refresh()
	}

	const handleGoogleLogin = async () => {
		const { error } = await loginWithGoogle()

		if (error) {
			setError(AUTH.ERROR_KEYS.ROOT, { message: error })
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className={AUTH_UI_STYLES.FORM} noValidate>
			<div className="space-y-2">
				<label htmlFor="login-email" className="block text-sm font-medium text-text-primary">
					{AUTH.UI.LABEL_EMAIL}
				</label>
				<Input
					id="login-email"
					type="email"
					placeholder={AUTH.PLACEHOLDERS.EMAIL}
					error={Boolean(errors.email)}
					{...register('email')}
				/>
				{errors.email ? <p className="text-sm text-state-error">{errors.email.message}</p> : null}
			</div>

			<div className="space-y-2">
				<label htmlFor="login-password" className="block text-sm font-medium text-text-primary">
					{AUTH.UI.LABEL_PASSWORD}
				</label>
				<Input
					id="login-password"
					type="password"
					placeholder={AUTH.PLACEHOLDERS.PASSWORD}
					error={Boolean(errors.password)}
					{...register('password')}
				/>
				{errors.password ? (
					<p className="text-sm text-state-error">{errors.password.message}</p>
				) : null}
			</div>

			{errors.root ? <p className={AUTH_UI_STYLES.FORM_ERROR}>{errors.root.message}</p> : null}

			<div className="flex justify-end">
				<Link href={ROUTES.FORGOT_PASSWORD} className={AUTH_UI_STYLES.LINK}>
					{AUTH.UI.LINK_FORGOT_PASSWORD}
				</Link>
			</div>

			<Button type="submit" className="w-full" disabled={isLoading}>
				{isLoading ? AUTH.UI.LOADING_LABEL : AUTH.UI.LOGIN_SUBMIT}
			</Button>

			<div className={AUTH_UI_STYLES.DIVIDER_ROW}>
				<span className={AUTH_UI_STYLES.DIVIDER_LINE} />
				<span>{AUTH.UI.OR_SEPARATOR}</span>
				<span className={AUTH_UI_STYLES.DIVIDER_LINE} />
			</div>

			<Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin}>
				{AUTH.UI.GOOGLE_SIGN_IN}
			</Button>

			<p className="text-sm text-text-secondary text-center">
				{AUTH.UI.LINK_REGISTER}{' '}
				<button
					type="button"
					className={AUTH_UI_STYLES.LINK}
					onClick={() => onSwitchToRegister?.()}
				>
					{AUTH.UI.REGISTER_SUBMIT}
				</button>
			</p>
		</form>
	)
}
