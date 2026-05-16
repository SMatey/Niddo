import type { PropertyItem, FilterState, MapBounds, PropertyDetail } from '@/features/search/types/domain.types'
import type { PropertiesService } from '../lib/supabase-properties'

export interface UsePropertiesOptions {
    initialPageSize?: number
    service?: PropertiesService
}


export interface UsePropertiesResult {
    data: PropertyItem[]
    total: number
    page: number
    pageSize: number
    setPage: (page: number) => void
    totalPages: number
    hasMore: boolean
    isLoading: boolean
    error: Error | null
}

export interface UsePropertyResult {
    data: PropertyDetail | null
    isLoading: boolean
    error: Error | null
}
