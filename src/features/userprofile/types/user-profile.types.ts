import type { UserDetail } from '@/features/search/types/domain.types'
import type { ReactNode } from 'react'

export interface UserBasicInfoCardProps {
  user: UserDetail
}

export interface UserBioCardProps {
  bio: string
}

export interface UserReviewsCardProps {
  reviewButton?: ReactNode
}

export interface UserStatsCardProps {
  user: UserDetail
}

export interface UserBudgetCardProps {
  user: UserDetail
}

export interface UserLifestylesCardProps {
  user: UserDetail
}

export interface UserProfileHeaderProps {
  user: UserDetail
  reviewsSection?: ReactNode
}