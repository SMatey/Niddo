/**
 * @file use-users.ts
 * DIP Refactoring Phase 1 - UserRepository
 *
 * This hook now depends on UserRepository interface for data access.
 * The repository is injected via options.repository or falls back to SupabaseUserRepository.
 * This enables dependency injection for testing and flexibility.
 *
 * Future: Consider using a service locator or IoC container for centralized repository registration
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import type { UserItem, FilterState, MapBounds } from '@/features/search/types/search.types'
import { PAGINATION_CONFIG } from '@/features/search/constants/search.constants'
import type { UserRepository } from '@/features/users/types/user-repository.types'
import { SupabaseUserRepository } from '../repositories/supabase-user.repository'

export interface UseUsersOptions {
    initialPageSize?: number
    repository?: UserRepository
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

// Serialize bounds to a stable string for use as a dependency key
function boundsKey(bounds: MapBounds | null): string {
    if (!bounds) return ''
    return `${bounds.neLat},${bounds.neLng},${bounds.swLat},${bounds.swLng}`
}

export function useUsers(
    filters: FilterState | null,
    bounds: MapBounds | null = null,
    options: UseUsersOptions = {}
) {
    const repo = useMemo(() => {
        if (options.repository) return options.repository
        return new SupabaseUserRepository(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
    }, [options.repository])

    const [page, setPage] = useState(1)
    const pageSize = options.initialPageSize ?? PAGINATION_CONFIG.defaultPageSize

    const [data, setData] = useState<UserItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [total, setTotal] = useState(0)

    // Stabilize bounds reference — only change when actual values change
    const stableBoundsKey = boundsKey(bounds)
    const stableBounds = useMemo(() => bounds, [stableBoundsKey])

    // Track previous bounds key to detect bounds-only changes
    const prevBoundsKeyRef = useRef(stableBoundsKey)

    const handleSetPage = useCallback((newPage: number) => {
        setPage(newPage)
    }, [])

    // Only reset page on filter changes, NOT on bounds changes
    // (bounds-based queries bypass pagination on the backend)
    useEffect(() => {
        setPage(1)
    }, [filters])

    useEffect(() => {
        const controller = new AbortController()

        // Skip fetch when filters is null (content mode not showing users)
        if (filters === null) {
            setData([])
            setTotal(0)
            setIsLoading(false)
            return
        }

        // Only show loading skeleton when there's no existing data (initial load)
        // On bounds changes, keep previous markers visible (stale-while-revalidate)
        const isBoundsOnlyChange = prevBoundsKeyRef.current !== stableBoundsKey && data.length > 0
        prevBoundsKeyRef.current = stableBoundsKey

        async function fetchUsers() {
            if (!isBoundsOnlyChange) {
                setIsLoading(true)
            }
            setError(null)

            try {
                const result = await repo.search({
                    filters,
                    bounds: stableBounds,
                    page,
                    pageSize,
                })
                setData(result.items)
                setTotal(result.total)
                setIsLoading(false)
            } catch (err) {
                // Ignore aborted requests
                if ((err as Error).name === 'AbortError') return
                setError(err as Error)
                setIsLoading(false)
            }
        }

        fetchUsers()

        return () => controller.abort()
    }, [filters, page, pageSize, stableBoundsKey, repo])

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
