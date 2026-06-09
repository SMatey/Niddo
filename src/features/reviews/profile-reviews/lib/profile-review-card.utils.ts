import { PROFILE_REVIEWS_COPY, PROFILE_REVIEWS_DATE_FORMAT } from '../constants/profile-reviews.constants'

export function formatProfileReviewDate(createdAt: string) {
  const date = new Date(createdAt)

  if (Number.isNaN(date.getTime())) {
    return PROFILE_REVIEWS_COPY.REVIEW.DATE_FALLBACK
  }

  return new Intl.DateTimeFormat(PROFILE_REVIEWS_DATE_FORMAT.LOCALE, PROFILE_REVIEWS_DATE_FORMAT.OPTIONS).format(date)
}