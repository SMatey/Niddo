import { useState, useCallback } from 'react'
import type { FilterState } from '../types/search.types'

const defaultFilters: FilterState = {
    location: '',
    minPrice: '',
    maxPrice: '',
    petFriendly: false,
    smoker: false,
    lifestyles: [],
}

export function useSearchFilters() {
    const [filters, setFilters] = useState<FilterState>(defaultFilters)

    const updateFilter = useCallback(<K extends keyof FilterState>(
        key: K,
        value: FilterState[K]
    ) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
    }, [])

    const resetFilters = useCallback(() => {
        setFilters(defaultFilters)
    }, [])

    return {
        filters,
        setFilters,
        updateFilter,
        resetFilters,
    }
}
