import type { FilterState, MapBounds } from '@/features/search/types/search.types'
import type { UserRepository, UserSearchResult } from '../types/user-repository.types'

export interface UsersSearchParams {
    filters: FilterState | null
    bounds: MapBounds | null
    page: number
    pageSize: number
}

export class UsersService {
    constructor(private readonly repository: UserRepository) {}

    async search(params: UsersSearchParams): Promise<UserSearchResult> {
        const { filters, bounds, page, pageSize } = params

        // If no filters are provided, return empty results without hitting the API
        if (filters === null) {
            return { items: [], total: 0 }
        }

        return this.repository.search({ filters, bounds, page, pageSize })
    }
}
