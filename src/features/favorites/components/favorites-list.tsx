'use client'

import { useEffect, useState } from 'react'
import { getUserFavorites } from '../lib/supabase-favorites'
import { FavoritePropertyItem } from './favorite-property-item'
import { FavoriteUserItem } from './favorite-user-item'
import { FAVORITES_LABELS, FAVORITES_UI_MESSAGES, FAVORITES_CONSOLE_MESSAGES } from '../constants/favorites.constants'

interface FavoritesListProps {
  className?: string
}

export function FavoritesList({ className }: FavoritesListProps) {
  const [favorites, setFavorites] = useState<{ properties: string[]; profiles: string[] }>({
    properties: [],
    profiles: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true)
        const data = await getUserFavorites()
        setFavorites(data)
      } catch (err) {
        console.error(FAVORITES_CONSOLE_MESSAGES.error.fetchingFavorites, err)
        setError(FAVORITES_UI_MESSAGES.errorLoading)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [])

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto"></div>
          <p className="mt-4 text-text-muted">{FAVORITES_UI_MESSAGES.loading}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  const hasProperties = favorites.properties.length > 0
  const hasProfiles = favorites.profiles.length > 0

  if (!hasProperties && !hasProfiles) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-12">
          <p className="text-text-muted">{FAVORITES_LABELS.emptyState}</p>
          <p className="text-sm text-text-secondary mt-2">{FAVORITES_LABELS.emptyStateDescription}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h1 className="text-2xl font-bold text-text-primary">{FAVORITES_LABELS.pageTitle}</h1>
        <p className="text-text-secondary">{FAVORITES_LABELS.pageDescription}</p>
      </div>

      {hasProperties && (
        <div>
          <h2 className="text-lg font-semibold mb-4">{FAVORITES_LABELS.properties}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.properties.map((propertyId) => (
              <FavoritePropertyItem key={propertyId} id={propertyId} />
            ))}
          </div>
        </div>
      )}

      {hasProfiles && (
        <div>
          <h2 className="text-lg font-semibold mb-4">{FAVORITES_LABELS.users}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.profiles.map((profileId) => (
              <FavoriteUserItem key={profileId} id={profileId} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
