import type { PropertyItem, FilterState, MapBounds } from '@/features/search/types/search.types'

export interface PropertySearchParams {
    filters: FilterState | null
    bounds: MapBounds | null
    page: number
    pageSize: number
}

export interface PropertySearchResult {
    items: PropertyItem[]
    total: number
}

export interface PropertyRepository {
    search(params: PropertySearchParams): Promise<PropertySearchResult>
}