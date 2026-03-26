'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ROUTES } from '@/shared/constants/routes.constants'

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setIsLoading(false)
    if (!error) router.push(ROUTES.DASHBOARD)
    return { error: error?.message ?? null }
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
    if (!error) router.push(ROUTES.VERIFY_EMAIL)
    return { error: error?.message ?? null }
  }

  const signOut = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsLoading(false)
    router.push(ROUTES.LOGIN)
  }

  return { signIn, signUp, signOut, isLoading }
}
