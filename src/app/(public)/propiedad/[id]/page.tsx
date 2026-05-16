'use client'

import { useParams, useRouter } from 'next/navigation'
import { MapProvider } from '@/features/search/providers/map-provider'
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
import { REPORT_FORM } from '@/features/reviews/constants/report-form.constants'
import { ModeratedContentState } from '@/features/reviews/components/moderated-content-state'
import { useReviewReportModeration } from '@/features/reviews/hooks/use-review-report-moderation'
import { Button } from '@/shared/components/ui/button'
import { DetailHeader } from '@/shared/components/ui/detail-header'
import { CONTENT_MODES } from '@/features/search/constants/search.constants'

function PropertyDetailLoadingState() {
  return (
    <main className="min-h-screen bg-surface-subtle">
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-32 rounded bg-surface-muted" />
          <div className="aspect-video max-w-2xl rounded-lg bg-surface-muted" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 rounded-lg bg-surface-muted" />
            <div className="h-24 rounded-lg bg-surface-muted" />
          </div>
        </div>
      </div>
    </main>
  )
}

function PropertyModerationErrorState({ onBack }: { onBack: () => void }) {
  return (
    <main className="min-h-screen bg-surface-subtle">
      <div className="container mx-auto max-w-5xl px-4 py-6">
        <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <p className="text-sm text-state-error">{REPORT_FORM.UI.MODERATION_ERROR}</p>
          <div className="mt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              {REPORT_FORM.UI.BACK_TO_PREVIOUS}
            </Button>
          </div>
        </section>
      </div>
    </main>
  )
}

function PropertyDetailContent({ id, onBack }: { id: string; onBack: () => void }) {
  const { data: property, isLoading } = useProperty(id)

  if (isLoading) {
    return <PropertyDetailLoadingState />
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
          onBack={onBack}
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
                contentMode={CONTENT_MODES.PROPERTIES}
                isDetailView={true}
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

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { moderationStatus, isLoading, error } = useReviewReportModeration('property', id)

  if (isLoading) {
    return <PropertyDetailLoadingState />
  }

  if (error) {
    return <PropertyModerationErrorState onBack={() => router.back()} />
  }

  if (moderationStatus?.isHidden) {
    return (
      <main className="min-h-screen bg-surface-subtle">
        <div className="container mx-auto max-w-5xl px-4 py-6">
          <ModeratedContentState targetType="property" onBack={() => router.back()} />
        </div>
      </main>
    )
  }

  return (
    <MapProvider>
      <PropertyDetailContent id={id} onBack={() => router.back()} />
    </MapProvider>
  )
}
