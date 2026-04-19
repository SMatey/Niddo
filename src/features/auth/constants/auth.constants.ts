export const AUTH = {
  MIN_PASSWORD_LENGTH: 8,
  RATE_LIMIT_COOLDOWN_SECONDS: 30,
  ERROR_KEYS: {
    ROOT: 'root',
  },
  PROVIDERS: {
    GOOGLE: 'google',
  },
  VALIDATION: {
    NAME_MIN: 'El nombre debe tener al menos 2 caracteres.',
    EMAIL_INVALID: 'Ingresa un correo electronico valido.',
    PASSWORD_MIN: 'La contrasena debe tener al menos 8 caracteres.',
    PASSWORDS_DO_NOT_MATCH: 'Las contrasenas no coinciden.',
  },
  PLACEHOLDERS: {
    FULL_NAME: 'Tu nombre completo',
    EMAIL: 'tu@email.com',
    PASSWORD: '********',
    NEW_PASSWORD: 'Nueva contrasena',
    CONFIRM_PASSWORD: 'Confirmar contrasena',
  },
  UI: {
    LOGIN_TITLE: 'Inicia sesion en Niddo',
    LOGIN_SUBTITLE: 'Accede a tus conversaciones, favoritos y publicaciones.',
    REGISTER_TITLE: 'Crea tu cuenta en Niddo',
    REGISTER_SUBTITLE: 'Registra tus datos para encontrar roomie o vivienda ideal.',
    LABEL_FULL_NAME: 'Nombre completo',
    LABEL_EMAIL: 'Correo electronico',
    LABEL_PASSWORD: 'Contrasena',
    LABEL_NEW_PASSWORD: 'Nueva contrasena',
    LABEL_CONFIRM_PASSWORD: 'Confirmar contrasena',
    LINK_FORGOT_PASSWORD: 'Olvidaste tu contrasena?',
    LINK_REGISTER: 'Crear cuenta',
    LINK_LOGIN: 'Ya tengo cuenta',
    LOGIN_SUBMIT: 'Iniciar sesion',
    REGISTER_SUBMIT: 'Crear cuenta',
    GOOGLE_SIGN_IN: 'Continuar con Google',
    OR_SEPARATOR: 'o',
    LOADING_LABEL: 'Cargando...',
    VERIFY_EMAIL_TITLE: 'Revisa tu correo',
    VERIFY_EMAIL_SUBTITLE: 'Te enviamos un enlace de verificacion.',
    VERIFY_EMAIL_HINT:
      'Si no lo ves, revisa spam o vuelve a enviar el correo de verificacion.',
    VERIFY_EMAIL_RESEND: 'Reenviar correo de verificacion',
    VERIFY_EMAIL_RESEND_SUCCESS: 'Correo de verificacion reenviado correctamente.',
    VERIFY_EMAIL_RESEND_MISSING_EMAIL:
      'No encontramos tu correo en la URL. Vuelve a registrarte para reenviar la verificacion.',
    VERIFY_EMAIL_RESEND_COOLDOWN:
      'Espera {seconds} segundos antes de reenviar el correo.',
    FORGOT_PASSWORD_TITLE: 'Recuperar contrasena',
    FORGOT_PASSWORD_SUBTITLE:
      'Ingresa tu correo y te enviaremos un enlace seguro para restablecerla.',
    FORGOT_PASSWORD_SUBMIT: 'Enviar enlace de recuperacion',
    FORGOT_PASSWORD_SUCCESS:
      'Si el correo existe, enviamos un enlace temporal para restablecer tu contrasena.',
    RESET_PASSWORD_TITLE: 'Restablecer contrasena',
    RESET_PASSWORD_SUBTITLE: 'Define una nueva contrasena para recuperar tu acceso.',
    RESET_PASSWORD_SUBMIT: 'Guardar nueva contrasena',
    RESET_PASSWORD_SUCCESS: 'Tu contrasena se actualizo correctamente.',
    RECOVERY_TOKEN_INVALID:
      'El token de recuperacion es invalido o vencio. Solicita un nuevo enlace.',
    BACK_TO_LOGIN: 'Volver a iniciar sesion',
    GOOGLE_RECOVERY_HINT:
      'Si iniciaste con Google, utiliza el boton de Google para acceder directamente.',
  },
  MESSAGES: {
    LOGIN_SUCCESS: 'Inicio de sesion exitoso.',
    REGISTER_SUCCESS: 'Cuenta creada. Revisa tu correo para verificar tu acceso.',
    GOOGLE_PROVIDER_DISABLED:
      'Google no esta habilitado en Supabase para este proyecto. Activalo en Auth > Providers > Google y configura Client ID/Secret.',
    GENERIC_ERROR: 'Ocurrio un problema. Intenta nuevamente.',
  },
} as const

export type AuthTab = 'login' | 'register'
