'use client'

import { Button } from '@/shared/components/Button/Button'
import { THEME } from '@/shared/constants/theme.constants'
import { AUTH } from '@/features/auth/constants/auth.constants'
import styles from './OAuthButtons.module.css'

export function OAuthButtons() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.divider}>
        <span>{AUTH.UI.OAUTH_DIVIDER}</span>
      </div>
      <Button variant={THEME.VARIANTS.SECONDARY} fullWidth type="button">
        {AUTH.UI.GOOGLE}
      </Button>
    </div>
  )
}
