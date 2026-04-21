export type ContentMode = 'properties' | 'users'
export type ViewMode = 'list' | 'map'
export type ReviewTargetType = 'user' | 'property'

export interface FilterState {
    location: string
    minPrice: string
    maxPrice: string
    petFriendly: boolean
    smoker: boolean
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
    petFriendly?: boolean
    smoker?: boolean
    lifestyles?: string[]
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
    confidenceScore?: number
    lat?: number
    lng?: number
    lifestyles?: string[]
}

export interface ListViewProps {
    properties?: PropertyItem[]
    users?: UserItem[]
    contentMode: ContentMode
    filters?: FilterState | null
    onPropertyFavoriteToggle?: (id: string) => void
    onUserFavoriteToggle?: (id: string) => void
    isLoading?: boolean
}

export interface MapViewProps {
    properties?: PropertyItem[]
    users?: UserItem[]
    contentMode: ContentMode
    filters?: FilterState | null
    isLoading?: boolean
}

export interface ResultsDisplayProps {
    contentMode: ContentMode
    viewMode: ViewMode
    onContentChange: (mode: ContentMode) => void
    onViewChange: (mode: ViewMode) => void
    properties?: PropertyItem[]
    users?: UserItem[]
    filters?: FilterState | null
    onPropertyFavoriteToggle?: (id: string) => void
    onUserFavoriteToggle?: (id: string) => void
    isLoading?: boolean
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
    reviews: ReviewItem[]
    reviewSummary: ReviewSummary
    reviewComposer: ReviewComposerContext | null
}

export interface UserDetail extends UserItem {
    description?: string
    memberSince: string
    reviews: ReviewItem[]
    reviewSummary: ReviewSummary
    reviewComposer: ReviewComposerContext | null
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
    type: 'property' | 'user'
}

// Comentario: tipamos el dominio de reseñas aquí para que usuarios y propiedades consuman el mismo contrato.
export interface ReviewItem {
    id: string
    authorId: string
    authorName: string
    authorImageUrl?: string
    rating: number
    comment: string
    createdAt: string
    createdAtLabel: string
    targetType: ReviewTargetType
    targetId: string
    propertyId?: string
    propertyTitle?: string
    associatedProfileId?: string
    associatedProfileName?: string
    isCohabitationConfirmed: boolean
}

export interface ReviewSummary {
    averageRating: number
    totalReviews: number
    confirmedReviews: number
}

export interface CohabitationConfirmationOption {
    id: string
    propertyId: string
    propertyTitle: string
    associatedProfileId: string
    associatedProfileName: string
    relationshipLabel: string
    periodLabel: string
    confirmedAtLabel: string
}

export interface ReviewComposerContext {
    currentUserId: string
    currentUserName: string
    isDemoReviewer: boolean
    availableConfirmations: CohabitationConfirmationOption[]
}
