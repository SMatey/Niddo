import type { ReviewReportReasonType, ReviewReportTargetType } from '@/features/reviews/types/report-form.types'

export const REPORT_REASON_OPTIONS: ReadonlyArray<{
  value: ReviewReportReasonType
  label: string
  helper: string
}> = [
  {
    value: 'suspicious_behavior',
    label: 'Comportamiento sospechoso',
    helper: 'Usa esta opcion si detectaste una conducta insegura o irregular.',
  },
  {
    value: 'fake_review',
    label: 'Resena falsa',
    helper: 'Usa esta opcion si crees que una resena fue inventada o manipulada.',
  },
] as const

export const REPORT_FORM = {
  IDENTIFIERS: {
    REPORT_PREFIX: 'report',
  },
  MODERATION: {
    FALLBACK_AUTO_HIDE_THRESHOLD: 3,
  },
  DESCRIPTION: {
    MIN_LENGTH: 12,
    MAX_LENGTH: 500,
    TEXTAREA_ROWS: 5,
  },
  UI: {
    TRIGGER: 'Reportar irregularidad',
    TITLE: 'Reportar irregularidad',
    SUBTITLE: 'Ayudanos a revisar comportamientos sospechosos o resenas posiblemente falsas.',
    REASON_LABEL: 'Motivo del reporte',
    DESCRIPTION_LABEL: 'Detalle del reporte',
    DESCRIPTION_PLACEHOLDER:
      'Explica lo que detectaste para que podamos revisar el caso con mayor contexto.',
    DESCRIPTION_HELPER: 'Incluye detalles concretos para facilitar la revision.',
    COUNTER_SUFFIX: 'caracteres',
    CANCEL: 'Cancelar',
    SUBMIT: 'Enviar reporte',
    SUBMITTING: 'Enviando...',
    SUCCESS: 'Tu reporte fue enviado correctamente.',
    SUCCESS_HIDDEN:
      'Tu reporte fue enviado y el contenido quedo oculto temporalmente mientras revisamos el caso.',
    ERROR: 'No pudimos registrar el reporte. Intenta nuevamente.',
    DUPLICATE: 'Ya enviaste un reporte similar para este caso.',
    MODERATION_ERROR: 'No pudimos validar el estado de moderacion del contenido.',
    TARGET_LABEL: 'Caso a reportar',
    PROFILE_TARGET: 'Perfil',
    PROPERTY_TARGET: 'Propiedad',
    REVIEW_TARGET: 'Resena',
    HIDDEN_TITLE: 'Contenido temporalmente oculto',
    HIDDEN_DESCRIPTION:
      'Este contenido supero el limite de reportes y no esta disponible mientras el equipo revisa el caso.',
    HIDDEN_HELPER: 'Podras volver a consultarlo cuando termine la revision.',
    BACK_TO_PREVIOUS: 'Volver',
  },
  VALIDATION: {
    REASON_REQUIRED: 'Selecciona un motivo para el reporte.',
    DESCRIPTION_MIN: 'El detalle del reporte debe tener al menos 12 caracteres.',
    DESCRIPTION_MAX: 'El detalle del reporte no puede superar 500 caracteres.',
  },
} as const

export const REPORT_TARGET_LABELS: Record<ReviewReportTargetType, string> = {
  profile: REPORT_FORM.UI.PROFILE_TARGET,
  property: REPORT_FORM.UI.PROPERTY_TARGET,
  review: REPORT_FORM.UI.REVIEW_TARGET,
}

export const DEFAULT_REPORT_REASON: ReviewReportReasonType = REPORT_REASON_OPTIONS[0].value

export const getModeratedContentLabel = (targetType: ReviewReportTargetType) =>
  REPORT_TARGET_LABELS[targetType].toLowerCase()
