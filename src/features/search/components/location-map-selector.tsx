'use client'

import { useEffect, useState, useCallback } from 'react'
import { GoogleMap, Marker } from '@react-google-maps/api'
import { MAP_CONFIG } from '../constants/search.constants'
import { MapLoadingState, useMap } from '@/features/search/providers/map-provider'
import type { LocationMapSelectorProps } from '../types/ui.types'

export function LocationMapSelector({
  onLocationSelect,
  initialLat,
  initialLng,
}: LocationMapSelectorProps) {
  const [isClient, setIsClient] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<google.maps.LatLngLiteral | null>(
    initialLat != null && initialLng != null
      ? { lat: initialLat, lng: initialLng }
      : null
  )
  const [center, setCenter] = useState<google.maps.LatLngLiteral>(MAP_CONFIG.defaultCenter)
  const { isLoaded, loadError } = useMap()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (initialLat != null && initialLng != null) {
      const nextLocation = { lat: initialLat, lng: initialLng }
      setSelectedPosition(nextLocation)
      setCenter(nextLocation)
    }
  }, [initialLat, initialLng])

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) {
        return
      }

      const nextPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      }

      setSelectedPosition(nextPosition)
      onLocationSelect(nextPosition.lat, nextPosition.lng)
    },
    [onLocationSelect]
  )

  if (!isClient || !isLoaded || loadError) {
    return <MapLoadingState />
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-border">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={selectedPosition ?? center}
        zoom={MAP_CONFIG.defaultZoom}
        options={MAP_CONFIG.options}
        onClick={handleMapClick}
      >
        {selectedPosition ? <Marker position={selectedPosition} /> : null}
      </GoogleMap>
    </div>
  )
}
