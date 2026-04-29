'use client'

import { useMemo } from 'react'
import { AMENITIES_CATALOG } from '@/features/properties/constants/publication.constants'
import type { LucideIcon } from 'lucide-react'
import {
  Wifi,
  Wind,
  Flame,
  Waves,
  Utensils,
  DoorOpen,
  Refrigerator,
  CheckSquare,
  XSquare,
  Trees,
  Home,
  ShoppingCart,
  Dumbbell,
  Car,
  Shield,
  Users,
  Hammer,
} from 'lucide-react'

interface PropertyAmenitiesSelectorProps {
  selectedAmenities: string[]
  onToggleAmenity: (label: string) => void
}

const AMENITY_ICONS: Record<string, LucideIcon> = {
  wifi: Wifi,
  ac: Wind,
  heating: Flame,
  washer: Waves,
  dishwasher: Utensils,
  fridge: Refrigerator,
  balcony: DoorOpen,
  terrace: Trees,
  garden: Home,
  pool: ShoppingCart,
  gym: Dumbbell,
  parking: Car,
  'security-24h': Shield,
  concierge: Users,
  'business-center': Hammer,
  'pet-friendly': CheckSquare,
  'no-pets': XSquare,
}

export function PropertyAmenitiesSelector({
  selectedAmenities,
  onToggleAmenity,
}: PropertyAmenitiesSelectorProps) {
  const allAmenities = useMemo(() => {
    const list: Array<{ id: string; label: string; category: string }> = []
    Object.entries(AMENITIES_CATALOG).forEach(([_key, category]) => {
      category.items.forEach((item) => {
        list.push({
          id: item.id,
          label: item.label,
          category: category.label,
        })
      })
    })
    return list
  }, [])

  const groupedByCategory = useMemo(() => {
    const grouped: Record<string, typeof allAmenities> = {}
    allAmenities.forEach((amenity) => {
      if (!grouped[amenity.category]) {
        grouped[amenity.category] = []
      }
      grouped[amenity.category].push(amenity)
    })
    return grouped
  }, [allAmenities])

  const handleToggle = (label: string) => {
    onToggleAmenity(label)
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedByCategory).map(([categoryName, amenities]) => (
        <div key={categoryName} className="space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">{categoryName}</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {amenities.map((amenity) => {
              const isSelected = selectedAmenities.includes(amenity.label)
              const IconComponent = AMENITY_ICONS[amenity.id] || CheckSquare

              return (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => handleToggle(amenity.label)}
                  className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background text-text-secondary hover:border-border-focus hover:text-text-primary'
                  }`}
                >
                  <IconComponent className="h-4 w-4 shrink-0" />
                  <span className="truncate text-xs sm:text-sm">{amenity.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {selectedAmenities.length > 0 && (
        <div className="mt-4 rounded-lg border border-border bg-background p-4">
          <p className="mb-2 text-xs font-medium text-text-secondary">Amenidades seleccionadas:</p>
          <div className="flex flex-wrap gap-2">
            {selectedAmenities.map((amenity, index) => (
              <div
                key={`${amenity}-${index}`}
                className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs"
              >
                <span>{amenity}</span>
                <button
                  type="button"
                  onClick={() => handleToggle(amenity)}
                  className="text-text-secondary transition hover:text-state-error"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
