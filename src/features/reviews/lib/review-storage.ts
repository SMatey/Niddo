import type { MockReviewRecord } from '@/shared/mocks/niddo-data'

// Comentario: guardamos reseñas en sessionStorage para probar el flujo completo sin depender aún del backend.
const REVIEWS_STORAGE_KEY = 'niddo-community-reviews'

function isBrowser() {
  return typeof window !== 'undefined'
}

export function getStoredReviews(): MockReviewRecord[] {
  if (!isBrowser()) {
    return []
  }

  const rawValue = window.sessionStorage.getItem(REVIEWS_STORAGE_KEY)

  if (!rawValue) {
    return []
  }

  try {
    const parsedValue = JSON.parse(rawValue) as MockReviewRecord[]
    return Array.isArray(parsedValue) ? parsedValue : []
  } catch {
    return []
  }
}

export function appendStoredReview(review: MockReviewRecord) {
  if (!isBrowser()) {
    return
  }

  const nextReviews = [...getStoredReviews(), review]
  window.sessionStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(nextReviews))
}
