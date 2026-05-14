'use client'

import { cn } from '@/lib/utils'
import type { UserAvatarProps } from '../navbar.types'

const isImageAvatar = (value: string) =>
  value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:image/')

export function UserAvatar({ avatar, onClick, size = 'md' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center justify-center rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors cursor-pointer',
        sizeClasses[size]
      )}
      type="button"
    >
      {isImageAvatar(avatar) ? (
        <img src={avatar} alt="Avatar del usuario" className="h-full w-full rounded-full object-cover" />
      ) : (
        avatar
      )}
    </button>
  )
}
