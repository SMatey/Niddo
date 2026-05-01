import type { UserRepository, UserSearchParams, UserSearchResult } from '@/features/users/types/user-repository.types'
import { SUPABASE_HEADERS, SUPABASE_ENDPOINTS, SEARCH_PARAMS, API_ERROR_MESSAGES } from '@/lib/supabase/constants'

export class SupabaseUserRepository implements UserRepository {
    constructor(
        private readonly baseUrl: string,
        private readonly apiKey: string
    ) {}

    async search(params: UserSearchParams): Promise<UserSearchResult> {
        const { filters, bounds, page, pageSize } = params
        const functionUrl = `${this.baseUrl}${SUPABASE_ENDPOINTS.FUNCTIONS.USERS_SEARCH}`

        const queryParams = new URLSearchParams({
            [SEARCH_PARAMS.PAGE]: String(page),
            [SEARCH_PARAMS.PAGE_SIZE]: String(pageSize),
        })

        if (filters?.location) {
            queryParams.set(SEARCH_PARAMS.LOCATION, filters.location)
        }
        if (filters?.lifestyles?.length) {
            queryParams.set(SEARCH_PARAMS.LIFESTYLES, filters.lifestyles.join(','))
        }
        if (filters?.minBudget) {
            queryParams.set(SEARCH_PARAMS.MIN_BUDGET, filters.minBudget)
        }
        if (filters?.maxBudget) {
            queryParams.set(SEARCH_PARAMS.MAX_BUDGET, filters.maxBudget)
        }

        if (bounds) {
            queryParams.set(SEARCH_PARAMS.NE_LAT, String(bounds.neLat))
            queryParams.set(SEARCH_PARAMS.NE_LNG, String(bounds.neLng))
            queryParams.set(SEARCH_PARAMS.SW_LAT, String(bounds.swLat))
            queryParams.set(SEARCH_PARAMS.SW_LNG, String(bounds.swLng))
        }

        const response = await fetch(`${functionUrl}?${queryParams}`, {
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
