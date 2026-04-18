'use client'

import { Check } from './icons'
import { CARD_LABELS } from '@/features/search/constants/search.constants'
import type { UserAvatarProps, UserInfoProps } from '@/shared/types/types'

const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    xl: 'w-24 h-24',
}

export function UserAvatar({ name, imageUrl, verified, age, size = 'md' }: UserAvatarProps) {
    const sizeClass = sizeClasses[size]
    return (
        <div className={`${sizeClass} rounded-full bg-surface-muted overflow-hidden shrink-0 border-2 border-brand-600`}>
            {imageUrl ? (
                <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted text-xl font-semibold">
                    {name.charAt(0)}
                </div>
            )}
        </div>
    )
}

export function UserInfo({ name, verified, age, location }: UserInfoProps) {
    return (
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-text-primary truncate">{name}</h3>
                {verified && (
                    <span className="text-brand-600 shrink-0" title={CARD_LABELS.verified}>
                        <Check className="w-4 h-4" />
                    </span>
                )}
                {age != null && (
                    <span className="text-sm text-text-muted shrink-0">{age} {CARD_LABELS.years}</span>
                )}
            </div>
            {location && (
                <p className="text-sm text-text-secondary mt-0.5">{location}</p>
            )}
        </div>
    )
}