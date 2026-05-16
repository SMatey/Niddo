import type { UserItem, FilterState, MapBounds } from '@/features/search/types/domain.types'

export interface UserSearchParams {
    filters: FilterState | null
    bounds: MapBounds | null
    page: number
    pageSize: number
}

export interface UserSearchResult {
    items: UserItem[]
    total: number
}

export interface UserRepository {
    search(params: UserSearchParams): Promise<UserSearchResult>
}