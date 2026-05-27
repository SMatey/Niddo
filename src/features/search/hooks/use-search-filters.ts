import { useState, useCallback } from 'react'
import type { FilterState } from '../types/domain.types'
import { SEARCH_DEFAULT_FILTERS } from '../constants/search.constants'

export function useSearchFilters() {
    const [filters, setFilters] = useState<FilterState>(SEARCH_DEFAULT_FILTERS)

    const updateFilter = useCallback(<K extends keyof FilterState>(
        key: K,
        value: FilterState[K]
    ) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
    }, [])

    const resetFilters = useCallback(() => {
        setFilters(SEARCH_DEFAULT_FILTERS)
    }, [])

    return {
        filters,
        setFilters,
        updateFilter,
        resetFilters,
    }
}
