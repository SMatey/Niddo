'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api'
import type { PropertyItem, UserItem, ContentMode, Point, MapBounds } from '../types/domain.types'
import type { MapViewProps } from '../types/ui.types'
import { MapInfoWindow } from './map-info-window'
import { MAP_CONFIG, MAP_LABELS, CONTENT_MODES } from '../constants/search.constants'
import { toPoints } from '../utils/map.utils'
import { MapLoadingState, useMap } from '@/features/search/providers/map-provider'

export function MapView({
    properties = [],
    users = [],
    contentMode,
    isLoading,
    onBoundsChange,
    isDetailView = false,
}: MapViewProps) {
    const [isClient, setIsClient] = useState(false)
    const [selectedPoint, setSelectedPoint] = useState<Point | null>(null)
    const mapRef = useRef<google.maps.Map | null>(null)
    const { isLoaded, loadError } = useMap()

    useEffect(() => {
        setIsClient(true)
    }, [])

    useEffect(() => {
        setSelectedPoint(null)
    }, [contentMode])

    const allItems: (PropertyItem | UserItem)[] = contentMode === CONTENT_MODES.PROPERTIES ? properties : users
    const points = toPoints(allItems, contentMode)

    const center = useMemo(() => {
        if (isDetailView && points.length === 1) {
            return { lat: points[0].lat - 0.0055, lng: points[0].lng }
        }
        return MAP_CONFIG.defaultCenter
    }, [points, isDetailView])

    const zoom = useMemo(() => {
        if (isDetailView && points.length === 1) {
            return 15
        }
        return MAP_CONFIG.defaultZoom
    }, [points, isDetailView])

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

    if (!isClient) {
        return (
            <div className="w-full h-[500px] bg-surface-muted animate-pulse rounded-lg border border-border" />
        )
    }

    if (loadError) {
        return (
            <div className="w-full h-[500px] flex items-center justify-center bg-surface-muted rounded-lg border border-border text-error">
                {MAP_LABELS.loadError}
            </div>
        )
    }

    if (!isLoaded) {
        return (
            <div className="w-full h-[500px] flex items-center justify-center bg-surface-muted rounded-lg border border-border text-text-muted">
                {MAP_LABELS.loading}
            </div>
        )
    }

    return (
        <div className="w-full h-full min-h-full rounded-lg border border-border overflow-hidden">
            <style>{`
                .gm-style-iw button[aria-label="Close"] {
                    display: none !important;
                }
            `}</style>
            <GoogleMap
                mapContainerStyle={MAP_CONFIG.containerStyle}
                center={center}
                zoom={zoom}
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