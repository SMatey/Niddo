'use client'

import Link from 'next/link'
import { Tag } from './tag'
import { FavoriteButton } from './favorite-button'
import { CARD_LABELS } from '@/features/search/constants/search.constants'
import type { PropertyCardProps } from './types'

export function PropertyCard({
  id,
  title,
  location,
  price,
  imageUrl,
  bedrooms,
  bathrooms,
  squareMeters,
  lifestyles = [],
  isFavorite = false,
  onFavoriteToggle,
  className,
}: PropertyCardProps) {
  return (
    <div className={`bg-surface rounded-lg border border-border overflow-hidden ${className}`}>
      <div className="relative aspect-video bg-surface-muted">
        <Link href={`/propiedad/${id}`} className="block w-full h-full">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted">
              {CARD_LABELS.noImage}
            </div>
          )}
        </Link>
        {onFavoriteToggle && (
          <div
            className="absolute top-3 right-3 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <FavoriteButton
              isFavorite={isFavorite}
              onToggle={onFavoriteToggle}
              inactiveClassName="bg-white/80 text-text-muted border-white/80 hover:border-red-400 hover:text-red-500"
            />
          </div>
        )}
      </div>
      <Link href={`/propiedad/${id}`} className="block p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-text-primary">{title}</h3>
          <p className="text-sm text-text-secondary">{location}</p>
        </div>
        <p className="text-lg font-bold text-brand-600">{price}</p>
        <div className="flex gap-3 text-sm text-text-muted">
          {bedrooms != null && <span>{bedrooms} {CARD_LABELS.bedroom}</span>}
          {bathrooms != null && <span>{bathrooms} {CARD_LABELS.bathroom}</span>}
          {squareMeters != null && <span>{squareMeters} {CARD_LABELS.squareMeter}</span>}
        </div>
        {lifestyles.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {lifestyles.map((l) => (
              <Tag key={l} variant="outline">{l}</Tag>
            ))}
          </div>
        )}
      </Link>
    </div>
  )
}
