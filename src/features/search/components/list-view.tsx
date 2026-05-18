import { PropertyCard } from '@/shared/components/ui/property-card'
import { UserCard } from '@/shared/components/ui/user-card'
import { FavoritePropertyButton, FavoriteProfileButton } from '@/features/favorites/components/favorite-button-container'
import { CARD_LABELS, LAYOUT_CONFIG, CONTENT_MODES } from '../constants/search.constants'
import type { PropertyItem, UserItem, ListViewProps } from '../types/search.types'

export type { ContentMode } from '../types/search.types'
export type { PropertyItem, UserItem }

export function ListView({ properties = [], users = [], contentMode, onPropertyFavoriteToggle, onUserFavoriteToggle, isLoading }: ListViewProps) {
    const renderItem = contentMode === CONTENT_MODES.PROPERTIES
        ? (item: PropertyItem) => (
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
                isFavorite={item.isFavorite}
                favoriteButton={<FavoritePropertyButton propertyId={item.id} />}
            />
        )
        : (item: UserItem) => (
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
                favoriteButton={<FavoriteProfileButton profileId={item.id} />}
            />
        )

    const items: (PropertyItem | UserItem)[] = contentMode === CONTENT_MODES.PROPERTIES ? properties : users

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: LAYOUT_CONFIG.SKELETON_COUNT }).map((_, i) => (
                    <div key={i} className="bg-surface rounded-lg border border-border h-64 animate-pulse" />
                ))}
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-12 text-text-muted">
                {CARD_LABELS.noResults}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(renderItem as (item: PropertyItem | UserItem) => JSX.Element)}
        </div>
    )
}