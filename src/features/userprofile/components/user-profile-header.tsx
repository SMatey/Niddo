'use client'

import { UserBasicInfoCard } from './user-basic-info-card'
import { UserBioCard } from './user-bio-card'
import { UserReviewsCard } from './user-reviews-card'
import { UserStatsCard } from './user-stats-card'
import { UserBudgetCard } from './user-budget-card'
import { UserLifestylesCard } from './user-lifestyles-card'
import type { UserProfileHeaderProps } from '../types/user-profile.types'

export function UserProfileHeader({ user, reviewButton }: UserProfileHeaderProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <div className="md:col-span-1 space-y-6">
        <UserBasicInfoCard user={user} />
        
        {(user.minBudget || user.maxBudget) && (
          <UserBudgetCard user={user} />
        )}
      </div>

      <div className="md:col-span-2 space-y-6">
        {user.bio && (
          <UserBioCard bio={user.bio} />
        )}

        {user.lifestyles && user.lifestyles.length > 0 && (
          <UserLifestylesCard user={user} />
        )}

        <UserStatsCard user={user} />

        <UserReviewsCard reviewButton={reviewButton} />
      </div>
      
    </div>
  )
}