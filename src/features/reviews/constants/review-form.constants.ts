import type { ReviewTargetType } from '@/features/reviews/types/review-form.types'

export const REVIEW_TARGET_TYPES = {
  PROFILE: 'profile',
  PROPERTY: 'property',
} as const

export const buildProfileDetailPath = (profileId: string) => `/usuario/${profileId}`

export const buildPropertyDetailPath = (propertyId: string) => `/propiedad/${propertyId}`

export const REVIEW_FORM = {
  IDENTIFIERS: {
    REVIEW_PREFIX: 'review',
  },
  RATING: {
    MIN: 1,
    MAX: 5,
    DEFAULT: 0,
    LABELS: ['Muy mala', 'Mala', 'Regular', 'Buena', 'Excelente'] as const,
  },
  CONTENT: {
    MIN_LENGTH: 20,
    MAX_LENGTH: 500,
    TEXTAREA_ROWS: 6,
  },
  TRUST: {
    MIN: 0,
    MAX: 100,
    HIGHLIGHT_MIN: 80,
    HIGH_MIN: 60,
    MEDIUM_MIN: 40,
    RATING_MIN: 1,
    RATING_MAX: 5,
    BASELINE_RATING: 3.5,
    DEFAULT_REVIEW_WEIGHT: 1,
    VERIFIED_REVIEW_WEIGHT: 1.25,
    FULL_CONFIDENCE_WEIGHT: 6,
  },
  UI: {
    LOADING: 'Cargando formulario...',
    LOAD_ERROR: 'No pudimos preparar la resena. Intenta nuevamente.',
    LOGIN_REQUIRED: 'Inicia sesion para compartir tu experiencia con la comunidad.',
    PROFILE_REQUIRED: 'Completa tu perfil antes de publicar una resena.',
    SUBMIT: 'Publicar resena',
    SUBMITTING: 'Publicando...',
    SUCCESS: 'Tu resena se publico y quedo asociada al perfil correspondiente.',
    SAVE_ERROR: 'No pudimos guardar tu resena. Intenta nuevamente.',
    FIELDSET_TITLE: 'Tu experiencia',
    RATING_LABEL: 'Calificacion general',
    RATING_HELPER: 'Selecciona de 1 a 5 estrellas segun tu experiencia.',
    CONTENT_LABEL: 'Cuentanos que paso',
    CONTENT_PLACEHOLDER:
      'Describe como fue la convivencia, el trato, la propiedad o cualquier detalle que ayude a otros usuarios.',
    CONTENT_HELPER: 'Comparte detalles honestos y utiles para la comunidad.',
    VERIFIED_LABEL: 'Confirmo que convivimos o que mi experiencia fue real',
    VERIFIED_HELPER: 'La resena solo se publica cuando confirmas la convivencia o la experiencia real.',
    COUNTER_SUFFIX: 'caracteres',
    BACK: 'Volver',
    GO_TO_LOGIN: 'Ir a login',
    GO_TO_PROFILE: 'Completar mi perfil',
    GO_TO_TARGET: 'Volver al detalle',
    OPEN_FORM: 'Escribir reseña',
    UNKNOWN_LOCATION: 'Ubicacion no especificada',
    PROFILE_SELF_REVIEW: 'No puedes publicar una resena sobre tu propio perfil.',
    PROPERTY_SELF_REVIEW: 'No puedes publicar una resena sobre tu propia propiedad.',
    DUPLICATE_PROFILE_REVIEW: 'Ya compartiste una resena para este roomie.',
    DUPLICATE_PROPERTY_REVIEW: 'Ya compartiste una resena para el perfil asociado a esta propiedad.',
    PROFILE_BADGE: 'Resena para roomie',
    PROPERTY_BADGE: 'Resena para propiedad',
    PROFILE_ASSOCIATION_TITLE: 'Perfil donde se publicara la resena',
    PROFILE_ASSOCIATION_HELPER:
      'La comunidad vera esta opinion asociada al perfil correspondiente despues de confirmar la convivencia.',
    VERIFIED_PROFILE_LABEL: 'Perfil verificado',
    TRUST_TITLE: 'Confianza del perfil',
    TRUST_HELPER: 'Este indicador te ayuda a identificar rapidamente a los usuarios mejor valorados.',
    TRUST_LEVEL_TOP: 'Perfil destacado',
    TRUST_LEVEL_HIGH: 'Alta confianza',
    TRUST_LEVEL_MEDIUM: 'Confianza media',
    TRUST_LEVEL_LOW: 'Confianza inicial',
  },
  VALIDATION: {
    RATING_REQUIRED: 'Selecciona una calificacion entre 1 y 5 estrellas.',
    CONTENT_MIN: 'La resena debe tener al menos 20 caracteres.',
    CONTENT_MAX: 'La resena no puede superar 500 caracteres.',
    VERIFIED_REQUIRED: 'Confirma la convivencia para asociar la resena al perfil correspondiente.',
  },
  TARGET_COPY: {
    profile: {
      title: 'Comparte tu experiencia con este roomie',
      subtitle: 'Tu opinion quedara asociada a su perfil y ayudara a otros usuarios a decidir mejor.',
      badge: 'Resena para roomie',
    },
    property: {
      title: 'Comparte tu experiencia con esta propiedad',
      subtitle:
        'Tras confirmar la convivencia, tu resena se asociara al perfil responsable de esta propiedad.',
      badge: 'Resena para propiedad',
    },
  },
} as const

export const getReviewTargetCopy = (targetType: ReviewTargetType) => REVIEW_FORM.TARGET_COPY[targetType]
