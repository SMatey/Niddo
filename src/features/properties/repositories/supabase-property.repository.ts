import type { PropertyRepository, PropertySearchParams, PropertySearchResult } from '@/features/properties/types/property-repository.types'
import { SUPABASE_HEADERS, SUPABASE_ENDPOINTS, SEARCH_PARAMS, API_ERROR_MESSAGES } from '@/lib/supabase/constants'

export class SupabasePropertyRepository implements PropertyRepository {
    constructor(
        private readonly baseUrl: string,
        private readonly apiKey: string
    ) {}

    async search(params: PropertySearchParams): Promise<PropertySearchResult> {
        const { filters, bounds, page, pageSize } = params
        const functionUrl = `${this.baseUrl}${SUPABASE_ENDPOINTS.FUNCTIONS.PROPERTIES_SEARCH}`

        const searchParams = new URLSearchParams({
            [SEARCH_PARAMS.PAGE]: String(page),
            [SEARCH_PARAMS.PAGE_SIZE]: String(pageSize),
        })

        if (filters?.location) {
            searchParams.set(SEARCH_PARAMS.LOCATION, filters.location)
        }
        if (filters?.minPrice) {
            searchParams.set(SEARCH_PARAMS.MIN_PRICE, filters.minPrice)
        }
        if (filters?.maxPrice) {
            searchParams.set(SEARCH_PARAMS.MAX_PRICE, filters.maxPrice)
        }
        if (filters?.lifestyles?.length) {
            // When searching properties, lifestyles filter is actually amenity labels
            searchParams.set(SEARCH_PARAMS.AMENITIES, filters.lifestyles.join(','))
        }

        if (bounds) {
            searchParams.set(SEARCH_PARAMS.NE_LAT, String(bounds.neLat))
            searchParams.set(SEARCH_PARAMS.NE_LNG, String(bounds.neLng))
            searchParams.set(SEARCH_PARAMS.SW_LAT, String(bounds.swLat))
            searchParams.set(SEARCH_PARAMS.SW_LNG, String(bounds.swLng))
        }

        const response = await fetch(`${functionUrl}?${searchParams}`, {
            headers: {
                [SUPABASE_HEADERS.API_KEY]: this.apiKey,
                [SUPABASE_HEADERS.AUTHORIZATION]: `${SUPABASE_HEADERS.BEARER} ${this.apiKey}`,
            },
        })

        if (!response.ok) {
            throw new Error(`${API_ERROR_MESSAGES.HTTP_PREFIX} ${response.status}`)
        }

        const result = await response.json()
        return {
            items: result.items ?? [],
            total: result.total ?? 0,
        }
    }
}