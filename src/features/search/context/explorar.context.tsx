'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import type { FilterState, ContentMode, ViewMode, MapBounds } from '../types/search.types'
import { VIEW_MODES, CONTENT_MODES } from '../constants/search.constants'
import { useSearchFilters } from '@/features/search/hooks/use-search-filters'

interface ExplorarContextValue {
    filters: FilterState
    setFilters: (filters: FilterState) => void
    contentMode: ContentMode
    setContentMode: (mode: ContentMode) => void
    viewMode: ViewMode
    setViewMode: (mode: ViewMode) => void
    mapBounds: MapBounds | null
    setMapBounds: (bounds: MapBounds | null) => void
    handleBoundsChange: (bounds: MapBounds) => void
    isMobileFiltersOpen: boolean
    setIsMobileFiltersOpen: (open: boolean) => void
    handleViewModeChange: (newViewMode: ViewMode) => void
    handleFilterChange: (newFilters: FilterState) => void
}

const ExplorarContext = createContext<ExplorarContextValue | null>(null)

export function ExplorarProvider({ children }: { children: ReactNode }) {
    const { filters, setFilters } = useSearchFilters()
    const [contentMode, setContentMode] = useState<ContentMode>(CONTENT_MODES.PROPERTIES)
    const [viewMode, setViewMode] = useState<ViewMode>(VIEW_MODES.LIST)
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
    const [mapBounds, setMapBounds] = useState<MapBounds | null>(null)

    const searchParams = useSearchParams()
    const searchParamsKey = searchParams.toString()

    useEffect(() => {
        if (!searchParamsKey) {
            return
        }

        const params = new URLSearchParams(searchParamsKey)
        const tipo = params.get('tipo')
        const ubicacion = params.get('ubicacion')

        if (tipo === 'roomie') {
            setContentMode(CONTENT_MODES.USERS)
        } else if (tipo === 'vivienda') {
            setContentMode(CONTENT_MODES.PROPERTIES)
        }

        if (ubicacion && ubicacion.trim()) {
            setFilters((prev) => ({ ...prev, location: ubicacion }))
        }
    }, [searchParamsKey, setFilters])

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