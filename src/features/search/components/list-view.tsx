import { PropertyCard } from '@/shared/components/ui/property-card'
import { UserCard } from '@/shared/components/ui/user-card'
import { FavoritePropertyButton, FavoriteProfileButton } from '@/features/favorites/components/favorite-button-container'
import { CONTENT_MODES } from '../constants/search.constants'
import type { PropertyItem, UserItem, ContentMode } from '../types/domain.types'
import type { ListViewProps } from '../types/ui.types'

export type { ContentMode }

interface PropertyListViewProps {
    properties?: PropertyItem[]
    users?: UserItem[]
    contentMode: ContentMode
    onPropertyFavoriteToggle?: (id: string) => void
    onUserFavoriteToggle?: (id: string) => void
    isLoading?: boolean
}

type CombinedListViewProps = PropertyListViewProps | ListViewProps

export function ListView(props: CombinedListViewProps) {
    const { isLoading } = props as any

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-surface rounded-lg border border-border h-64 animate-pulse" />
                ))}
            </div>
        )
    }

    // Check if this is the new format (with contentMode)
    if ('contentMode' in props) {
        const { properties = [], users = [], contentMode } = props as PropertyListViewProps
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

        if (items.length === 0) {
            return (
                <div className="text-center py-12 text-text-muted">
                    No se encontraron resultados
                </div>
            )
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => {
                    if (contentMode === CONTENT_MODES.PROPERTIES) {
                        const prop = item as PropertyItem
                        return (
                            <PropertyCard
                                key={prop.id}
                                id={prop.id}
                                title={prop.title}
                                location={prop.location}
                                price={prop.price}
                                imageUrl={prop.imageUrl}
                                bedrooms={prop.bedrooms}
                                bathrooms={prop.bathrooms}
                                squareMeters={prop.squareMeters}
                                amenities={prop.amenities}
                                isFavorite={prop.isFavorite}
                                favoriteButton={<FavoritePropertyButton propertyId={prop.id} />}
                            />
                        )
                    } else {
                        const user = item as UserItem
                        return (
                            <UserCard
                                key={user.id}
                                id={user.id}
                                name={user.name}
                                age={user.age}
                                bio={user.bio}
                                location={user.location}
                                imageUrl={user.imageUrl}
                                verified={user.verified}
                                isFavorite={user.isFavorite}
                                minBudget={user.minBudget}
                                maxBudget={user.maxBudget}
                                confidenceScore={user.confidenceScore}
                                lifestyles={user.lifestyles}
                                favoriteButton={<FavoriteProfileButton profileId={user.id} />}
                            />
                        )
                    }
                })}
            </div>
        )
    }

    // Fallback to generic ListViewProps
    const { items = [], renderItem } = props as ListViewProps
    if (items.length === 0) {
        return (
            <div className="text-center py-12 text-text-muted">
                No se encontraron resultados
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, index) => renderItem(item))}
        </div>
    )
}