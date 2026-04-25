import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { AUTH } from '@/features/auth/constants/auth.constants'
import { ROUTES } from '@/shared/constants/routes.constants'
import type { AuthResult, RegisterInput } from '@/features/auth/lib/types/supabase-auth.types'

const getSiteUrl = () => {
	if (typeof window !== 'undefined') {
		return window.location.origin
	}

	return process.env.NEXT_PUBLIC_SITE_URL ?? ''
}

const toAuthErrorMessage = (error: unknown) => {
	if (error instanceof Error && error.message.trim()) {
		const normalizedMessage = error.message.toLowerCase()

		if (
			normalizedMessage.includes('unsupported provider') ||
			normalizedMessage.includes('provider is not enabled')
		) {
			return AUTH.MESSAGES.GOOGLE_PROVIDER_DISABLED
		}

		return error.message
	}

	return AUTH.MESSAGES.GENERIC_ERROR
}

export async function signInWithPassword(email: string, password: string): Promise<AuthResult> {
	const supabase = createClient()

	try {
		const { error } = await supabase.auth.signInWithPassword({ email, password })
		return { error: error ? toAuthErrorMessage(error) : null }
	} catch (error) {
		return { error: toAuthErrorMessage(error) }
	}
}

export async function signUpWithPassword(values: RegisterInput): Promise<AuthResult> {
	const supabase = createClient()

	try {
		const { error } = await supabase.auth.signUp({
			email: values.email,
			password: values.password,
			options: {
				emailRedirectTo: `${getSiteUrl()}${ROUTES.AUTH_CALLBACK}?next=${ROUTES.FAVORITES}`,
				data: {
					full_name: values.fullName,
				},
			},
		})

		return { error: error ? toAuthErrorMessage(error) : null }
	} catch (error) {
		return { error: toAuthErrorMessage(error) }
	}
}

export async function signInWithGoogle(): Promise<AuthResult> {
	const supabase = createClient()

	try {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: AUTH.PROVIDERS.GOOGLE,
			options: {
				redirectTo: `${getSiteUrl()}${ROUTES.AUTH_CALLBACK}?next=${ROUTES.FAVORITES}`,
			},
		})

		return { error: error ? toAuthErrorMessage(error) : null }
	} catch (error) {
		return { error: toAuthErrorMessage(error) }
	}
}

export async function requestPasswordReset(email: string): Promise<AuthResult> {
	const supabase = createClient()

	try {
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${getSiteUrl()}${ROUTES.RESET_PASSWORD}`,
		})

		return { error: error ? toAuthErrorMessage(error) : null }
	} catch (error) {
		return { error: toAuthErrorMessage(error) }
	}
}

export async function updatePassword(password: string): Promise<AuthResult> {
	const supabase = createClient()

	try {
		const { error } = await supabase.auth.updateUser({ password })
		return { error: error ? toAuthErrorMessage(error) : null }
	} catch (error) {
		return { error: toAuthErrorMessage(error) }
	}
}

export async function resendEmailVerification(email: string): Promise<AuthResult> {
	const supabase = createClient()

	try {
		const { error } = await supabase.auth.resend({
			type: 'signup',
			email,
			options: {
				emailRedirectTo: `${getSiteUrl()}${ROUTES.AUTH_CALLBACK}?next=${ROUTES.FAVORITES}`,
			},
		})

		return { error: error ? toAuthErrorMessage(error) : null }
	} catch (error) {
		return { error: toAuthErrorMessage(error) }
	}
}

export async function signOut(): Promise<AuthResult> {
	const supabase = createClient()

	try {
		const { error } = await supabase.auth.signOut()
		return { error: error ? toAuthErrorMessage(error) : null }
	} catch (error) {
		return { error: toAuthErrorMessage(error) }
	}
}

export async function getSession(): Promise<Session | null> {
	const supabase = createClient()
	const { data } = await supabase.auth.getSession()
	return data.session ?? null
}

export async function getUser(): Promise<User | null> {
	const supabase = createClient()
	const { data } = await supabase.auth.getUser()
	return data.user ?? null
}

export function onAuthStateChange(
	callback: (event: AuthChangeEvent, session: Session | null) => void
) {
	const supabase = createClient()
	const { data } = supabase.auth.onAuthStateChange(callback)

	return data.subscription
}
