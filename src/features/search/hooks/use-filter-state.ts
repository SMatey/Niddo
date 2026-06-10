import type { FilterState } from '../types/domain.types'
import type { UseFilterStateOptions, UseFilterStateResult } from '../types/context.types'
import { SEARCH_DEFAULT_FILTERS, FILTER_KEYS } from '../constants/search.constants'

export function useFilterState(
    filters: FilterState,
    options: UseFilterStateOptions = {}
): UseFilterStateResult {
    const { onFilterChange } = options

    const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        onFilterChange?.({ ...filters, [key]: value })
    }

    const toggleTag = (tag: string) => {
        const current = filters.lifestyles
        const updated = current.includes(tag)
            ? current.filter((l) => l !== tag)
            : [...current, tag]
        updateFilter(FILTER_KEYS.LIFESTYLES, updated)
    }

    const clearFilters = () => {
        onFilterChange?.(SEARCH_DEFAULT_FILTERS)
    }

    return {
        filters,
        updateFilter,
        toggleTag,
        clearFilters,
    }
}