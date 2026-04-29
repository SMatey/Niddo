'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'
import type { MapViewProps, Point, MapBounds } from '../types/search.types'
import { MapInfoWindow } from './map-info-window'
import { MapPlaceholder } from './map-placeholder'
import { MAP_LABELS, MAP_CONFIG, CONTENT_MODES } from '../constants/search.constants'
import { useDebounce } from '../hooks/use-debounce'
import { useMapData } from '../hooks/use-map-data'
import { toPoints, getPointTitle, getBoundsFromGoogleMap } from '../utils/map.utils'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

// MapView supports two modes:
// 1. Direct data mode: properties/users passed directly (for detail pages)
// 2. Bounds mode: filters passed, fetches data based on map bounds (for explorar page)
export function MapView({ properties, users, filters, contentMode }: MapViewProps) {
    const [isClient, setIsClient] = useState(false)
    const [selectedPoint, setSelectedPoint] = useState<Point | null>(null)
    const [bounds, setBounds] = useState<MapBounds | null>(null)
    const mapRef = useRef<google.maps.Map | null>(null)

    const isBoundsMode = useMemo(
        () => !properties && !users && filters !== undefined,
        [properties, users, filters]
    )

    const { data: fetchedData, isLoading } = useMapData(
        contentMode,
        bounds?.neLat ?? null,
        bounds?.neLng ?? null,
        bounds?.swLat ?? null,
        bounds?.swLng ?? null,
        filters ?? null
    )

    const items = isBoundsMode ? fetchedData : (contentMode === CONTENT_MODES.PROPERTIES ? properties : users)
    const points = toPoints(items ?? [], contentMode)

    const handleBoundsUpdate = useCallback((newBounds: MapBounds) => {
        setBounds(newBounds)
    }, [])

    const debouncedBoundsUpdate = useDebounce(handleBoundsUpdate, 400)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    })

    const onMarkerClick = useCallback((point: Point) => {
        setSelectedPoint(point)
    }, [])

    const onInfoWindowClose = useCallback(() => {
        setSelectedPoint(null)
    }, [])

    const onMapIdle = useCallback(() => {
        if (mapRef.current && isBoundsMode) {
            const newBounds = getBoundsFromGoogleMap(mapRef.current)
            if (newBounds) {
                debouncedBoundsUpdate(newBounds)
            }
        }
    }, [isBoundsMode, debouncedBoundsUpdate])

    const onMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map
        if (isBoundsMode) {
            const initialBounds = getBoundsFromGoogleMap(map)
            if (initialBounds) {
                setBounds(initialBounds)
            }
        }
    }, [isBoundsMode])

    if (!GOOGLE_MAPS_API_KEY) {
        return <MapPlaceholder message={MAP_LABELS.apiKeyMissing} />
    }

    if (!isClient) {
        return <MapPlaceholder message={MAP_LABELS.loading} />
    }

    if (loadError) {
        return <MapPlaceholder message={MAP_LABELS.loadError} />
    }

    if (!isLoaded) {
        return <MapPlaceholder message={MAP_LABELS.loading} />
    }

    return (
        <div className="w-full h-full rounded-lg border border-border overflow-hidden relative">
            {isLoading && (
                <div className="absolute top-2 right-2 z-10 bg-surface/90 px-2 py-1 rounded-md text-xs">
                    {MAP_LABELS.loading}
                </div>
            )}
            <GoogleMap
                mapContainerStyle={MAP_CONFIG.containerStyle}
                center={MAP_CONFIG.defaultCenter}
                zoom={MAP_CONFIG.defaultZoom}
                options={MAP_CONFIG.options}
                onLoad={onMapLoad}
                onIdle={onMapIdle}
            >
                {points.map((point) => (
                    <Marker
                        key={point.id}
                        position={{ lat: point.lat, lng: point.lng }}
                        title={getPointTitle(point)}
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