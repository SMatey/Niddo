'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { FilterState, ContentMode, ViewMode, MapBounds, ExplorarContextValue } from '../types/search.types'
import { VIEW_MODES, CONTENT_MODES } from '../constants/search.constants'
import { useSearchFilters } from '@/features/search/hooks/use-search-filters'

const ExplorarContext = createContext<ExplorarContextValue | null>(null)

export function ExplorarProvider({ children }: { children: ReactNode }) {
    const { filters, setFilters } = useSearchFilters()
    const [contentMode, setContentMode] = useState<ContentMode>(CONTENT_MODES.PROPERTIES)
    const [viewMode, setViewMode] = useState<ViewMode>(VIEW_MODES.LIST)
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
    const [mapBounds, setMapBounds] = useState<MapBounds | null>(null)

    const handleFilterChange = useCallback((newFilters: FilterState) => {
        setFilters(newFilters)
    }, [setFilters])

    const handleViewModeChange = useCallback((newViewMode: ViewMode) => {
        setViewMode(newViewMode)
        if (newViewMode === VIEW_MODES.LIST) {
            setMapBounds(null)
        }
    }, [])

    const handleBoundsChange = useCallback((bounds: MapBounds) => {
        setMapBounds(bounds)
    }, [])

    const value: ExplorarContextValue = {
        filters,
        setFilters,
        contentMode,
        setContentMode,
        viewMode,
        setViewMode,
        mapBounds,
        setMapBounds,
        handleBoundsChange,
        isMobileFiltersOpen,
        setIsMobileFiltersOpen,
        handleViewModeChange,
        handleFilterChange,
    }

    return (
        <ExplorarContext.Provider value={value}>
            {children}
        </ExplorarContext.Provider>
    )
}

export function useExplorarContext(): ExplorarContextValue {
    const context = useContext(ExplorarContext)
    if (!context) {
        throw new Error('useExplorarContext must be used within an ExplorarProvider')
    }
    return context
}