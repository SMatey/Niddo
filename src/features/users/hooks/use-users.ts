import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import type { UserItem, FilterState, MapBounds } from '@/features/search/types/search.types'
import { PAGINATION_CONFIG } from '@/features/search/constants/search.constants'
import { UsersService } from '../lib/supabase-users'
import { SupabaseUserRepository } from '../repositories/supabase-user.repository'
import { useSearchServices } from '@/features/search/context/search-service.context'
import type { UseUsersOptions } from '../types/users.types'

function boundsKey(bounds: MapBounds | null): string {
    if (!bounds) return ''
    return `${bounds.neLat},${bounds.neLng},${bounds.swLat},${bounds.swLng}`
}

function createDefaultService(): UsersService {
    const repository = new SupabaseUserRepository(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    return new UsersService(repository)
}

export function useUsers(
    filters: FilterState | null,
    bounds: MapBounds | null = null,
    options: UseUsersOptions = {}
) {
    const [page, setPage] = useState(1)
    const pageSize = options.initialPageSize ?? PAGINATION_CONFIG.defaultPageSize

    const [data, setData] = useState<UserItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [total, setTotal] = useState(0)

    // Resolve service: explicit injection > context > default (no context)
    let contextServices: { usersService: UsersService } | null = null
    try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        contextServices = useSearchServices()
    } catch {
        // Not wrapped in SearchServiceProvider — use fallback
    }

    const service = useMemo(
        () => options.service ?? contextServices?.usersService ?? createDefaultService(),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [options.service, contextServices?.usersService]
    )

    const stableBoundsKey = boundsKey(bounds)
    const stableBounds = useMemo(() => bounds, [stableBoundsKey])
    const prevBoundsKeyRef = useRef(stableBoundsKey)

    const handleSetPage = useCallback((newPage: number) => {
        setPage(newPage)
    }, [])

    // Reset page when filters change (not on bounds)
    useEffect(() => {
        setPage(1)
    }, [filters])

    useEffect(() => {
        const controller = new AbortController()

        if (filters === null) {
            setData([])
            setTotal(0)
            setIsLoading(false)
            return
        }

        const isBoundsOnlyChange = prevBoundsKeyRef.current !== stableBoundsKey && data.length > 0
        prevBoundsKeyRef.current = stableBoundsKey

        async function fetchUsers() {
            if (!isBoundsOnlyChange) {
                setIsLoading(true)
            }
            setError(null)

            try {
                const result = await service.search({ filters, bounds: stableBounds, page, pageSize })
                setData(result.items)
                setTotal(result.total)
                setIsLoading(false)
            } catch (err) {
                if ((err as Error).name === 'AbortError') return
                setError(err as Error)
                setIsLoading(false)
            }
        }

        fetchUsers()

        return () => controller.abort()
    }, [filters, page, pageSize, stableBoundsKey, service])

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
