import type {
  CohabitationConfirmationOption,
  ReviewComposerContext,
  ReviewItem,
  ReviewSummary,
  ReviewTargetType,
} from '@/features/search/types/search.types'
import {
  DEMO_REVIEWER_ID,
  mockCohabitationConfirmations,
  mockProfiles,
  mockProperties,
  mockSeedReviews,
  type MockReviewRecord,
} from '@/shared/mocks/niddo-data'
import { appendStoredReview, getStoredReviews } from './review-storage'

interface CreateReviewInput {
  viewerId?: string | null
  targetType: ReviewTargetType
  targetId: string
  confirmationId: string
  rating: number
  comment: string
}

function findProfileById(id: string) {
  return mockProfiles.find((profile) => profile.id === id)
}

function findPropertyById(id: string) {
  return mockProperties.find((property) => property.id === id)
}

function getAllReviews() {
  return [...mockSeedReviews, ...getStoredReviews()]
}

function formatDateLabel(date: string) {
  return new Intl.DateTimeFormat('es-CR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

function resolveViewerId(viewerId?: string | null) {
  const hasMatchingProfile = viewerId ? mockProfiles.some((profile) => profile.id === viewerId) : false

  return {
    viewerId: hasMatchingProfile ? viewerId ?? DEMO_REVIEWER_ID : DEMO_REVIEWER_ID,
    isDemoReviewer: !hasMatchingProfile,
  }
}

function toReviewItem(review: MockReviewRecord): ReviewItem {
  const author = findProfileById(review.authorId)
  const property = review.propertyId ? findPropertyById(review.propertyId) : undefined
  const associatedProfile = review.associatedProfileId
    ? findProfileById(review.associatedProfileId)
    : undefined

  return {
    id: review.id,
    authorId: review.authorId,
    authorName: author?.name ?? 'Miembro de la comunidad',
    authorImageUrl: author?.imageUrl,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    createdAtLabel: formatDateLabel(review.createdAt),
    targetType: review.targetType,
    targetId: review.targetId,
    propertyId: review.propertyId,
    propertyTitle: property?.title,
    associatedProfileId: review.associatedProfileId,
    associatedProfileName: associatedProfile?.name,
    isCohabitationConfirmed: review.isCohabitationConfirmed,
  }
}

function buildSummary(reviews: ReviewItem[]): ReviewSummary {
  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      confirmedReviews: 0,
    }
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
  const confirmedReviews = reviews.filter((review) => review.isCohabitationConfirmed).length

  return {
    averageRating: Number((totalRating / reviews.length).toFixed(1)),
    totalReviews: reviews.length,
    confirmedReviews,
  }
}

function getUserReviews(targetUserId: string) {
  return getAllReviews()
    .filter((review) => {
      if (review.targetType === 'user' && review.targetId === targetUserId) {
        return true
      }

      return (
        review.targetType === 'property' &&
        review.isCohabitationConfirmed &&
        review.associatedProfileId === targetUserId
      )
    })
    .map(toReviewItem)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
}

function getPropertyReviews(propertyId: string) {
  return getAllReviews()
    .filter((review) => review.targetType === 'property' && review.targetId === propertyId)
    .map(toReviewItem)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
}

function buildConfirmationOption(confirmationId: string): CohabitationConfirmationOption | null {
  const confirmation = mockCohabitationConfirmations.find((item) => item.id === confirmationId)

  if (!confirmation) {
    return null
  }

  const property = findPropertyById(confirmation.propertyId)
  const associatedProfile = findProfileById(confirmation.associatedProfileId)

  if (!property || !associatedProfile) {
    return null
  }

  return {
    id: confirmation.id,
    propertyId: property.id,
    propertyTitle: property.title,
    associatedProfileId: associatedProfile.id,
    associatedProfileName: associatedProfile.name,
    relationshipLabel: confirmation.relationshipLabel,
    periodLabel: confirmation.periodLabel,
    confirmedAtLabel: formatDateLabel(confirmation.confirmedAt),
  }
}

function getAvailableConfirmations(
  viewerId: string,
  targetType: ReviewTargetType,
  targetId: string
) {
  const existingReviews = getAllReviews()
  return mockCohabitationConfirmations
    .filter((confirmation) => {
      if (confirmation.reviewerId !== viewerId) {
        return false
      }

      const matchesTarget =
        targetType === 'property'
          ? confirmation.propertyId === targetId
          : confirmation.associatedProfileId === targetId

      if (!matchesTarget) {
        return false
      }

      return !existingReviews.some(
        (review) =>
          review.authorId === viewerId &&
          review.targetType === targetType &&
          review.targetId === targetId &&
          review.confirmationId === confirmation.id
      )
    })
    .map((confirmation) => buildConfirmationOption(confirmation.id))
    .filter((item): item is CohabitationConfirmationOption => Boolean(item))
}

function getReviewComposerContext(
  viewerId?: string | null,
  targetType?: ReviewTargetType,
  targetId?: string
): ReviewComposerContext | null {
  if (!targetType || !targetId) {
    return null
  }

  const viewerContext = resolveViewerId(viewerId)
  const viewerProfile = findProfileById(viewerContext.viewerId)

  if (!viewerProfile) {
    return null
  }

  return {
    currentUserId: viewerProfile.id,
    currentUserName: viewerProfile.name,
    isDemoReviewer: viewerContext.isDemoReviewer,
    availableConfirmations: getAvailableConfirmations(viewerProfile.id, targetType, targetId),
  }
}

// Comentario: este servicio encapsula la regla clave de negocio: una reseña confirmada puede impactar también al perfil asociado.
export const reviewsService = {
  getUserReviews(targetUserId: string) {
    const reviews = getUserReviews(targetUserId)
    return {
      reviews,
      summary: buildSummary(reviews),
    }
  },

  getPropertyReviews(propertyId: string) {
    const reviews = getPropertyReviews(propertyId)
    return {
      reviews,
      summary: buildSummary(reviews),
    }
  },

  getComposerContext(targetType: ReviewTargetType, targetId: string, viewerId?: string | null) {
    return getReviewComposerContext(viewerId, targetType, targetId)
  },

  createReview(input: CreateReviewInput) {
    const viewerContext = resolveViewerId(input.viewerId)
    const viewerProfile = findProfileById(viewerContext.viewerId)
    const confirmation = mockCohabitationConfirmations.find(
      (item) => item.id === input.confirmationId && item.reviewerId === viewerContext.viewerId
    )

    if (!viewerProfile) {
      throw new Error('No encontramos el perfil que está intentando publicar la reseña.')
    }

    if (!confirmation) {
      throw new Error('La convivencia seleccionada no es válida para tu perfil.')
    }

    const matchesTarget =
      input.targetType === 'property'
        ? confirmation.propertyId === input.targetId
        : confirmation.associatedProfileId === input.targetId

    if (!matchesTarget) {
      throw new Error('La convivencia seleccionada no corresponde con este perfil o propiedad.')
    }

    const reviewAlreadyExists = getAllReviews().some(
      (review) =>
        review.authorId === viewerContext.viewerId &&
        review.targetType === input.targetType &&
        review.targetId === input.targetId &&
        review.confirmationId === input.confirmationId
    )

    if (reviewAlreadyExists) {
      throw new Error('Ya existe una reseña publicada para esta convivencia confirmada.')
    }

    const reviewRecord: MockReviewRecord = {
      id: `review-${Date.now()}`,
      authorId: viewerContext.viewerId,
      targetType: input.targetType,
      targetId: input.targetId,
      rating: input.rating,
      comment: input.comment.trim(),
      confirmationId: confirmation.id,
      propertyId: confirmation.propertyId,
      associatedProfileId: confirmation.associatedProfileId,
      isCohabitationConfirmed: true,
      createdAt: new Date().toISOString(),
    }

    appendStoredReview(reviewRecord)

    return toReviewItem(reviewRecord)
  },
}
