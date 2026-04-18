'use client'

import { BudgetBadge } from '@/shared/components/ui/budget-badge'
import { USER_DETAIL_LABELS } from '../constants/user-detail.constants'
import type { UserDetail } from '@/features/search/types/search.types'

interface UserBudgetCardProps {
  user: UserDetail
}

export function UserBudgetCard({ user }: UserBudgetCardProps) {
  return (
    <div className="bg-surface rounded-lg border border-border p-4 space-y-4">
      <h3 className="font-semibold text-text-primary">{USER_DETAIL_LABELS.budget}</h3>
      <BudgetBadge minBudget={user.minBudget} maxBudget={user.maxBudget} />
      <p className="text-sm text-text-muted">
        {USER_DETAIL_LABELS.budgetRangeHint}
      </p>
    </div>
  )
}