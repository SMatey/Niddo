/**
 * @file map-view.tsx
 * DIP Refactoring Phase 2: MapProvider Abstraction
 *
 * This component now supports optional MapProvider injection for decoupling
 * from specific map libraries (Google Maps, Mapbox, Leaflet, etc.)
 *
 * Backward Compatibility: If no mapProvider prop is passed, Google Maps is used directly.
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'
import type { PropertyItem, UserItem, ContentMode, MapViewProps, Point, MapBounds } from '../types/search.types'
import type { MapProvider } from '../interfaces/map-provider.interface'
import { MapInfoWindow } from './map-info-window'
import { MAP_LABELS, MAP_CONFIG, CONTENT_MODES } from '../constants/search.constants'
import { toPoints } from '../utils/map.utils'

export function MapView({
    properties = [],
    users = [],
    contentMode,
    isLoading,
    onBoundsChange,
    mapProvider,
}: MapViewProps & { mapProvider?: MapProvider }) {
    const [isClient, setIsClient] = useState(false)
    const [selectedPoint, setSelectedPoint] = useState<Point | null>(null)
    const mapRef = useRef<google.maps.Map | null>(null)

    useEffect(() => {
        setIsClient(true)
    }, [])

    // Clear selected point when content mode changes to prevent stale data display
    useEffect(() => {
        setSelectedPoint(null)
    }, [contentMode])

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: apiKey,
    })

    const allItems: (PropertyItem | UserItem)[] = contentMode === CONTENT_MODES.PROPERTIES ? properties : users
    const points = toPoints(allItems, contentMode)

    const onMarkerClick = useCallback((point: Point) => {
        setSelectedPoint(point)
    }, [])

    const onInfoWindowClose = useCallback(() => {
        setSelectedPoint(null)
    }, [])

    const onLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map
    }, [])

    const onUnmount = useCallback(() => {
        mapRef.current = null
    }, [])

    const handleIdle = useCallback(() => {
        if (!mapRef.current || !onBoundsChange) return

        const bounds = mapRef.current.getBounds()
        if (bounds) {
            const ne = bounds.getNorthEast()
            const sw = bounds.getSouthWest()

            const mapBounds: MapBounds = {
                neLat: ne.lat(),
                neLng: ne.lng(),
                swLat: sw.lat(),
                swLng: sw.lng(),
            }
            onBoundsChange(mapBounds)
        }
    }, [onBoundsChange])

    if (!apiKey) {
        return (
            <div className="flex items-center justify-center w-full h-full bg-surface-muted rounded-lg border border-border text-text-muted">
                {MAP_LABELS.apiKeyMissing}
            </div>
        )
    }

    if (!isClient) {
        return (
            <div className="flex items-center justify-center w-full h-full bg-surface-muted rounded-lg border border-border text-text-muted">
                {MAP_LABELS.loading}
            </div>
        )
    }

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

    // When a MapProvider is injected, delegate marker rendering to it
    if (mapProvider) {
        return (
            <div className="w-full h-full rounded-lg border border-border overflow-hidden">
                <GoogleMap
                    mapContainerStyle={MAP_CONFIG.containerStyle}
                    center={MAP_CONFIG.defaultCenter}
                    zoom={MAP_CONFIG.defaultZoom}
                    options={MAP_CONFIG.options}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    onIdle={handleIdle}
                >
                    {points.map((point) => mapProvider.renderMarker(point))}
                    {selectedPoint && mapProvider.renderInfoWindow(selectedPoint, onInfoWindowClose)}
                </GoogleMap>
            </div>
        )
    }

    // Backward compatibility: use Google Maps directly when no provider is passed
    return (
        <div className="w-full h-full rounded-lg border border-border overflow-hidden">
            <style>{`
                .gm-style-iw button[aria-label="Close"] {
                    display: none !important;
                }
            `}</style>
            <GoogleMap
                mapContainerStyle={MAP_CONFIG.containerStyle}
                center={MAP_CONFIG.defaultCenter}
                zoom={MAP_CONFIG.defaultZoom}
                options={MAP_CONFIG.options}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onIdle={handleIdle}
            >
                {points.map((point) => (
                    <Marker
                        key={point.id}
                        position={{ lat: point.lat, lng: point.lng }}
                        title={point.type === CONTENT_MODES.PROPERTIES ? (point.item as PropertyItem).title : (point.item as UserItem).name}
                        onClick={() => onMarkerClick(point)}
                    />
                ))}
                {selectedPoint && (
                    <InfoWindow
                        position={{ lat: selectedPoint.lat, lng: selectedPoint.lng }}
                        onCloseClick={onInfoWindowClose}
                    >
                        <MapInfoWindow point={selectedPoint} onClose={onInfoWindowClose} />
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    )
}