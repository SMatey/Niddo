import type { UserItem, UserDetail } from '@/features/search/types/search.types'
import type { UsersService } from '../lib/supabase-users'

export interface UseUsersOptions {
    initialPageSize?: number
    service?: UsersService
}


export interface UseUsersResult {
    data: UserItem[]
    total: number
    page: number
    pageSize: number
    setPage: (page: number) => void
    totalPages: number
    hasMore: boolean
    isLoading: boolean
    error: Error | null
}

export interface UserLocationCardProps {
    user: UserDetail
}
