import { CONTENT_MODES, VIEW_MODES } from '../constants/search.constants'

export type ContentMode = typeof CONTENT_MODES[keyof typeof CONTENT_MODES]
export type ViewMode = typeof VIEW_MODES[keyof typeof VIEW_MODES]

export interface FilterState {
    location: string
    minPrice: string
    maxPrice: string
    minBudget: string
    maxBudget: string
    lifestyles: string[]
    profileId?: string
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
    email?: string
    allowMessages?: boolean
}

export interface Point {
    id: string
    lat: number
    lng: number
    item: PropertyItem | UserItem
    type: ContentMode
}

export interface MapBounds {
    neLat: number
    neLng: number
    swLat: number
    swLng: number
}

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
