'use client'

import { useEffect, useMemo, useState } from 'react'
import { GoogleMap, Marker } from '@react-google-maps/api'
import { Button } from '@/shared/components/ui/button'
import { MAP_CONFIG } from '@/features/search/constants/search.constants'
import { MapLoadingState, useMap } from '@/features/search/providers/map-provider'
import { PROPERTY_PUBLICATION_LABELS }   from '@/features/properties/constants/publication.constants'
import type { PublicationLocation } from '@/features/properties/types/publication.types'

interface PropertyLocationPickerProps {
  lat?: number | null
  lng?: number | null
  onLocationChange: (value: PublicationLocation) => void
}

export function PropertyLocationPicker({ lat, lng, onLocationChange }: PropertyLocationPickerProps) {
  const [isClient, setIsClient] = useState(false)
  const [center, setCenter] = useState<google.maps.LatLngLiteral>(MAP_CONFIG.defaultCenter)
  const { isLoaded, loadError } = useMap()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (lat != null && lng != null) {
      setCenter({ lat, lng })
      return
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        () => {
          setCenter(MAP_CONFIG.defaultCenter)
        }
      )
    }
  }, [lat, lng])

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) {
      return
    }

    const nextLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    }

    onLocationChange(nextLocation)
  }

  const navigationUrl = useMemo(() => {
    if (lat == null || lng == null) {
      return ''
    }

    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  }, [lat, lng])

  const requestCurrentPosition = async () => {
    if (!('geolocation' in navigator)) {
      return
    }

    navigator.geolocation.getCurrentPosition((position) => {
      onLocationChange({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    })
  }

  return (
    <div className="rounded-3xl border border-border bg-surface p-4 shadow-sm">
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            {PROPERTY_PUBLICATION_LABELS.sectionTitles.location}
          </h2>
          <p className="text-sm text-text-secondary">
            {PROPERTY_PUBLICATION_LABELS.labels.mapInstructions}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface-muted h-96">
          {!isClient || !isLoaded || loadError ? (
            <MapLoadingState />
          ) : (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%', minHeight: '384px' }}
              center={center}
              zoom={13}
              options={MAP_CONFIG.options}
              onClick={handleMapClick}
            >
              {lat != null && lng != null ? <Marker position={{ lat, lng }} /> : null}
            </GoogleMap>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-background p-3">
            <p className="text-xs uppercase tracking-wide text-text-secondary">{PROPERTY_PUBLICATION_LABELS.labels.mapCoordinates}</p>
            <p className="mt-2 text-sm text-text-primary">
              {lat != null && lng != null
                ? `${lat.toFixed(6)}, ${lng.toFixed(6)}`
                : PROPERTY_PUBLICATION_LABELS.helpers.noCoordinatesSelected}
            </p>
          </div>

          {navigationUrl ? (
            <a
              href={navigationUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[72px] items-center justify-center rounded-2xl border border-border bg-surface p-3 text-sm font-medium text-primary transition hover:bg-primary/5"
            >
              {PROPERTY_PUBLICATION_LABELS.labels.navigationLink}
            </a>
          ) : (
            <div className="rounded-2xl border border-border bg-background p-3 text-sm text-text-secondary">
              {PROPERTY_PUBLICATION_LABELS.helpers.coordinatesMissing}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="button" variant="outline" onClick={requestCurrentPosition}>
            {PROPERTY_PUBLICATION_LABELS.buttons.useCurrentLocation}
          </Button>
        </div>
      </div>
    </div>
  )
}
