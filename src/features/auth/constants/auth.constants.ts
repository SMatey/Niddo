export const AUTH = {
  MIN_PASSWORD_LENGTH: 8,
  MIN_NAME_LENGTH: 2,
  VALIDATION: {
    EMAIL_INVALID: 'Email inválido',
    PASSWORD_MIN_6: 'Mínimo 6 caracteres',
    PASSWORD_MIN_8: 'Mínimo 8 caracteres',
    NAME_TOO_SHORT: 'Nombre demasiado corto',
  },
  UI: {
    LOGIN_TITLE: 'Iniciar sesión',
    LOGIN_SUBTITLE: 'Bienvenido de vuelta',
    LOGIN_SUBMIT: 'Iniciar sesión',
    REGISTER_TITLE: 'Crear cuenta',
    REGISTER_SUBTITLE: 'Empieza a encontrar tu roomie ideal',
    REGISTER_SUBMIT: 'Crear cuenta',
    OAUTH_DIVIDER: 'o continúa con',
  },
  PLACEHOLDERS: {
    EMAIL: 'tu@email.com',
    PASSWORD: '••••••••',
    PASSWORD_HINT: 'Mínimo 8 caracteres',
    FULL_NAME: 'Ana García',
  },
} as const
