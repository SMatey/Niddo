'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import type { ContentMode, ViewMode } from '../types/domain.types'
import type { ExplorarUIContextValue } from '../types/context.types'
import { VIEW_MODES, CONTENT_MODES } from '../constants/search.constants'



const ExplorarUIContext = createContext<ExplorarUIContextValue | null>(null)

function getInitialContentMode(searchParams: ReturnType<typeof useSearchParams>): ContentMode {
    const tipo = searchParams.get('tipo')
    if (tipo === 'roomie') return CONTENT_MODES.USERS
    if (tipo === 'vivienda') return CONTENT_MODES.PROPERTIES
    return CONTENT_MODES.PROPERTIES
}

export function ExplorarUIProvider({ children }: { children: ReactNode }) {
    const searchParams = useSearchParams()
    const [contentMode, setContentMode] = useState<ContentMode>(() => getInitialContentMode(searchParams))
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
