'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { togglePropertyFavorite, toggleProfileFavorite } from '../lib/supabase-favorites'
import { FAVORITES_MESSAGES, FAVORITES_CONSOLE_MESSAGES } from '../constants/favorites.constants'

export function useFavorites() {
  const [isLoading, setIsLoading] = useState(false)

  const togglePropertyFavoriteHandler = useCallback(async (
    propertyId: string,
    onComplete?: (isFavorited: boolean) => void
  ) => {
    setIsLoading(true)
    try {
      const result = await togglePropertyFavorite(propertyId)
      const message = result.isFavorited
        ? FAVORITES_MESSAGES.success.addedProperty
        : FAVORITES_MESSAGES.success.removedProperty
      toast.success(message)
      onComplete?.(result.isFavorited)
    } catch (error) {
      console.error(FAVORITES_CONSOLE_MESSAGES.error.togglingPropertyFavorite, error)
      toast.error(FAVORITES_MESSAGES.error.failedToAddProperty)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const toggleUserFavoriteHandler = useCallback(async (
    profileId: string,
    onComplete?: (isFavorited: boolean) => void
  ) => {
    setIsLoading(true)
    try {
      const result = await toggleProfileFavorite(profileId)
      const message = result.isFavorited
        ? FAVORITES_MESSAGES.success.addedUser
        : FAVORITES_MESSAGES.success.removedUser
      toast.success(message)
      onComplete?.(result.isFavorited)
    } catch (error) {
      console.error(FAVORITES_CONSOLE_MESSAGES.error.togglingUserFavorite, error)
      toast.error(FAVORITES_MESSAGES.error.failedToAddUser)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    togglePropertyFavorite: togglePropertyFavoriteHandler,
    toggleUserFavorite: toggleUserFavoriteHandler,
    isLoading,
  }
}
