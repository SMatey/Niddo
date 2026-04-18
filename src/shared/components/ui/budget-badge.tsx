'use client'

import { CARD_LABELS } from '@/features/search/constants/search.constants'
import type { BudgetBadgeProps } from '@/shared/types/types'

export function BudgetBadge({ minBudget, maxBudget }: BudgetBadgeProps) {
    if (!minBudget && !maxBudget) return null

    const budgetText = minBudget && maxBudget
        ? `${minBudget} - ${maxBudget}`
        : minBudget
            ? `${CARD_LABELS.from} ${minBudget}`
            : `${CARD_LABELS.upTo} ${maxBudget}`

    return (
        <p className="text-sm font-medium text-text-primary">
            {budgetText}
        </p>
    )
}