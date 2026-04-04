'use client'

import { Button } from '@/shared/components/Button/Button'
import { THEME } from '@/shared/constants/theme.constants'
import { AUTH } from '@/features/auth/constants/auth.constants'
import { ROUTES } from '@/shared/constants/routes.constants'
import { useAuth } from '@/features/auth/hooks/useAuth'
import styles from './OAuthButtons.module.css'

interface OAuthButtonsProps {
  mode?: 'sign-in' | 'sign-up'
}

export function OAuthButtons({ mode = 'sign-in' }: OAuthButtonsProps) {
  const { signInWithGoogle, isLoading } = useAuth()
  const buttonLabel = mode === 'sign-up' ? AUTH.UI.GOOGLE_SIGN_UP : AUTH.UI.GOOGLE_SIGN_IN

  const handleGoogleAuth = async () => {
    await signInWithGoogle(ROUTES.DASHBOARD)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.divider}>
        <span>{AUTH.UI.OAUTH_DIVIDER}</span>
      </div>
      <Button
        variant={THEME.VARIANTS.SECONDARY}
        fullWidth
        type="button"
        onClick={handleGoogleAuth}
        isLoading={isLoading}
      >
        {buttonLabel}
      </Button>
    </div>
  )
}
