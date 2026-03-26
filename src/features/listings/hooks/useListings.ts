'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
export function useListings() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  return { isLoading, supabase }
}
