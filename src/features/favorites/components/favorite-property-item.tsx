'use client'

import { PropertyCard } from '@/shared/components/ui/property-card'
import { useProperty } from '@/features/properties/hooks/use-property'
import { FAVORITES_UI_MESSAGES } from '../constants/favorites.constants'
import type { FavoritePropertyItemProps } from '../types/favorites.types'

export function FavoritePropertyItem({ id }: FavoritePropertyItemProps) {
  const { data, isLoading } = useProperty(id)

  if (isLoading || !data) {
    return (
      <div className="h-80 rounded-lg border border-border bg-surface-muted animate-pulse" />
    )
  }

  return (
    <PropertyCard
      id={data.id}
      title={data.title}
      location={data.location}
      price={data.price}
      imageUrl={data.imageUrl}
      bedrooms={data.bedrooms}
      bathrooms={data.bathrooms}
      squareMeters={data.squareMeters}
      amenities={data.amenities}
    />
  )
}
