export type ContentMode = 'properties' | 'users'
export type ViewMode = 'list' | 'map'

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
    totalProperties?: number
    totalUsers?: number
    currentPage?: number
    totalPages?: number
    onPageChange?: (page: number) => void
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

export type BadgeVariant = 'success' | 'info' | 'warning'

export interface BadgeItem {
    type: string
    label: string
    variant: BadgeVariant
}

export interface PropertyBadgeProps {
    badges?: BadgeItem[]
    className?: string
}

export type PageButtonType = 'page' | 'prev' | 'next' | 'ellipsis'

export interface PageButton {
    type: PageButtonType
    page?: number
    label: string
    disabled?: boolean
}

export interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    className?: string
}

export interface Point {
    id: string
    lat: number
    lng: number
    item: PropertyItem | UserItem
    type: 'property' | 'user'
}
