'use client'

import { CARD_LABELS } from '@/features/search/constants/search.constants'
import type { ConfidenceBarProps } from '@/shared/types/types'

export function ConfidenceBar({ score }: ConfidenceBarProps) {
    return (
        <div className="hidden sm:block space-y-1">
            <div className="flex justify-between text-xs text-text-muted">
                <span>{CARD_LABELS.confidence}</span>
                <span>{score}%</span>
            </div>
            <div className="h-1.5 bg-surface-muted rounded-full overflow-hidden">
                <div
                    className="h-full bg-brand-600 rounded-full transition-all"
                    style={{ width: `${score}%` }}
                />
            </div>
        </div>
    )
}