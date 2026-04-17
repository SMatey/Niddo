'use client'

import { Heart } from './icons'
import type { FavoriteButtonProps } from '@/shared/types/types'

export function FavoriteButton({
    isFavorite,
    onToggle,
    className = '',
    activeClassName = 'bg-red-500 text-white border-red-500',
    inactiveClassName = 'bg-white text-text-muted border-border hover:border-red-400 hover:text-red-500',
}: FavoriteButtonProps) {
    return (
        <button
            onClick={onToggle}
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-colors ${isFavorite ? activeClassName : inactiveClassName} ${className}`}
        >
            <Heart className="w-5 h-5" />
        </button>
    )
}