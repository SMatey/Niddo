export const THEME = {
  VARIANTS: {
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    GHOST: 'ghost',
    DANGER: 'danger',
    DEFAULT: 'default',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    BRAND: 'brand',
  },
  SIZES: {
    SM: 'sm',
    MD: 'md',
    LG: 'lg',
    XL: 'xl',
  },
} as const

export type ThemeVariant = (typeof THEME.VARIANTS)[keyof typeof THEME.VARIANTS]
export type ThemeSize = (typeof THEME.SIZES)[keyof typeof THEME.SIZES]
