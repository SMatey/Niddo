'use client'

import { PropertyPublicationForm } from '@/features/properties/components/property-publication-form'
import { MapProvider } from '@/features/search/providers/map-provider'

export default function Page() {
  return (
    <MapProvider>
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <PropertyPublicationForm />
      </main>
    </MapProvider>
  )
}
