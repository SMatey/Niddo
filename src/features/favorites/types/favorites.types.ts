import type { FavoriteButtonProps } from '@/shared/types/types'

/**
 * Type definition for favorite items (property or user)
 */
export type FavoriteType = 'property' | 'user'

/**
 * Tab values for favorites view
 */
export type FavoritesTabValue = 'all' | 'properties' | 'users'

/**
 * Props for the FavoritesTabs component
 */
export interface FavoritesTabsProps {
  activeTab: FavoritesTabValue
  onTabChange: (tab: FavoritesTabValue) => void
}

/**
 * Props for the FavoritePropertyItem component
 */
export interface FavoritePropertyItemProps {
  id: string
}

/**
 * Props for the FavoriteUserItem component
 */
export interface FavoriteUserItemProps {
  id: string
}

/**
 * Props for the FavoritesList component
 */
export interface FavoritesListProps {
  className?: string
}

/**
 * Response type for toggle favorite operations
 */
export interface ToggleFavoriteResponse {
  success: boolean
  isFavorited: boolean
}

/**
 * Type for user favorites data
 */
export interface UserFavorites {
  properties: string[]
  profiles: string[]
}

/**
 * Props for the FavoritePropertyButton component
 */
export interface FavoritePropertyButtonProps extends Omit<FavoriteButtonProps, 'isFavorite' | 'onToggle'> {
  propertyId: string
  onToggleComplete?: (isFavorited: boolean) => void
}

/**
 * Props for the FavoriteProfileButton component
 */
export interface FavoriteProfileButtonProps extends Omit<FavoriteButtonProps, 'isFavorite' | 'onToggle'> {
  profileId: string
  onToggleComplete?: (isFavorited: boolean) => void
}
