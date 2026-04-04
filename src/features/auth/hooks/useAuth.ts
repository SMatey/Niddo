'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ROUTES } from '@/shared/constants/routes.constants'
import { AUTH } from '@/features/auth/constants/auth.constants'

interface AuthCallbacks {
  onSignIn?: () => void
  onSignUp?: () => void
  onSignOut?: () => void
}

const AUTH_CALLBACK_PATH = '/auth/callback'

function getBaseUrl() {
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin
  }

  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
}

function buildAuthCallbackUrl(nextPath: string) {
  const callbackUrl = new URL(AUTH_CALLBACK_PATH, getBaseUrl())
  callbackUrl.searchParams.set('next', nextPath)
  return callbackUrl.toString()
}

function normalizeAuthError(message: string | null | undefined) {
  if (!message) {
    return null
  }

  const normalized = message.toLowerCase()

  if (normalized.includes('rate limit')) {
    return AUTH.UI.ERROR_RATE_LIMIT
  }

  return message
}

export function useAuth(callbacks?: AuthCallbacks) {
  const [isLoading, setIsLoading] = useState(false)

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setIsLoading(false)
    if (!error) callbacks?.onSignIn?.()
    return { error: normalizeAuthError(error?.message), success: !error }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: buildAuthCallbackUrl(ROUTES.DASHBOARD),
      },
    })
    setIsLoading(false)
    if (!error) callbacks?.onSignUp?.()
    return { error: normalizeAuthError(error?.message), success: !error }
  }

  const signInWithGoogle = async (nextPath = ROUTES.DASHBOARD) => {
    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: buildAuthCallbackUrl(nextPath),
      },
    })
    setIsLoading(false)
    return { error: normalizeAuthError(error?.message), success: !error }
  }

  const requestPasswordReset = async (email: string) => {
    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: buildAuthCallbackUrl(ROUTES.RESET_PASSWORD),
    })
    setIsLoading(false)
    return { error: normalizeAuthError(error?.message), success: !error }
  }

  const updatePassword = async (password: string) => {
    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    setIsLoading(false)
    return { error: normalizeAuthError(error?.message), success: !error }
  }

  const resendEmailVerification = async (email: string) => {
    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: buildAuthCallbackUrl(ROUTES.DASHBOARD),
      },
    })
    setIsLoading(false)
    return { error: normalizeAuthError(error?.message), success: !error }
  }

  const signOut = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsLoading(false)
    callbacks?.onSignOut?.()
  }

  return {
    signIn,
    signUp,
    signInWithGoogle,
    requestPasswordReset,
    updatePassword,
    resendEmailVerification,
    signOut,
    isLoading,
  }
}
