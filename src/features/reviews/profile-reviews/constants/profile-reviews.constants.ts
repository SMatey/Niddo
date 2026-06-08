export const PROFILE_REVIEWS_COPY = {
  SECTION: {
    EYEBROW: 'Reseñas del perfil',
    TITLE: 'Lo que la comunidad dice',
    DESCRIPTION:
      'Opiniones recientes sobre la convivencia y la experiencia con este usuario.',
    COUNT_SINGULAR: 'reseña',
    COUNT_SUFFIX: 'reseñas',
  },
  STATES: {
    LOADING: 'Cargando reseñas...',
    ERROR: 'No pudimos cargar las reseñas del perfil. Intenta nuevamente.',
    EMPTY_TITLE: 'Todavia no hay reseñas',
    EMPTY_DESCRIPTION:
      'Cuando la comunidad comparta su experiencia con este perfil, las opiniones apareceran aqui.',
    REFRESH: 'Reintentar',
  },
  REVIEW: {
    VERIFIED_STAY: 'Convivencia confirmada',
    RATING_LABEL: 'Calificacion',
    DATE_FALLBACK: 'Fecha no disponible',
    CONTENT_FALLBACK: 'Sin comentario adicional.',
    VERIFIED_BADGE: 'Verificado',
  },
} as const

export const PROFILE_REVIEWS_LIMITS = {
  MAX_STARS: 5,
  SKELETON_COUNT: 3,
} as const

export const PROFILE_REVIEWS_DATE_FORMAT = {
  LOCALE: 'es-MX',
  OPTIONS: {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  } as const,
} as const