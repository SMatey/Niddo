import type { NotificationCategory, NotificationFilter } from '../types/notification.types'

export const NOTIFICATIONS_FILTERS: Array<{ id: NotificationFilter; label: string }> = [
  { id: 'all', label: 'Todas' },
  { id: 'unread', label: 'Sin leer' },
  { id: 'read', label: 'Leídas' },
]

export const NOTIFICATIONS_COPY = {
  TITLE: 'Notificaciones',
  DESCRIPTION: 'Revisa la actividad reciente, mensajes y avisos importantes desde un solo lugar.',
  ACTIONS: {
    MARK_ALL_AS_READ: 'Marcar todo como leído',
    RESET_DEMO: 'Restablecer demo',
    OPEN: 'Abrir',
    MARK_AS_READ: 'Marcar como leído',
  },
  STATS: {
    TOTAL: 'Total',
    UNREAD: 'Sin leer',
    READ: 'Leídas',
  },
  FILTERS: {
    LABEL: 'Filtrar por estado',
  },
  EMPTY_STATE: {
    TITLE: 'No tienes notificaciones en esta vista',
    DESCRIPTION: 'Cuando llegue nueva actividad, aparecerá aquí para que la revises sin salir de la app.',
  },
  CATEGORY_LABELS: {
    message: 'Mensaje',
    favorite: 'Favorito',
    system: 'Sistema',
    alert: 'Alerta',
  } satisfies Record<NotificationCategory, string>,
  DEMO_NOTIFICATIONS: {
    NEW_MESSAGE: {
      TITLE: 'Nuevo mensaje en tu publicación',
      DESCRIPTION: 'Una persona interesada respondió a tu anuncio “Departamento en Palermo”.',
    },
    NEW_FAVORITE: {
      TITLE: 'Guardaron tu propiedad',
      DESCRIPTION: 'Tu anuncio “Casa luminosa en Belgrano” recibió un nuevo favorito.',
    },
    SYSTEM_UPDATE: {
      TITLE: 'Actualización del sistema',
      DESCRIPTION: 'Mejoramos la organización de tus alertas para que encuentres todo más rápido.',
    },
    ALERT: {
      TITLE: 'Acción requerida',
      DESCRIPTION: 'Completa tu perfil para destacar mejor tu actividad dentro de la plataforma.',
    },
  },
} as const

export const NOTIFICATION_DEMO_LIMITS = {
  MILLISECONDS_PER_MINUTE: 60_000,
  MINUTES_PER_HOUR: 60,
  HOURS_PER_DAY: 24,
} as const

export const NOTIFICATION_DEMO_TIME_OFFSETS = {
  TEN_MINUTES: 10,
  FORTY_FIVE_MINUTES: 45,
  THREE_HOURS: NOTIFICATION_DEMO_LIMITS.MINUTES_PER_HOUR * 3,
  ONE_DAY: NOTIFICATION_DEMO_LIMITS.MINUTES_PER_HOUR * NOTIFICATION_DEMO_LIMITS.HOURS_PER_DAY,
  TWO_DAYS: NOTIFICATION_DEMO_LIMITS.MINUTES_PER_HOUR * NOTIFICATION_DEMO_LIMITS.HOURS_PER_DAY * 2,
} as const