'use client'

interface UserAvatarProps {
  avatar: string
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
}

export function UserAvatar({ avatar, onClick, size = 'md' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors cursor-pointer ${
        sizeClasses[size]
      }`}
      type="button"
    >
      {avatar}
    </button>
  )
}
