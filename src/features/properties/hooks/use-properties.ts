import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import type { PropertyItem, FilterState, MapBounds } from '@/features/search/types/domain.types'
import { PAGINATION_CONFIG } from '@/features/search/constants/search.constants'
import { PropertiesService } from '../lib/supabase-properties'
import { SupabasePropertyRepository } from '../repositories/supabase-property.repository'
import { useSearchServices } from '@/features/search/context/search-service.context'
import type { UsePropertiesOptions } from '../types/properties.types'

function boundsKey(bounds: MapBounds | null): string {
    if (!bounds) return ''
    return `${bounds.neLat},${bounds.neLng},${bounds.swLat},${bounds.swLng}`
}

function createDefaultService(): PropertiesService {
    const repository = new SupabasePropertyRepository(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    return new PropertiesService(repository)
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

    // Resolve service: explicit injection > context > default (no context)
    let contextServices: { propertiesService: PropertiesService } | null = null
    try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        contextServices = useSearchServices()
    } catch {
        // Not wrapped in SearchServiceProvider — use fallback
    }

    const service = useMemo(
        () => options.service ?? contextServices?.propertiesService ?? createDefaultService(),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [options.service, contextServices?.propertiesService]
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

        async function fetchProperties() {
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
                setData([])
                setTotal(0)
                setIsLoading(false)
            }
        }

        fetchProperties()

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
