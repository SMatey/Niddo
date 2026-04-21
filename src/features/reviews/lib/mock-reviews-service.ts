import type { CreateReviewInput, CreateReviewResult, Review, ReviewTargetType } from '@/features/reviews/types/review.types'

const REVIEWS_STORAGE_KEY = 'niddo.reviews.v1'

const seedReviews: Review[] = [
  {
    id: 'seed-review-user-1',
    targetType: 'user',
    targetId: 'host-1',
    linkedProfileId: 'host-1',
    targetDisplayName: 'Maria Garcia',
    reviewerId: 'seed-user-1',
    reviewerName: 'Carlos Mendez',
    rating: 5,
    comment: 'Buena convivencia, comunicacion clara y respeto de reglas.',
    isCohabitationConfirmed: true,
    createdAt: '2026-04-10T10:00:00.000Z',
  },
  {
    id: 'seed-review-property-1',
    targetType: 'property',
    targetId: '1',
    linkedProfileId: 'host-1',
    targetDisplayName: 'Apartamento centrico',
    reviewerId: 'seed-user-2',
    reviewerName: 'Ana Rojas',
    rating: 4,
    comment: 'Propiedad comoda y bien ubicada, experiencia positiva.',
    isCohabitationConfirmed: true,
    createdAt: '2026-04-12T18:30:00.000Z',
  },
]

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readStoredReviews(): Review[] {
  if (!canUseLocalStorage()) {
    return seedReviews
  }

  const storedValue = window.localStorage.getItem(REVIEWS_STORAGE_KEY)
  if (!storedValue) {
    return seedReviews
  }

  try {
    const parsed = JSON.parse(storedValue)
    if (!Array.isArray(parsed)) {
      return seedReviews
    }

    return parsed as Review[]
  } catch {
    return seedReviews
  }
}

function writeStoredReviews(reviews: Review[]) {
  if (!canUseLocalStorage()) {
    return
  }

  window.localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews))
}

function sortByNewest(reviews: Review[]) {
  return [...reviews].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

function generateReviewId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `review-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function validateCreateReviewInput(input: CreateReviewInput, existingReviews: Review[]): string | null {
  if (!input.isCohabitationConfirmed) {
    return 'Debes confirmar la convivencia para publicar la resena.'
  }

  if (input.reviewerId === input.linkedProfileId) {
    return 'No puedes publicar una resena sobre tu propio perfil.'
  }

  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    return 'La calificacion debe ser un numero entre 1 y 5.'
  }

  const comment = input.comment.trim()
  if (comment.length < 10) {
    return 'La resena debe tener al menos 10 caracteres.'
  }

  const alreadyReviewed = existingReviews.some((review) => {
    return (
      review.reviewerId === input.reviewerId &&
      review.targetType === input.targetType &&
      review.targetId === input.targetId
    )
  })

  if (alreadyReviewed) {
    return 'Ya publicaste una resena para este perfil o propiedad.'
  }

  return null
}

async function getReviewsByTarget(targetType: ReviewTargetType, targetId: string): Promise<Review[]> {
  const reviews = readStoredReviews()
  const filteredReviews = reviews.filter((review) => {
    return review.targetType === targetType && review.targetId === targetId
  })

  return sortByNewest(filteredReviews)
}

async function createReview(input: CreateReviewInput): Promise<CreateReviewResult> {
  const existingReviews = readStoredReviews()
  const validationError = validateCreateReviewInput(input, existingReviews)
  if (validationError) {
    return {
      data: null,
      error: validationError,
    }
  }

  const review: Review = {
    id: generateReviewId(),
    targetType: input.targetType,
    targetId: input.targetId,
    linkedProfileId: input.linkedProfileId,
    targetDisplayName: input.targetDisplayName,
    reviewerId: input.reviewerId,
    reviewerName: input.reviewerName,
    rating: input.rating,
    comment: input.comment.trim(),
    isCohabitationConfirmed: input.isCohabitationConfirmed,
    createdAt: new Date().toISOString(),
  }

  const nextReviews = sortByNewest([review, ...existingReviews])
  writeStoredReviews(nextReviews)

  return {
    data: review,
    error: null,
  }
}

export const mockReviewsService = {
  getReviewsByTarget,
  createReview,
}
