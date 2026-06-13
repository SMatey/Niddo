'use client'

import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@/features/userprofile/hooks/use-user'
import { UserProfileHeader } from '@/features/userprofile/components/user-profile-header'
import { USER_DETAIL_LABELS } from '@/features/userprofile/constants/user-detail.constants'
import { REPORT_FORM } from '@/features/reviews/constants/report-form.constants'
import { ModeratedContentState } from '@/features/reviews/components/moderated-content-state'
import { useReviewReportModeration } from '@/features/reviews/hooks/use-review-report-moderation'
import { Button } from '@/shared/components/ui/button'
import { DetailHeader } from '@/shared/components/ui/detail-header'
import { FavoriteProfileButton } from '@/features/favorites/components/favorite-button-container'
import { ProfileReviewsSection } from '@/features/reviews/profile-reviews/components/profile-reviews-section'

function UserDetailLoadingState() {
  return (
    <main className="min-h-screen bg-surface-subtle">
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-32 rounded bg-surface-muted" />
          <div className="h-32 max-w-2xl rounded-lg bg-surface-muted" />
          <div className="h-24 rounded-lg bg-surface-muted" />
        </div>
      </div>
    </main>
  )
}

function UserModerationErrorState({ onBack }: { onBack: () => void }) {
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

function UserDetailContent({ id, onBack }: { id: string; onBack: () => void }) {
  const { data: user, isLoading } = useUser(id)
  console.log("Datos del usuario:", user)

  if (isLoading) {
    return <UserDetailLoadingState />
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
          favoriteButton={<FavoriteProfileButton profileId={id} />}
          onBack={onBack}
        />

        {/* Le inyectamos el componente de reseñas directamente al Header */}
        <UserProfileHeader 
          user={user} 
          reviewsSection={<ProfileReviewsSection profileId={id} />}
        />

      </div>
    </main>
  )
}

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { moderationStatus, isLoading, error } = useReviewReportModeration('profile', id)

  if (isLoading) {
    return <UserDetailLoadingState />
  }

  if (error) {
    return <UserModerationErrorState onBack={() => router.back()} />
  }

  if (moderationStatus?.isHidden) {
    return (
      <main className="min-h-screen bg-surface-subtle">
        <div className="container mx-auto max-w-5xl px-4 py-6">
          <ModeratedContentState targetType="profile" onBack={() => router.back()} />
        </div>
      </main>
    )
  }

  return <UserDetailContent id={id} onBack={() => router.back()} />
}