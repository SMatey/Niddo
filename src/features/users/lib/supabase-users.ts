import type { UserDetail, UserItem } from '@/features/search/types/search.types'
import { reviewsService } from '@/features/reviews/lib/review-service'
import { mockProfiles, toUserDetail, toUserItem } from '@/shared/mocks/niddo-data'

function sortUsers(users: UserItem[]) {
  return [...users].sort((left, right) => left.name.localeCompare(right.name, 'es'))
}

export const usersService = {
  getUsers(): UserItem[] {
    return sortUsers(mockProfiles.map(toUserItem))
  },

  getUserById(id: string, viewerId?: string | null): UserDetail | null {
    const profile = mockProfiles.find((item) => item.id === id)

    if (!profile) {
      return null
    }

    const { reviews, summary } = reviewsService.getUserReviews(id)

    return {
      ...toUserDetail(profile),
      // Comentario: agregamos las reseñas al detalle para no repartir esta responsabilidad entre la página y el hook.
      reviews,
      reviewSummary: summary,
      reviewComposer: reviewsService.getComposerContext('user', id, viewerId),
    }
  },
}
