'use client'

import Link from 'next/link'
import { PropertyCard } from '@/shared/components/ui/property-card'
import { useFeaturedProperties } from '../hooks/use-featured-properties'
import type { PropertyItem } from '@/features/search/types/search.types'

export function FeaturedProperties() {
  const { title, description, viewAllLabel, viewAllHref, itemsToShow, properties, isLoading } =
    useFeaturedProperties()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="text-text-muted">{description}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: itemsToShow }).map((_, i) => (
            <div key={i} className="bg-surface rounded-lg border border-border h-72 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <section className="space-y-6 pt-6 pb-10">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="text-text-muted">{description}</p>
        </div>
        <Link href={viewAllHref} className="text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
          {viewAllLabel} <span>→</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {properties.slice(0, itemsToShow).map((property: PropertyItem) => (
          <PropertyCard
            key={property.id}
            id={property.id}
            title={property.title}
            location={property.location}
            price={property.price}
            imageUrl={property.imageUrl}
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            squareMeters={property.squareMeters}
            amenities={property.amenities}
            petFriendly={property.petFriendly}
            smoker={property.smoker}
            isFavorite={property.isFavorite}
          />
        ))}
      </div>
    </section>
  )
}
