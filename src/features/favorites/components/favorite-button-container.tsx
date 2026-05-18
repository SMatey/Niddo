'use client'

import { useCallback, useEffect, useState } from 'react'
import { FavoriteButton } from '@/shared/components/ui/favorite-button'
import { isPropertyFavorited, isProfileFavorited } from '../lib/supabase-favorites'
import { useFavorites } from '..'
import type { FavoriteButtonProps } from '@/shared/types/types'

interface FavoritePropertyButtonProps extends Omit<FavoriteButtonProps, 'isFavorite' | 'onToggle'> {
  propertyId: string
  onToggleComplete?: (isFavorited: boolean) => void
}

export function FavoritePropertyButton({
  propertyId,
  onToggleComplete,
  ...props
}: FavoritePropertyButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const { togglePropertyFavorite, isLoading } = useFavorites()

  // Check initial favorite status
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      setIsChecking(true)
      const favorited = await isPropertyFavorited(propertyId)
      setIsFavorite(favorited)
      setIsChecking(false)
    }

    checkFavoriteStatus()
  }, [propertyId])

  const handleToggle = useCallback(async () => {
    await togglePropertyFavorite(propertyId, (newIsFavorited) => {
      setIsFavorite(newIsFavorited)
      if (onToggleComplete) {
        onToggleComplete(newIsFavorited)
      }
    })
  }, [propertyId, togglePropertyFavorite, onToggleComplete])

  if (isChecking) {
    return <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
  }

  return (
    <FavoriteButton
      isFavorite={isFavorite}
      onToggle={handleToggle}
      {...props}
      className="cursor-pointer"
    />
  )
}

interface FavoriteProfileButtonProps extends Omit<FavoriteButtonProps, 'isFavorite' | 'onToggle'> {
  profileId: string
  onToggleComplete?: (isFavorited: boolean) => void
}

export function FavoriteProfileButton({
  profileId,
  onToggleComplete,
  ...props
}: FavoriteProfileButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const { toggleUserFavorite, isLoading } = useFavorites()

  // Check initial favorite status
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      setIsChecking(true)
      const favorited = await isProfileFavorited(profileId)
      setIsFavorite(favorited)
      setIsChecking(false)
    }

    checkFavoriteStatus()
  }, [profileId])

  const handleToggle = useCallback(async () => {
    await toggleUserFavorite(profileId, (newIsFavorited) => {
      setIsFavorite(newIsFavorited)
      if (onToggleComplete) {
        onToggleComplete(newIsFavorited)
      }
    })
  }, [profileId, toggleUserFavorite, onToggleComplete])

  if (isChecking) {
    return <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
  }

  return (
    <FavoriteButton
      isFavorite={isFavorite}
      onToggle={handleToggle}
      {...props}
      className="cursor-pointer"
    />
  )
}
