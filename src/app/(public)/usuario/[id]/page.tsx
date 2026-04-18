'use client'

import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@/features/users/hooks/use-user'
import { UserProfileHeader } from '@/features/users/components/user-profile-header'
import { UserStatsCard } from '@/features/users/components/user-stats-card'
import { UserBudgetCard } from '@/features/users/components/user-budget-card'
import { UserLifestylesCard } from '@/features/users/components/user-lifestyles-card'
import { UserLocationCard } from '@/features/users/components/user-location-card'
import { USER_DETAIL_LABELS } from '@/features/users/constants/user-detail.constants'
import { DetailHeader } from '@/shared/components/ui/detail-header'

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { data: user, isLoading } = useUser(id)

  if (isLoading) {
    return (
      <main className="min-h-screen bg-surface-subtle">
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-32 bg-surface-muted rounded" />
            <div className="h-32 bg-surface-muted rounded-lg max-w-2xl" />
            <div className="h-24 bg-surface-muted rounded-lg" />
          </div>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-surface-subtle">
        <div className="container mx-auto px-4 py-6">
          <p className="text-text-muted">{USER_DETAIL_LABELS.notFound}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-surface-subtle">
      <div className="container mx-auto px-4 py-6 max-w-5xl space-y-6">
        <DetailHeader
          isFavorite={user.isFavorite ?? false}
          onFavoriteToggle={() => {}}
          onBack={() => router.back()}
        />
        
        <UserProfileHeader user={user} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UserStatsCard user={user} />
          <UserBudgetCard user={user} />
          <UserLifestylesCard user={user} />
          <UserLocationCard user={user} />
        </div>
      </div>
    </main>
  )
}