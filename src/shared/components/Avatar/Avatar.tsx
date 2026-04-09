import Image from 'next/image'
import { THEME, type ThemeSize } from '@/shared/constants/theme.constants'
import { ACCESSIBILITY } from '@/shared/constants/accessibility.constants'

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  src?: string | null
  alt: string
  size?: AvatarSize
  className?: string
}

const sizeMap: Record<ThemeSize, number> = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
}

export function Avatar({ src, alt, size = THEME.SIZES.MD, className }: AvatarProps) {
  const px = sizeMap[size]
  const textSizeMap: Record<ThemeSize, string> = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  }
  const initials = alt
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div
      className={[
        'flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ width: px, height: px }}
    >
      {src ? (
        <Image src={src} alt={alt} width={px} height={px} className="h-full w-full object-cover" />
      ) : (
        <span
          className={['font-semibold text-brand-700', textSizeMap[size]].join(' ')}
          aria-hidden={ACCESSIBILITY.ARIA.HIDDEN}
        >
          {initials}
        </span>
      )}
    </div>
  )
}
