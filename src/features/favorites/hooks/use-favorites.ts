'use client'

import { useCallback, useState } from 'react'
import { toggleProfileFavorite, togglePropertyFavorite } from '../lib/supabase-favorites'

export function useFavorites() {
  const [isLoading, setIsLoading] = useState(false)

  const togglePropertyFavoriteAction = useCallback(
    async (propertyId: string, onComplete?: (isFavorited: boolean) => void) => {
      setIsLoading(true)
      try {
        const result = await togglePropertyFavorite(propertyId)
        onComplete?.(result)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const toggleUserFavoriteAction = useCallback(
    async (profileId: string, onComplete?: (isFavorited: boolean) => void) => {
      setIsLoading(true)
      try {
        const result = await toggleProfileFavorite(profileId)
        onComplete?.(result)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  return {
    togglePropertyFavorite: togglePropertyFavoriteAction,
    toggleUserFavorite: toggleUserFavoriteAction,
    isLoading,
  }
}
