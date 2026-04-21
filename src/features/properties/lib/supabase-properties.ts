import type { PropertyDetail, PropertyItem } from '@/features/search/types/search.types'
import { reviewsService } from '@/features/reviews/lib/review-service'
import { mockProfiles, mockProperties, toPropertyDetail, toPropertyItem } from '@/shared/mocks/niddo-data'

function sortProperties(properties: PropertyItem[]) {
  return [...properties].sort((left, right) => left.title.localeCompare(right.title, 'es'))
}

export const propertiesService = {
  getProperties(): PropertyItem[] {
    return sortProperties(mockProperties.map(toPropertyItem))
  },

  getPropertyById(id: string, viewerId?: string | null): PropertyDetail | null {
    const property = mockProperties.find((item) => item.id === id)

    if (!property) {
      return null
    }

    const host = mockProfiles.find((profile) => profile.id === property.hostId)

    if (!host) {
      return null
    }

    const { reviews, summary } = reviewsService.getPropertyReviews(id)

    return {
      ...toPropertyDetail(property, host),
      // Comentario: adjuntamos el resumen al detalle para que la UI consuma un contrato simple y estable.
      reviews,
      reviewSummary: summary,
      reviewComposer: reviewsService.getComposerContext('property', id, viewerId),
    }
  },
}
