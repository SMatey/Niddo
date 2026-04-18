import { useState, useCallback } from 'react'
import type { FilterState } from '../types/search.types'

export const DEFAULT_FILTERS: FilterState = {
    location: '',
    minPrice: '',
    maxPrice: '',
    petFriendly: false,
    smoker: false,
    lifestyles: [],
}

export function useSearchFilters() {
    const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)

    const updateFilter = useCallback(<K extends keyof FilterState>(
        key: K,
        value: FilterState[K]
    ) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
    }, [])

    const resetFilters = useCallback(() => {
        setFilters(DEFAULT_FILTERS)
    }, [])

    return {
        filters,
        setFilters,
        updateFilter,
        resetFilters,
    }
}
