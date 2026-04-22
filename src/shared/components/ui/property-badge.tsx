'use client'

import { cn } from '@/lib/utils'
import { BADGE_VARIANTS, BADGE_CLASSES } from '@/features/search/constants/search.constants'
import type { BadgeItem, PropertyBadgeProps } from './types'

export function PropertyBadge({ badges = [], className }: PropertyBadgeProps) {
    if (badges.length === 0) return null

    return (
        <div className={cn('flex gap-1.5', className)}>
            {badges.map((badge, index) => {
                const variantStyles = BADGE_VARIANTS[badge.variant]
                return (
                    <span
                        key={`${badge.type}-${index}`}
                        className={cn(
                            BADGE_CLASSES.base,
                            variantStyles.bgClass,
                            variantStyles.textClass,
                            variantStyles.borderClass
                        )}
                    >
                        {badge.label}
                    </span>
                )
            })}
        </div>
    )
}