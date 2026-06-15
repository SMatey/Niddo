export const SETTINGS_MENU = [
  {
    id: 'profile',
    label: 'Editar Perfil',
    icon: 'user',
  },
  {
    id: 'verification',
    label: 'Verificación',
    icon: 'check-circle',
  },
  {
    id: 'preferences',
    label: 'Preferencias',
    icon: 'sliders',
  },
  {
    id: 'privacy',
    label: 'Privacidad',
    icon: 'lock',
  },
]

export const VALID_SECTIONS = ['profile', 'verification', 'preferences', 'privacy'] as const

export const SETTINGS_LABELS = {
  EDIT_PROFILE: {
    SECTION_TITLE: 'Editar Perfil',
    SECTION_SUBTITLE: 'Actualiza tu información personal',
    DEVELOPMENT: 'Sección en desarrollo',
  },
  PRIVACY: {
    SECTION_TITLE: 'Privacidad',
    SECTION_SUBTITLE: 'Controla tu privacidad y datos',
    DEVELOPMENT: 'Sección en desarrollo',
  },
}

export const SETTINGS_CONFIG = {
  TITLE: 'Configuración',
  DESCRIPTION: 'Administra tu perfil y preferencias',
}

export const VERIFICATION_LABELS = {
  SECTION_TITLE: 'Verificación de Identidad',
  SECTION_SUBTITLE: 'Verifica tu identidad para aumentar tu nivel de confianza',
  CURRENT_STATUS: 'Estado actual',
  STATUS_VERIFIED: 'Tu identidad ha sido verificada',
  ACCEPTED_DOCS: 'Documentos aceptados',
  DOC_INE: 'INE / IFE vigente',
  DOC_PASSPORT: 'Pasaporte mexicano vigente',
  DOC_LICENSE: 'Licencia de conducir vigente',
  REVIEW_NOTICE: 'Tu documento será revisado en un plazo de 24-48 horas. La información se maneja de forma segura y confidencial.',
  UPLOAD_ERROR: 'Error al subir documento',
  CLOSE_MODAL: 'Cerrar modal',
  SELECT_FILE: 'Seleccionar archivo',
}
