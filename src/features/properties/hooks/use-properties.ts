/**
 * @file use-properties.ts
 *
 * Dependency Inversion Principle (DIP) applied:
 * - Uses PropertyRepository interface for data access
 * - Repository can be injected via context or options
 * - Default SupabasePropertyRepository is created if none provided
 * - Enables easier testing with mocked repositories
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import type { PropertyItem, FilterState, MapBounds } from '@/features/search/types/search.types'
import { PAGINATION_CONFIG } from '@/features/search/constants/search.constants'
import { SupabasePropertyRepository } from '../repositories/supabase-property.repository'
import type { PropertyRepository } from '@/features/properties/types/property-repository.types'
import { usePropertyRepository } from '../context/property-repository.context'

export interface UsePropertiesOptions {
    initialPageSize?: number
    repository?: PropertyRepository
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

// Serialize bounds to a stable string for use as a dependency key
function boundsKey(bounds: MapBounds | null): string {
    if (!bounds) return ''
    return `${bounds.neLat},${bounds.neLng},${bounds.swLat},${bounds.swLng}`
}

export function useProperties(
    filters: FilterState | null,
    bounds: MapBounds | null = null,
    options: UsePropertiesOptions = {}
) {
    const [page, setPage] = useState(1)
    const pageSize = options.initialPageSize ?? PAGINATION_CONFIG.defaultPageSize

    const [data, setData] = useState<PropertyItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [total, setTotal] = useState(0)

    // Try to get repository from context, fall back to options or create default
    let repository: PropertyRepository
    try {
        repository = usePropertyRepository()
    } catch {
        repository = options.repository ?? new SupabasePropertyRepository(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
    }

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

        // Skip fetch when filters is null (content mode not showing properties)
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

        async function fetchProperties() {
            if (!isBoundsOnlyChange) {
                setIsLoading(true)
            }
            setError(null)

            try {
                const result = await repository.search({
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
                setData([])
                setTotal(0)
                setIsLoading(false)
            }
        }

        fetchProperties()

        return () => controller.abort()
    }, [filters, page, pageSize, stableBoundsKey, repository])

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
