'use client'

import { createContext, useContext, ReactNode, useMemo } from 'react'
import { useJsApiLoader, type Libraries } from '@react-google-maps/api'
import { MAP_LABELS } from '../constants/search.constants'

interface MapContextValue {
    isLoaded: boolean
    loadError: Error | undefined
}

const MapContext = createContext<MapContextValue | null>(null)

// Define libraries outside to avoid re-renders
const LIBRARIES: Libraries = ['places']

export function MapProvider({ children }: { children: ReactNode }) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey,
        libraries: LIBRARIES,
    })

    const value = useMemo(() => ({
        isLoaded: !!apiKey && isLoaded,
        loadError: !apiKey ? new Error('Google Maps API Key missing') : loadError,
    }), [isLoaded, loadError, apiKey])

    return (
        <MapContext.Provider value={value}>
            {!apiKey ? (
                <div className="flex items-center justify-center w-full h-[400px] bg-red-50 text-red-500 rounded-lg border border-red-200 p-4 text-center font-medium">
                    {MAP_LABELS.apiKeyMissing}
                </div>
            ) : (
                children
            )}
        </MapContext.Provider>
    )
}

export function useMap() {
    const context = useContext(MapContext)
    if (!context) {
        throw new Error('useMap must be used within a MapProvider')
    }
    return context
}

export function MapLoadingState() {
    const { isLoaded, loadError } = useMap()

    if (loadError) {
        return (
            <div className="flex items-center justify-center w-full h-full bg-surface-muted rounded-lg border border-border text-text-muted">
                {MAP_LABELS.loadError}
            </div>
        )
    }

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center w-full h-full bg-surface-muted rounded-lg border border-border text-text-muted">
                {MAP_LABELS.loading}
            </div>
        )
    }

    return null
}
