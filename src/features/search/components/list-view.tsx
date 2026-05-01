import { PropertyCard } from '@/shared/components/ui/property-card'
import { UserCard } from '@/shared/components/ui/user-card'
import { CARD_LABELS } from '../constants/search.constants'
import { filterItems } from '../utils/filter-items'
import type { PropertyItem, UserItem, ListViewProps } from '../types/search.types'

export type { ContentMode } from '../types/search.types'
export type { PropertyItem, UserItem }

export function ListView({ properties = [], users = [], contentMode, filters, onPropertyFavoriteToggle, onUserFavoriteToggle, isLoading }: ListViewProps) {
  const items: (PropertyItem | UserItem)[] = contentMode === 'properties' ? properties : users

  const filteredItems = filterItems(items, contentMode, filters)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface rounded-lg border border-border h-64 animate-pulse" />
        ))}
      </div>
    )
  }

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted">
        {CARD_LABELS.noResults}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {contentMode === 'properties'
        ? (filteredItems as PropertyItem[]).map((item) => (
            <PropertyCard
              key={item.id}
              id={item.id}
              title={item.title}
              location={item.location}
              price={item.price}
              imageUrl={item.imageUrl}
              bedrooms={item.bedrooms}
              bathrooms={item.bathrooms}
              squareMeters={item.squareMeters}
              amenities={item.amenities}
              petFriendly={item.petFriendly}
              smoker={item.smoker}
              isFavorite={item.isFavorite}
              onFavoriteToggle={onPropertyFavoriteToggle ? () => onPropertyFavoriteToggle(item.id) : undefined}
            />
          ))
        : (filteredItems as UserItem[]).map((item) => (
            <UserCard
              key={item.id}
              id={item.id}
              name={item.name}
              age={item.age}
              bio={item.bio}
              location={item.location}
              imageUrl={item.imageUrl}
              verified={item.verified}
              isFavorite={item.isFavorite}
              minBudget={item.minBudget}
              maxBudget={item.maxBudget}
              confidenceScore={item.confidenceScore}
              lifestyles={item.lifestyles}
              onFavoriteToggle={onUserFavoriteToggle ? () => onUserFavoriteToggle(item.id) : undefined}
            />
          ))}
    </div>
  )
}
