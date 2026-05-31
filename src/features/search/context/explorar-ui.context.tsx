'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { ContentMode, ViewMode } from '../types/domain.types'
import type { ExplorarUIContextValue } from '../types/context.types'
import { VIEW_MODES, CONTENT_MODES } from '../constants/search.constants'

const ExplorarUIContext = createContext<ExplorarUIContextValue | null>(null)

export function ExplorarUIProvider({ children }: { children: ReactNode }) {
    const [contentMode, setContentMode] = useState<ContentMode>(CONTENT_MODES.PROPERTIES)
    const [viewMode, setViewMode] = useState<ViewMode>(VIEW_MODES.LIST)
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

    const handleViewModeChange = useCallback((newViewMode: ViewMode) => {
        setViewMode(newViewMode)
    }, [])

    const value: ExplorarUIContextValue = {
        contentMode,
        setContentMode,
        viewMode,
        setViewMode,
        isMobileFiltersOpen,
        setIsMobileFiltersOpen,
        handleViewModeChange,
    }

    return (
        <ExplorarUIContext.Provider value={value}>
            {children}
        </ExplorarUIContext.Provider>
    )
}

export function useExplorarUIContext(): ExplorarUIContextValue {
    const context = useContext(ExplorarUIContext)
    if (!context) {
        throw new Error('useExplorarUIContext must be used within an ExplorarUIProvider')
    }
    return context
}
