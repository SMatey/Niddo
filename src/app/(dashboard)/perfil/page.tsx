'use client'

import { useAuth } from '@/features/auth/hooks/use-auth'
import { useUser } from '@/features/userprofile/hooks/use-user'
import { UserProfileHeader } from '@/features/userprofile/components/user-profile-header'
import { ProfileReviewsSection } from '@/features/reviews/profile-reviews/components/profile-reviews-section'
import { USER_DETAIL_LABELS } from '@/features/userprofile/constants/user-detail.constants'

function ProfileLoadingState() {
  return (
    <main className="min-h-screen bg-surface-subtle">
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-surface-muted" />
          <div className="h-32 max-w-2xl rounded-lg bg-surface-muted" />
          <div className="h-24 rounded-lg bg-surface-muted" />
        </div>
      </div>
    </main>
  )
}

export default function ProfilePage() {
  const { user: authUser, isInitialized } = useAuth()
  const userId = authUser?.id ?? ''
  const { data: userProfile, isLoading } = useUser(userId)

  if (!isInitialized || isLoading) {
    return <ProfileLoadingState />
  }

  if (!userProfile) {
    return (
      <main className="min-h-screen bg-surface-subtle">
        <div className="container mx-auto px-4 py-6">
          <p className="text-text-muted">{USER_DETAIL_LABELS.notFound}</p>
        </div>
      </main>
    )
  }

  const profileWithFlag = { ...userProfile, isOwnProfile: true }

  return (
    <main className="min-h-screen bg-surface-subtle">
      <div className="container mx-auto px-4 py-6 max-w-5xl space-y-6">
        <UserProfileHeader
          user={profileWithFlag}
          reviewsSection={<ProfileReviewsSection profileId={userId} />}
        />
      </div>
    </main>
  )
}
