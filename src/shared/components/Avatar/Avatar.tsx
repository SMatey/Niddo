import Image from 'next/image'
import { THEME, type ThemeSize } from '@/shared/constants/theme.constants'
import { ACCESSIBILITY } from '@/shared/constants/accessibility.constants'
import styles from './Avatar.module.css'

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
  const initials = alt
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div
      className={[styles.avatar, styles[size], className ?? ''].filter(Boolean).join(' ')}
      style={{ width: px, height: px }}
    >
      {src ? (
        <Image src={src} alt={alt} width={px} height={px} className={styles.image} />
      ) : (
        <span className={styles.initials} aria-hidden={ACCESSIBILITY.ARIA.HIDDEN}>
          {initials}
        </span>
      )}
    </div>
  )
}
