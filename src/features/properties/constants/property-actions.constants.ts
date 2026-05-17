export const PROPERTY_ACTIONS_MESSAGES = {
  errors: {
    unauthorized: 'Usuario no autenticado',
    creationFailed: 'Error al crear la propiedad: ',
    unexpectedError: 'Error inesperado al crear la propiedad',
    unexpectedProcessing: 'Error inesperado al procesar tu solicitud',
    noImages: 'Sube al menos una foto del inmueble antes de publicar.',
    NoUploadedImages: 'No se pudieron subir las imágenes. Intenta nuevamente.',
    noAmenities: 'Selecciona al menos una amenidad para tu publicación.',
  },
  status: {
    active: 'active',
  },
  labels : {
    propieties: 'properties',
    propietiesImages: 'property-media',
  }
} as const
