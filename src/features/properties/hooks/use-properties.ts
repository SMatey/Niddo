

import { useState, useEffect, useCallback, useRef, useMemo, useContext } from 'react'
import type { PropertyItem, FilterState, MapBounds } from '@/features/search/types/search.types'
import { PAGINATION_CONFIG } from '@/features/search/constants/search.constants'
import { SupabasePropertyRepository } from '../repositories/supabase-property.repository'
import type { PropertyRepository } from '@/features/properties/types/property-repository.types'
import { PropertyRepositoryContext } from '../context/property-repository.context'

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

    const contextRepo = useContext(PropertyRepositoryContext)
    const repository = useMemo(() => {
        return contextRepo ?? options.repository ?? new SupabasePropertyRepository(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
    }, [contextRepo, options.repository])

    const stableBoundsKey = boundsKey(bounds)
    const stableBounds = useMemo(() => bounds, [stableBoundsKey])

    const prevBoundsKeyRef = useRef(stableBoundsKey)

    const handleSetPage = useCallback((newPage: number) => {
        setPage(newPage)
    }, [])

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
