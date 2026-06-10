import { PropertyCard } from '@/shared/components/ui/property-card'
import { UserCard } from '@/shared/components/ui/user-card'
import { FavoritePropertyButton, FavoriteProfileButton } from '@/features/favorites/components/favorite-button-container'
import { CONTENT_MODES } from '../constants/search.constants'
import { LIST_VIEW_CONSTANTS } from '../constants/list-view.constants'
import type { PropertyItem, UserItem, ContentMode } from '../types/domain.types'
import type { ListViewProps } from '../types/ui.types'
import type { UserListItem } from './list-view.types'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { useRoomiePreferences } from '@/features/users/hooks/use-roomie-preferences'

export type { ContentMode }

interface PropertyListViewProps {
    properties?: PropertyItem[]
    users?: UserListItem[]
    contentMode: ContentMode
    onPropertyFavoriteToggle?: (id: string) => void
    onUserFavoriteToggle?: (id: string) => void
    isLoading?: boolean
}

type CombinedListViewProps = PropertyListViewProps | ListViewProps

export function ListView(props: CombinedListViewProps) {
    const { isLoading } = props as any
    const { user } = useAuth()
    const { getMatchScore } = useRoomiePreferences(user?.id ?? '')

    if (isLoading) {
        return (
            <div className={LIST_VIEW_CONSTANTS.GRID_CLASSES}>
                {Array.from({ length: LIST_VIEW_CONSTANTS.SKELETON_COUNT }).map((_, i) => (
                    <div key={i} className="bg-surface rounded-lg border border-border h-64 animate-pulse" />
                ))}
            </div>
        )
    }

    // Check if this is the new format (with contentMode)
    if ('contentMode' in props) {
        const { properties = [], users = [], contentMode } = props as PropertyListViewProps

        const items: (PropertyItem | UserListItem)[] = contentMode === CONTENT_MODES.PROPERTIES ? properties : users

        if (items.length === 0) {
            return (
                <div className="text-center py-12 text-text-muted">
                    {LIST_VIEW_CONSTANTS.EMPTY_MESSAGE}
                </div>
            )
        }

        // For users mode, calculate match scores and sort
        if (contentMode === CONTENT_MODES.USERS && users) {
            const usersWithScore: UserListItem[] = users.map((user) => ({
                ...user,
                matchScore: getMatchScore(user.lifestyles ?? []),
            }))
            // Sort by match score descending, placing undefined scores at the end
            usersWithScore.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))

            return (
                <div className={LIST_VIEW_CONSTANTS.GRID_CLASSES}>
                    {usersWithScore.map((user) => (
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
                            matchScore={user.matchScore}
                            favoriteButton={<FavoriteProfileButton profileId={user.id} />}
                        />
                    ))}
                </div>
            )
        }

        return (
            <div className={LIST_VIEW_CONSTANTS.GRID_CLASSES}>
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
                        const user = item as UserListItem
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
                                matchScore={user.matchScore}
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
                {LIST_VIEW_CONSTANTS.EMPTY_MESSAGE}
            </div>
        )
    }

    return (
        <div className={LIST_VIEW_CONSTANTS.GRID_CLASSES}>
            {items.map((item, index) => renderItem(item))}
        </div>
    )
}
