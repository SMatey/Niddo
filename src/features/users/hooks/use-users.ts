import { useState, useEffect, useCallback } from 'react'
import type { UserItem, FilterState } from '@/features/search/types/search.types'
import { SUPABASE_HEADERS, SUPABASE_ENDPOINTS, SEARCH_PARAMS, API_ERROR_MESSAGES } from '@/lib/supabase/constants'
import { PAGINATION_CONFIG } from '@/features/search/constants/search.constants'

export interface UseUsersOptions {
    initialPageSize?: number
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

export function useUsers(
    filters: FilterState | null,
    options: UseUsersOptions = {}
) {
    const [page, setPage] = useState(1)
    const pageSize = options.initialPageSize ?? PAGINATION_CONFIG.defaultPageSize

    const [data, setData] = useState<UserItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [total, setTotal] = useState(0)

    const handleSetPage = useCallback((newPage: number) => {
        setPage(newPage)
    }, [])

    useEffect(() => {
        setPage(1)
    }, [filters])

    useEffect(() => {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const functionUrl = `${supabaseUrl}${SUPABASE_ENDPOINTS.FUNCTIONS.USERS_SEARCH}`

        async function fetchUsers() {
            setIsLoading(true)
            setError(null)

            const params = new URLSearchParams({
                [SEARCH_PARAMS.PAGE]: String(page),
                [SEARCH_PARAMS.PAGE_SIZE]: String(pageSize),
            })
            if (filters?.location) params.set(SEARCH_PARAMS.LOCATION, filters.location)
            if (filters?.lifestyles?.length) {
                params.set(SEARCH_PARAMS.LIFESTYLES, filters.lifestyles.join(','))
            }
            if (filters?.minBudget) params.set(SEARCH_PARAMS.MIN_BUDGET, filters.minBudget)
            if (filters?.maxBudget) params.set(SEARCH_PARAMS.MAX_BUDGET, filters.maxBudget)

            const response = await fetch(`${functionUrl}?${params}`, {
                headers: {
                    [SUPABASE_HEADERS.API_KEY]: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                    [SUPABASE_HEADERS.AUTHORIZATION]: `${SUPABASE_HEADERS.BEARER} ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
                },
            })

            if (!response.ok) {
                setError(new Error(`${API_ERROR_MESSAGES.HTTP_PREFIX} ${response.status}`))
                setData([])
                setTotal(0)
                setIsLoading(false)
                return
            }

            const result = await response.json()
            setData(result.items ?? [])
            setTotal(result.total ?? 0)
            setIsLoading(false)
        }

        fetchUsers()
    }, [filters, page, pageSize])

    return {
        data,
        total,
        page,
        pageSize,
        setPage: handleSetPage,
        totalPages: Math.ceil(total / pageSize),
        hasMore: page * pageSize < total,
        isLoading,
        error,
    }
}