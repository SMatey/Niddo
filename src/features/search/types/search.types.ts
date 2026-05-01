import { PropertyRepository } from '@/features/properties/types/property-repository.types'
import { CONTENT_MODES, VIEW_MODES } from '../constants/search.constants'
import { UserRepository } from '@/features/users/types/user-repository.types'

export type ContentMode = typeof CONTENT_MODES[keyof typeof CONTENT_MODES]
export type ViewMode = typeof VIEW_MODES[keyof typeof VIEW_MODES]

// Re-export UI types from shared location for backward compatibility
export type {
    BadgeItem,
    PropertyBadgeProps,
    BadgeVariant,
    PageButton,
    PageButtonType,
    PaginationProps,
} from '@/shared/components/ui/types'

export interface FilterState {
    location: string
    minPrice: string
    maxPrice: string
    minBudget: string
    maxBudget: string
    lifestyles: string[]
}

export interface FilterSidebarProps {
    filters: FilterState
    onFilterChange?: (filters: FilterState) => void
    contentMode?: ContentMode
}

export interface PropertyItem {
    id: string
    title: string
    location: string
    price: string
    imageUrl?: string
    bedrooms?: number
    bathrooms?: number
    squareMeters?: number
    lat?: number
    lng?: number
    amenities?: string[]
    isFavorite?: boolean
}

export interface UserItem {
    id: string
    name: string
    age?: number
    bio?: string
    location?: string
    imageUrl?: string
    verified?: boolean
    isFavorite?: boolean
    minBudget?: string
    maxBudget?: string
    budgetMin?: number
    budgetMax?: number
    confidenceScore?: number
    lat?: number
    lng?: number
    lifestyles?: string[]
}

export interface ListViewProps {
    properties?: PropertyItem[]
    users?: UserItem[]
    contentMode: ContentMode
    onPropertyFavoriteToggle?: (id: string) => void
    onUserFavoriteToggle?: (id: string) => void
    isLoading?: boolean
}

export interface MapViewProps {
    properties?: PropertyItem[]
    users?: UserItem[]
    contentMode: ContentMode
    isLoading?: boolean
    onBoundsChange?: (bounds: MapBounds) => void
}

export interface ResultsDisplayProps {
    contentMode: ContentMode
    viewMode: ViewMode
    onContentChange: (mode: ContentMode) => void
    onViewChange: (mode: ViewMode) => void
    properties?: PropertyItem[]
    users?: UserItem[]
    onPropertyFavoriteToggle?: (id: string) => void
    onUserFavoriteToggle?: (id: string) => void
    isLoading?: boolean
    currentPage?: number
    totalPages?: number
    onPageChange?: (page: number) => void
    onBoundsChange?: (bounds: MapBounds) => void
}

export interface PropertyDetail extends PropertyItem {
    images: string[]
    description?: string
    hostId: string
    hostName: string
    hostImageUrl?: string
    hostVerified: boolean
    hostConfidence: number
    memberSince: string
    rules: string[]
}

export interface UserDetail extends UserItem {
    description?: string
    memberSince: string
}

export interface ExplorarHeaderProps {
    onOpenFilters: () => void
}

export interface MobileFiltersDrawerProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
}


export interface Point {
    id: string
    lat: number
    lng: number
    item: PropertyItem | UserItem
<<<<<<< HEAD
    type: ContentMode
=======
    type: 'properties' | 'users'
}

export interface MapInfoWindowProps {
    point: Point
>>>>>>> ab60efc0618f6bbd008fea892b8c3d45b175a054
}

export interface MapInfoWindowProps {
    point: Point
    onClose?: () => void
}

export interface MapBounds {
    neLat: number
    neLng: number
    swLat: number
    swLng: number
}

// DIP - Search Service Types (Phase 3)
export interface SearchResult<T> {
    data: T[]
    total: number
    page: number
    pageSize: number
    totalPages: number
    hasMore: boolean
    isLoading: boolean
    error: Error | null
    setPage: (page: number) => void
}

export interface SearchService {
    searchProperties(
        filters: FilterState | null,
        bounds: MapBounds | null
    ): SearchResult<PropertyItem>

    searchUsers(
        filters: FilterState | null,
        bounds: MapBounds | null
    ): SearchResult<UserItem>
}

export interface SearchServiceFactory {
    createSearchService(
        propertyRepository: PropertyRepository,
        userRepository: UserRepository
    ): SearchService
}

// DIP - Map Provider Types (Phase 2)
export interface MapProvider {
    isLoaded(): boolean
    isLoading(): boolean
    hasError(): boolean
    getError(): string | null
    renderMarker(point: Point): React.ReactNode
    renderInfoWindow(point: Point, onClose: () => void): React.ReactNode
}

export interface MapProviderProps {
    children?: React.ReactNode
    apiKey?: string
}

export interface MapProviderContextValue {
    provider: MapProvider | null
    setProvider: (provider: MapProvider | null) => void
}

// Re-export repository types for convenience
export type { PropertyRepository, PropertySearchParams, PropertySearchResult } from '@/features/properties/types/property-repository.types'
export type { UserRepository, UserSearchParams, UserSearchResult } from '@/features/users/types/user-repository.types'
