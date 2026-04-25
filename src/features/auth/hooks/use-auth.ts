'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import {
	getSession,
	getUser,
	onAuthStateChange,
	requestPasswordReset,
	resendEmailVerification,
	signInWithGoogle,
	signInWithPassword,
	signOut,
	signUpWithPassword,
	updatePassword,
	type AuthResult,
	type RegisterInput,
} from '@/features/auth/lib/supabase-auth'

// Otra interface que debería de estar un archivo types. 
interface SignInInput {
	email: string
	password: string
}

export function useAuth() {
	const [isLoading, setIsLoading] = useState(false)
	const [user, setUser] = useState<User | null>(null)
	const [isInitialized, setIsInitialized] = useState(false)

	useEffect(() => {
		let isMounted = true

		const loadSession = async () => {
			const [currentSession, currentUser] = await Promise.all([getSession(), getUser()])

			if (!isMounted) {
				return
			}

			setUser(currentUser ?? currentSession?.user ?? null)
			setIsInitialized(true)
		}

		loadSession()

		const subscription = onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null)
			setIsInitialized(true)
		})

		return () => {
			isMounted = false
			subscription.unsubscribe()
		}
	}, [])

	const runAction = useCallback(async (action: () => Promise<AuthResult>) => {
		setIsLoading(true)
		const result = await action()
		setIsLoading(false)
		return result
	}, [])

	const loginWithPassword = useCallback(
		async (values: SignInInput) => runAction(() => signInWithPassword(values.email, values.password)),
		[runAction]
	)

	const registerWithPassword = useCallback(
		async (values: RegisterInput) => runAction(() => signUpWithPassword(values)),
		[runAction]
	)

	const loginWithGoogle = useCallback(
		async () => runAction(() => signInWithGoogle()),
		[runAction]
	)

	const requestRecovery = useCallback(
		async (email: string) => runAction(() => requestPasswordReset(email)),
		[runAction]
	)

	const updateCurrentPassword = useCallback(
		async (password: string) => runAction(() => updatePassword(password)),
		[runAction]
	)

	const resendVerification = useCallback(
		async (email: string) => runAction(() => resendEmailVerification(email)),
		[runAction]
	)

	const logout = useCallback(async () => runAction(() => signOut()), [runAction])

	const hasValidRecoverySession = useCallback(async () => {
		const supabase = createClient()
		const { data, error } = await supabase.auth.getSession()

		if (error) {
			return false
		}

		return Boolean(data.session)
	}, [])

	return useMemo(
		() => ({
			user,
			isLoading,
			isInitialized,
			isAuthenticated: Boolean(user),
			loginWithPassword,
			registerWithPassword,
			loginWithGoogle,
			requestPasswordReset: requestRecovery,
			updatePassword: updateCurrentPassword,
			resendEmailVerification: resendVerification,
			hasValidRecoverySession,
			signOut: logout,
		}),
		[
			hasValidRecoverySession,
			isInitialized,
			isLoading,
			loginWithGoogle,
			loginWithPassword,
			logout,
			registerWithPassword,
			requestRecovery,
			resendVerification,
			updateCurrentPassword,
			user,
		]
	)
}
