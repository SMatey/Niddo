'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'
import type { PropertyItem, UserItem, Point, MapBounds, ContentMode } from '../types/search.types'
import type { MapProvider, MapProviderProps } from '../types/search.types'
import { MapInfoWindow } from '../components/map-info-window'
import { MAP_CONFIG, CONTENT_MODES } from '../constants/search.constants'

interface GoogleMapsProviderProps extends MapProviderProps {
    onBoundsChange?: (bounds: MapBounds) => void
    children?: React.ReactNode
}


export class GoogleMapsProvider implements MapProvider {
    private apiKey: string

    constructor(apiKey: string = '') {
        this.apiKey = apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
    }

    isLoaded(): boolean {
        return true
    }

    isLoading(): boolean {
        return false
    }

    hasError(): boolean {
        return false
    }

    getError(): string | null {
        return null
    }

    renderMarker(point: Point): React.ReactNode {
        const title = point.type === CONTENT_MODES.PROPERTIES
            ? (point.item as PropertyItem).title
            : (point.item as UserItem).name

        return (
            <Marker
                key={point.id}
                position={{ lat: point.lat, lng: point.lng }}
                title={title}
            />
        )
    }

    renderInfoWindow(point: Point, onClose: () => void): React.ReactNode {
        return (
            <InfoWindow
                position={{ lat: point.lat, lng: point.lng }}
                onCloseClick={onClose}
            >
                <MapInfoWindow point={point} onClose={onClose} />
            </InfoWindow>
        )
    }

    
    createProviderComponent(props: Omit<GoogleMapsProviderProps, 'apiKey'>): React.ReactNode {
        const { onBoundsChange, children } = props

        return (
            <GoogleMapsProviderComponent
                apiKey={this.apiKey}
                onBoundsChange={onBoundsChange}
            >
                {children}
            </GoogleMapsProviderComponent>
        )
    }
}

function GoogleMapsProviderComponent({ apiKey, onBoundsChange, children }: GoogleMapsProviderProps) {
    const mapRef = useRef<google.maps.Map | null>(null)

    const { loadError } = useJsApiLoader({
        googleMapsApiKey: apiKey ?? '',
    })

    useEffect(() => {
        if (loadError) {
            console.error('Google Maps load error:', loadError)
        }
    }, [loadError])

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

    return (
        <GoogleMap
            mapContainerStyle={MAP_CONFIG.containerStyle}
            center={MAP_CONFIG.defaultCenter}
            zoom={MAP_CONFIG.defaultZoom}
            options={MAP_CONFIG.options}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onIdle={handleIdle}
        >
            {children}
        </GoogleMap>
    )
}

export function useGoogleMapsProvider(apiKey?: string): GoogleMapsProvider {
    return new GoogleMapsProvider(apiKey)
}