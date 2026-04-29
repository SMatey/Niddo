'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import type { LatLngExpression, LeafletMouseEvent } from 'leaflet'
import { MAP_CONFIG } from '../constants/search.constants'

interface LocationMapSelectorProps {
  onLocationSelect: (lat: number, lng: number) => void
  initialLat?: number
  initialLng?: number
}

// Define custom marker icon from CDN to avoid "marker icon not found" error
const customMarkerIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface MapClickerProps {
  onLocationSelect: (lat: number, lng: number) => void
  selectedPos: [number, number] | null
}

function MapClicker({ onLocationSelect, selectedPos }: MapClickerProps) {
  const map = useMapEvents({
    click: (e: LeafletMouseEvent) => {
      const { lat, lng } = e.latlng
      onLocationSelect(lat, lng)
    },
  })

  return selectedPos ? (
    <Marker position={selectedPos} icon={customMarkerIcon}>
      <Popup>
        Ubicación seleccionada: {selectedPos[0].toFixed(4)}, {selectedPos[1].toFixed(4)}
      </Popup>
    </Marker>
  ) : null
}

export function LocationMapSelector({
  onLocationSelect,
  initialLat,
  initialLng,
}: LocationMapSelectorProps) {
  const [isClient, setIsClient] = useState(false)
  const [selectedPos, setSelectedPos] = useState<[number, number] | null>(
    initialLat && initialLng ? [initialLat, initialLng] : null
  )
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleLocationSelect = useCallback(
    (lat: number, lng: number) => {
      setSelectedPos([lat, lng])
      onLocationSelect(lat, lng)
    },
    [onLocationSelect]
  )

  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-surface-muted rounded-lg border border-border text-text-muted">
        Cargando mapa...
      </div>
    )
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={
          selectedPos
            ? selectedPos
            : ([MAP_CONFIG.defaultCenter.lat, MAP_CONFIG.defaultCenter.lng] as LatLngExpression)
        }
        zoom={MAP_CONFIG.defaultZoom}
        style={{ width: '100%', height: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClicker onLocationSelect={handleLocationSelect} selectedPos={selectedPos} />
      </MapContainer>
    </div>
  )
}
