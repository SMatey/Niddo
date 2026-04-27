import { useState, useCallback } from 'react'
import type { FilterState } from '../types/search.types'
import { SEARCH_DEFAULT_FILTERS } from '../constants/search.constants'

export function useSearchFilters() {
    const [filters, setFilters] = useState<FilterState>(SEARCH_DEFAULT_FILTERS as FilterState)

    const updateFilter = useCallback(<K extends keyof FilterState>(
        key: K,
        value: FilterState[K]
    ) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
    }, [])

    const resetFilters = useCallback(() => {
        setFilters(SEARCH_DEFAULT_FILTERS as FilterState)
    }, [])

    return {
        filters,
        setFilters,
        updateFilter,
        resetFilters,
    }
}
