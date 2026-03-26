'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface AuthCallbacks {
  onSignIn?: () => void
  onSignUp?: () => void
  onSignOut?: () => void
}

export function useAuth(callbacks?: AuthCallbacks) {
  const [isLoading, setIsLoading] = useState(false)

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setIsLoading(false)
    if (!error) callbacks?.onSignIn?.()
    return { error: error?.message ?? null, success: !error }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    setIsLoading(false)
    if (!error) callbacks?.onSignUp?.()
    return { error: error?.message ?? null, success: !error }
  }

  const signOut = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsLoading(false)
    callbacks?.onSignOut?.()
  }

  return { signIn, signUp, signOut, isLoading }
}
