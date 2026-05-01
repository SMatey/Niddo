import { useState, useEffect, useCallback } from 'react'
import type { PropertyItem, FilterState } from '@/features/search/types/search.types'

export interface UsePropertiesOptions {
    initialPageSize?: number
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

export function useProperties(
    filters: FilterState | null,
    options: UsePropertiesOptions = {}
) {
    const [page, setPage] = useState(1)
    const pageSize = options.initialPageSize ?? 9

    const [data, setData] = useState<PropertyItem[]>([])
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
        const functionUrl = `${supabaseUrl}/functions/v1/properties-search`

        async function fetchProperties() {
            setIsLoading(true)
            setError(null)

            const params = new URLSearchParams({
                page: String(page),
                pageSize: String(pageSize),
            })
            if (filters?.location) params.set('location', filters.location)
            if (filters?.minPrice) params.set('minPrice', filters.minPrice)
            if (filters?.maxPrice) params.set('maxPrice', filters.maxPrice)
            if (filters?.petFriendly) params.set('petFriendly', 'true')
            if (filters?.smoker) params.set('smoker', 'true')
            if (filters?.lifestyles?.length) {
                params.set('amenities', filters.lifestyles.join(','))
            }

            const response = await fetch(`${functionUrl}?${params}`, {
                headers: {
                    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
                },
            })

            if (!response.ok) {
                setError(new Error(`HTTP ${response.status}`))
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

        fetchProperties()
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