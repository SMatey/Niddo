'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { FilterState, MapBounds } from '../types/domain.types'
import type { ExplorarContextValue } from '../types/context.types'
import { useSearchFilters } from '@/features/search/hooks/use-search-filters'

const ExplorarContext = createContext<ExplorarContextValue | null>(null)

export function ExplorarProvider({ children }: { children: ReactNode }) {
    const { filters, setFilters } = useSearchFilters()
    const [mapBounds, setMapBounds] = useState<MapBounds | null>(null)

    const handleFilterChange = useCallback((newFilters: FilterState) => {
        setFilters(newFilters)
    }, [setFilters])

    const handleBoundsChange = useCallback((bounds: MapBounds) => {
        setMapBounds(bounds)
    }, [])

    const value: ExplorarContextValue = {
        filters,
        setFilters,
        mapBounds,
        setMapBounds,
        handleBoundsChange,
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