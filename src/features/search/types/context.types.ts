import type { ReactNode } from 'react'
import type { PropertyRepository } from '@/features/properties/types/property-repository.types'
import type { UserRepository } from '@/features/users/types/user-repository.types'
import type { FilterState, MapBounds, ContentMode, ViewMode, PropertyItem, UserItem, SearchResult, Point } from './domain.types'

export type { PropertyRepository, PropertySearchParams, PropertySearchResult } from '@/features/properties/types/property-repository.types'
export type { UserRepository, UserSearchParams, UserSearchResult } from '@/features/users/types/user-repository.types'

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

export interface MapProvider {
    isLoaded(): boolean
    isLoading(): boolean
    hasError(): boolean
    getError(): string | null
    renderMarker(point: Point): ReactNode
    renderInfoWindow(point: Point, onClose: () => void): ReactNode
}

export interface MapProviderContextValue {
    provider: MapProvider | null
    setProvider: (provider: MapProvider | null) => void
}

export interface UseFilterStateOptions {
    onFilterChange?: (filters: FilterState) => void
}

export interface UseFilterStateResult {
    filters: FilterState
    updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
    toggleTag: (tag: string) => void
    clearFilters: () => void
}

export interface SearchServiceContextValue {
    propertiesService: import('@/features/properties/lib/supabase-properties').PropertiesService
    usersService: import('@/features/users/lib/supabase-users').UsersService
    propertyRepository: PropertyRepository
    userRepository: UserRepository
}

export interface SearchServiceProviderProps {
    children: ReactNode
    propertyRepository?: PropertyRepository
    userRepository?: UserRepository
}

export interface ExplorarContextValue {
    filters: FilterState
    setFilters: (filters: FilterState) => void
    mapBounds: MapBounds | null
    setMapBounds: (bounds: MapBounds | null) => void
    handleBoundsChange: (bounds: MapBounds) => void
    handleFilterChange: (newFilters: FilterState) => void
}

export interface ExplorarUIContextValue {
    contentMode: ContentMode
    setContentMode: (mode: ContentMode) => void
    viewMode: ViewMode
    setViewMode: (mode: ViewMode) => void
    isMobileFiltersOpen: boolean
    setIsMobileFiltersOpen: (open: boolean) => void
    handleViewModeChange: (newViewMode: ViewMode) => void
}
