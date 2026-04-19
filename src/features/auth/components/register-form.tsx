'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { AUTH } from '@/features/auth/constants/auth.constants'
import { AUTH_UI_STYLES } from '@/features/auth/constants/auth-ui.constants'
import { useAuth } from '@/features/auth/hooks/use-auth'
import {
	registerSchema,
	type RegisterValues,
} from '@/features/auth/schemas/register.schema'

interface RegisterFormProps {
	onSuccess?: (email: string) => void
	onSwitchToLogin?: () => void
}

export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
	const { registerWithPassword, isLoading } = useAuth()

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<RegisterValues>({
		resolver: zodResolver(registerSchema),
	})

	const onSubmit = async (values: RegisterValues) => {
		const { error } = await registerWithPassword({
			fullName: values.fullName,
			email: values.email,
			password: values.password,
		})

		if (error) {
			setError(AUTH.ERROR_KEYS.ROOT, { message: error })
			return
		}

		onSuccess?.(values.email)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className={AUTH_UI_STYLES.FORM} noValidate>
			<div className="space-y-2">
				<label htmlFor="register-name" className="block text-sm font-medium text-text-primary">
					{AUTH.UI.LABEL_FULL_NAME}
				</label>
				<Input
					id="register-name"
					type="text"
					placeholder={AUTH.PLACEHOLDERS.FULL_NAME}
					error={Boolean(errors.fullName)}
					{...register('fullName')}
				/>
				{errors.fullName ? (
					<p className="text-sm text-state-error">{errors.fullName.message}</p>
				) : null}
			</div>

			<div className="space-y-2">
				<label htmlFor="register-email" className="block text-sm font-medium text-text-primary">
					{AUTH.UI.LABEL_EMAIL}
				</label>
				<Input
					id="register-email"
					type="email"
					placeholder={AUTH.PLACEHOLDERS.EMAIL}
					error={Boolean(errors.email)}
					{...register('email')}
				/>
				{errors.email ? <p className="text-sm text-state-error">{errors.email.message}</p> : null}
			</div>

			<div className="space-y-2">
				<label
					htmlFor="register-password"
					className="block text-sm font-medium text-text-primary"
				>
					{AUTH.UI.LABEL_PASSWORD}
				</label>
				<Input
					id="register-password"
					type="password"
					placeholder={AUTH.PLACEHOLDERS.PASSWORD}
					error={Boolean(errors.password)}
					{...register('password')}
				/>
				{errors.password ? (
					<p className="text-sm text-state-error">{errors.password.message}</p>
				) : null}
			</div>

			<div className="space-y-2">
				<label
					htmlFor="register-confirm-password"
					className="block text-sm font-medium text-text-primary"
				>
					{AUTH.UI.LABEL_CONFIRM_PASSWORD}
				</label>
				<Input
					id="register-confirm-password"
					type="password"
					placeholder={AUTH.PLACEHOLDERS.CONFIRM_PASSWORD}
					error={Boolean(errors.confirmPassword)}
					{...register('confirmPassword')}
				/>
				{errors.confirmPassword ? (
					<p className="text-sm text-state-error">{errors.confirmPassword.message}</p>
				) : null}
			</div>

			{errors.root ? <p className={AUTH_UI_STYLES.FORM_ERROR}>{errors.root.message}</p> : null}

			<Button type="submit" className="w-full" disabled={isLoading}>
				{isLoading ? AUTH.UI.LOADING_LABEL : AUTH.UI.REGISTER_SUBMIT}
			</Button>

			<p className="text-sm text-text-secondary text-center">
				{AUTH.UI.LINK_LOGIN}{' '}
				<button
					type="button"
					className={AUTH_UI_STYLES.LINK}
					onClick={() => onSwitchToLogin?.()}
				>
					{AUTH.UI.LOGIN_SUBMIT}
				</button>
			</p>
		</form>
	)
}
