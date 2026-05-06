'use client'

import { useEffect, useState, useCallback } from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { MAP_CONFIG, MAP_LABELS } from '../constants/search.constants'

interface LocationMapSelectorProps {
  onLocationSelect: (lat: number, lng: number) => void
  initialLat?: number
  initialLng?: number
}

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
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

  const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: apiKey })

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

  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-surface-muted rounded-lg border border-border text-text-muted">
        {MAP_LABELS.apiKeyMissing}
      </div>
    )
  }

  if (!isClient || !isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-surface-muted rounded-lg border border-border text-text-muted">
        {loadError ? MAP_LABELS.loadError : MAP_LABELS.loading}
      </div>
    )
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
