export const PROPERTY_PUBLICATION_LABELS = {
  pageTitle: 'Publicar nueva propiedad',
  pageSubtitle:
    'Completa todos los datos, marca la ubicación en el mapa y sube fotos antes de publicar.',
  sectionTitles: {
    basicInfo: 'Información básica',
    location: 'Ubicación del inmueble',
    photos: 'Fotos del lugar',
    amenities: 'Amenidades y lo que ofrece',
    houseRules: 'Normas de convivencia',
    availability: 'Fechas de disponibilidad',
    preview: 'Vista previa',
  },
  labels: {
    title: 'Título de la publicación',
    price: 'Precio aproximado',
    location: 'Dirección o zona',
    description: '¿Qué ofrece el inmueble?',
    bedrooms: 'Habitaciones',
    bathrooms: 'Baños',
    squareMeters: 'Metros²',
    amenityInput: 'Añadir amenidad',
    ruleInput: 'Añadir norma',
    availableFrom: 'Disponible desde',
    availableTo: 'Disponible hasta',
    mapCoordinates: 'Coordenadas',
    navigationLink: 'Abrir en Google Maps',
    images: 'Sube fotos del inmueble',
    uploadInstructions:
      'Arrastra las fotos aquí o haz clic para seleccionar. Puedes reordenar y eliminar antes de publicar.',
    mapInstructions:
      'Haz clic en el mapa para marcar la ubicación exacta. Se guardarán las coordenadas y se generará un enlace de navegación.',
  },
  placeholders: {
    title: 'Apartamento mediano 2 habitaciones',
    price: '$850/mes',
    location: 'San José, Costa Rica',
    description:
      'Incluye limpieza semanal, internet estable y acceso a áreas comunes.',
    amenityInput: 'Ej. Piscina, Internet, Estacionamiento',
    ruleInput: 'Ej. No fumar dentro de la propiedad',
  },
  buttons: {
    submit: 'Publicar propiedad',
    addAmenity: 'Añadir amenidad',
    addRule: 'Añadir norma',
    useCurrentLocation: 'Usar mi ubicación actual',
    removePhoto: 'Eliminar foto',
  },
  helpers: {
    dateHint:
      'Las fechas se ocultan automáticamente cuando expiran para evitar solicitudes en inmuebles no disponibles.',
    expiredAvailability:
      'La fecha de fin seleccionada ya pasó. Actualiza la disponibilidad para publicar.',
    coordinatesMissing:
      'Selecciona un punto en el mapa para generar coordenadas de navegación.',
    imageLimit: 'Puedes subir hasta 10 imágenes.',
  },
  validation: {
    titleRequired: 'El título debe tener al menos 10 caracteres.',
    priceRequired: 'El precio es obligatorio.',
    locationRequired: 'La ubicación es obligatoria.',
    availableFromRequired: 'Selecciona la fecha de inicio.',
    availableToRequired: 'Selecciona la fecha de fin.',
    coordinatesRequired:
      'Marca la ubicación en el mapa para guardar coordenadas.',
  },
} as const

export const PROPERTY_PUBLICATION_CONFIG = {
  maxImages: 10,
  maxAmenities: 12,
  maxRules: 12,
} as const

export const PROPERTY_PUBLICATION_SUGGESTIONS = {
  amenities: [
    'Piscina',
    'Gimnasio',
    'Internet',
    'Aire acondicionado',
    'Estacionamiento',
    'Terraza',
    'Seguridad 24h',
    'Lavadora',
  ] as const,
} as const
