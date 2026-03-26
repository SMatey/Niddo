'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])
  const supabase = createClient()
  return { favorites, setFavorites, supabase }
}
