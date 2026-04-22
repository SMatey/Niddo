'use client'

import { useParams, useRouter } from 'next/navigation'
import { MapView } from '@/features/search/components/map-view'
import { useProperty } from '@/features/properties/hooks/use-property'
import { PROPERTY_DETAIL_LABELS } from '@/features/properties/constants/property-detail.constants'
import { PropertyInfoCard } from '@/features/properties/components/property-info-card'
import { PropertyPriceCard } from '@/features/properties/components/property-price-card'
import { PropertyHostCard } from '@/features/properties/components/property-host-card'
import { PropertyAmenitiesCard } from '@/features/properties/components/property-amenities-card'
import { PropertyRulesCard } from '@/features/properties/components/property-rules-card'
import { PropertyGallery } from '@/features/properties/components/property-gallery'
import { PropertyTitle } from '@/features/properties/components/property-title'
import { DetailHeader } from '@/shared/components/ui/detail-header'

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { data: property, isLoading } = useProperty(id)

  if (isLoading) {
    return (
      <main className="min-h-screen bg-surface-subtle">
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-32 bg-surface-muted rounded" />
            <div className="aspect-video bg-surface-muted rounded-lg max-w-2xl" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 bg-surface-muted rounded-lg" />
              <div className="h-24 bg-surface-muted rounded-lg" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!property) {
    return (
      <main className="min-h-screen bg-surface-subtle">
        <div className="container mx-auto px-4 py-6">
          <p className="text-text-muted">{PROPERTY_DETAIL_LABELS.notFound}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-surface-subtle">
      <div className="container mx-auto px-4 py-6 max-w-5xl space-y-6">
        <DetailHeader
          isFavorite={property.isFavorite ?? false}
          onFavoriteToggle={() => {}}
          onBack={() => router.back()}
        />

        <PropertyGallery images={property.images} title={property.title} />
        <PropertyTitle title={property.title} location={property.location} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <PropertyInfoCard
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            squareMeters={property.squareMeters}
          />
          <PropertyPriceCard price={property.price} />
          <PropertyHostCard
            hostName={property.hostName}
            hostImageUrl={property.hostImageUrl}
            hostVerified={property.hostVerified}
            hostId={property.hostId}
            memberSince={property.memberSince}
            hostConfidence={property.hostConfidence}
          />
          <div className="bg-surface rounded-lg border border-border p-4 space-y-3 md:col-span-2 lg:col-span-3">
            <h3 className="font-semibold text-text-primary">{PROPERTY_DETAIL_LABELS.location}</h3>
            <div className="h-48 rounded-lg overflow-hidden">
              <MapView
                properties={[property]}
                users={[]}
                contentMode="properties"
              />
            </div>
          </div>
          <PropertyAmenitiesCard amenities={property.amenities ?? []} />
          <PropertyRulesCard rules={property.rules} />
        </div>
      </div>
    </main>
  )
}