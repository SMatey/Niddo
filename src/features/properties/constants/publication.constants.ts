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
    availability: 'Disponibilidad de la propiedad',
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
    mapCoordinates: 'Coordenadas',
    navigationLink: 'Abrir en Google Maps',
    images: 'Sube fotos del inmueble',
    uploadInstructions:
      'Arrastra las fotos aquí o haz clic para seleccionar. Puedes reordenar y eliminar antes de publicar.',
    mapInstructions:
      'Haz clic en el mapa para marcar la ubicación exacta. Se guardarán las coordenadas y se generará un enlace de navegación.',
    dragHandle: 'Arrastrar',
    imageAltPrefix: 'Foto',
  },
  placeholders: {
    title: 'Apartamento mediano 2 habitaciones',
    price: '450,000/mes',
    priceExample: '450,000',
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
    publishing: 'Publicando...',
  },
  helpers: {
    dateHint:
      'La propiedad estará disponible a partir de la fecha que especifiques.',
    coordinatesMissing:
      'Selecciona un punto en el mapa para generar coordenadas de navegación.',
    noCoordinatesSelected: 'No hay coordenadas seleccionadas.',
    imageLimit: 'Puedes subir hasta 10 imágenes.',
    amenitiesDescription: 'Selecciona las amenidades que ofrece el inmueble',
    houseRulesDescription: 'Define las normas de convivencia del inmueble.',
    rulesExample: 'Agrega reglas como no fumar, no fiestas o limpieza de mascotas.',
    noRulesDefined: 'Aún no hay normas definidas.',
  },
  validation: {
    titleRequired: 'El título debe tener al menos 10 caracteres.',
    priceRequired: 'El precio es obligatorio.',
    locationRequired: 'La ubicación es obligatoria.',
    availableFromRequired: 'Selecciona la fecha de inicio.',
    coordinatesRequired:
      'Marca la ubicación en el mapa para guardar coordenadas.',
  },
  previewLabels: {
    title: 'Título',
    approximatePrice: 'Precio aproximado',
    location: 'Ubicación',
    availabilityDates: 'Fechas de disponibilidad',
    availabilityDate: 'Disponible desde',
    selectValidRange: 'Disponible desde',
    navigationLink: 'Enlace de navegación',
    viewInGoogleMaps: 'Ver en Google Maps',
    activeRules: 'Normas activas',
    selectedAmenities: 'Amenidades seleccionadas',
  },
  messages: {
    success: '✓ ¡Propiedad publicada correctamente! Ahora aparecerá en el catálogo.',
  },
} as const

export const PROPERTY_PUBLICATION_CONFIG = {
  maxImages: 10,
  maxAmenities: 12,
  maxRules: 12,
} as const

export const AMENITIES_CATALOG = {
  facilities: {
    label: 'Instalaciones',
    items: [
      { id: 'wifi', label: 'WiFi' },
      { id: 'ac', label: 'Aire acondicionado' },
      { id: 'heating', label: 'Calefacción' },
      { id: 'washer', label: 'Lavadora' },
      { id: 'dryer', label: 'Secadora' },
      { id: 'dishwasher', label: 'Lavavajillas' },
      { id: 'oven', label: 'Horno' },
      { id: 'fridge', label: 'Refrigerador' },
    ],
  },
  outdoor: {
    label: 'Espacios exteriores',
    items: [
      { id: 'balcony', label: 'Balcón' },
      { id: 'terrace', label: 'Terraza' },
      { id: 'garden', label: 'Jardín' },
      { id: 'patio', label: 'Patio' },
      { id: 'pool', label: 'Piscina' },
    ],
  },
  amenities: {
    label: 'Amenidades',
    items: [
      { id: 'gym', label: 'Gimnasio' },
      { id: 'parking', label: 'Estacionamiento' },
      { id: 'security-24h', label: 'Seguridad 24h' },
      { id: 'concierge', label: 'Concierge' },
      { id: 'roofgarden', label: 'Roof Garden' },
      { id: 'lounge', label: 'Sala de estar común' },
      { id: 'playground', label: 'Área de juegos' },
      { id: 'business-center', label: 'Business Center' },
    ],
  },
  pet_policy: {
    label: 'Mascotas',
    items: [
      { id: 'pet-friendly', label: 'Mascotas permitidas' },
      { id: 'no-pets', label: 'Sin mascotas' },
    ],
  },
} as const

export const PROPERTY_PUBLICATION_SUGGESTIONS = {
  amenities: [
    'WiFi',
    'Aire acondicionado',
    'Estacionamiento',
    'Seguridad 24h',
    'Piscina',
    'Gimnasio',
    'Terraza',
    'Lavadora',
  ] as const,
} as const

// Helper para obtener todas las amenidades planas
export const getAllAmenities = () => {
  const all: Array<{ id: string; label: string }> = []
  Object.values(AMENITIES_CATALOG).forEach((category) => {
    all.push(...category.items)
  })
  return all
}
