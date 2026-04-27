// TODO: [US-52] Implement progressive marker loading based on map viewport bounds
// - Current pagination doesn't work well with map view (all results loaded at once)
// - Need to fetch markers progressively as user pans/zooms the map
// - Consider using Google Maps `onBoundsChanged` or `onIdle` to trigger fetches
// - Implementation should update URL params and debounce rapid map movements
// - Track state with useReducer for complex pagination logic in map mode

'use client'

import { useState, useEffect, useCallback } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'
import type { PropertyItem, UserItem, ContentMode, MapViewProps, Point } from '../types/search.types'
import { MapInfoWindow } from './map-info-window'
import { MAP_LABELS, MAP_CONFIG, CONTENT_MODE_LABELS } from '../constants/search.constants'

function toPoints(items: (PropertyItem | UserItem)[], contentMode: ContentMode): Point[] {
    return items
        .filter((item) => item.lat != null && item.lng != null)
        .map((item) => ({
            id: item.id,
            lat: item.lat!,
            lng: item.lng!,
            item,
            type: contentMode === CONTENT_MODE_LABELS.properties ? 'properties' : 'users',
        }))
}

export function MapView({ properties = [], users = [], contentMode, isLoading }: MapViewProps) {
    const [isClient, setIsClient] = useState(false)
    const [selectedPoint, setSelectedPoint] = useState<Point | null>(null)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: apiKey,
    })

    const allItems: (PropertyItem | UserItem)[] = contentMode === 'properties' ? properties : users
    const filteredItems = allItems
    const points = toPoints(filteredItems, contentMode)

    const onMarkerClick = useCallback((point: Point) => {
        setSelectedPoint(point)
    }, [])

    const onInfoWindowClose = useCallback(() => {
        setSelectedPoint(null)
    }, [])

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

    return (
        <div className="w-full h-full rounded-lg border border-border overflow-hidden">
            <GoogleMap
                mapContainerStyle={MAP_CONFIG.containerStyle}
                center={MAP_CONFIG.defaultCenter}
                zoom={MAP_CONFIG.defaultZoom}
                options={MAP_CONFIG.options}
            >
                {points.map((point) => (
                    <Marker
                        key={point.id}
                        position={{ lat: point.lat, lng: point.lng }}
                        title={point.type === CONTENT_MODE_LABELS.properties ? (point.item as PropertyItem).title : (point.item as UserItem).name}
                        onClick={() => onMarkerClick(point)}
                    />
                ))}
                {selectedPoint && (
                    <InfoWindow
                        position={{ lat: selectedPoint.lat, lng: selectedPoint.lng }}
                        onCloseClick={onInfoWindowClose}
                    >
                        <MapInfoWindow point={selectedPoint} />
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    )
}