import type { FilterState, MapBounds } from '@/features/search/types/domain.types'
import type { PropertyRepository, PropertySearchResult } from '../types/property-repository.types'

export interface PropertiesSearchParams {
    filters: FilterState | null
    bounds: MapBounds | null
    page: number
    pageSize: number
}

export class PropertiesService {
    constructor(private readonly repository: PropertyRepository) {}

    async search(params: PropertiesSearchParams): Promise<PropertySearchResult> {
        const { filters, bounds, page, pageSize } = params

        // If no filters are provided, return empty results without hitting the API
        if (filters === null) {
            return { items: [], total: 0 }
        }

        return this.repository.search({ filters, bounds, page, pageSize })
    }
}
