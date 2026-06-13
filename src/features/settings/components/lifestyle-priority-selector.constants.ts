export const PRIORITY_SELECTOR_LABELS = {
  SECTION_TITLE: 'Preferencias de Roomie',
  SECTION_SUBTITLE: 'Establece qué cualidades son importantes para ti',
  LOADING: 'Cargando preferencias...',
  SAVE_CHANGES: 'Guardar cambios',
  SAVED: 'Guardado',
  RESET: 'Restablecer',
  ERROR_PREFIX: 'Error: ',
} as const

export const IMPORTANCE_OPTION_LABELS: Record<string, string> = {
  'must-have': 'Imprescindible',
  'important': 'Importante',
  'nice-to-have': 'Deseable',
  'indifferent': 'Indiferente',
} as const