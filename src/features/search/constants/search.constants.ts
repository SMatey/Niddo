export const CARD_LABELS = {
    noImage: 'Sin imagen',
    bedroom: 'hab',
    bathroom: 'baños',
    squareMeter: 'm²',
    verified: 'Verificado',
    confidence: 'Confianza',
    years: 'años',
    from: 'Desde',
    upTo: 'Hasta',
    noMapPoints: 'No hay puntos geográficos para mostrar en el mapa',
    noResults: 'No hay resultados para mostrar',
    petAllowed: 'Mascotas permitidas',
    noPets: 'No mascotas',
    noSmokers: 'No fumadores',
    smoker: 'Fumadores',
} as const

export const FILTER_LABELS = {
    title: 'Filtros',
    location: 'Ubicación',
    budget: 'Presupuesto',
    lifestyle: 'Estilo de vida',
    other: 'Otros',
    locationPlaceholder: 'Ciudad, barrio o dirección...',
    petFriendly: 'Solo mascotas permitidas',
    smoker: 'Solo no fumar',
    clearFilters: 'Limpiar filtros',
    filtersButton: 'Filtros',
    closeFilters: 'Cerrar',
    activeFilters: 'filtros activos',
} as const

export const RESULTS_TABS = {
    content: [
        { label: 'Propiedades', value: 'properties' },
        { label: 'Usuarios', value: 'users' },
    ],
    view: [
        { label: 'Lista', value: 'list' },
        { label: 'Mapa', value: 'map' },
    ],
} as const

export const LIFESTYLES = [
    'Ordenado',
    'Madrugador',
    'Fitness',
    'Músico',
    'Noctámbulo',
    'Tranquilo',
    'Trabajo Remoto',
    'Social',
    'Estudiante',
    'Vegano',
] as const

export const AMENITY_TAGS = [
    'WiFi',
    'Terraza',
    'Lavadora',
    'Lavandería',
    'Cocina',
    'Cocina equipada',
    'Gimnasio',
    'Alberca',
    'Aire acondicionado',
    'Estacionamiento',
    'Roof garden',
    'Jardín común',
    'Concierge',
    'Seguridad 24/7',
    'Pet friendly',
    'Closet',
    'Escritorio',
    'Vista panorámica',
    'Business Center',
    'Netflix',
    'Balcón',
    'Ascensor',
    'Amueblado',
    'No fumar',
] as const

export const MAP_LABELS = {
    apiKeyMissing: 'Google Maps API key no configurada',
    loading: 'Cargando mapa...',
    loadError: 'Error al cargar el mapa',
} as const

export const MAP_CONFIG = {
    containerStyle: {
        width: '100%',
        height: '100%',
    },
    defaultCenter: {
        lat: 9.9281,
        lng: -84.0907,
    },
    defaultZoom: 12,
    options: {
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
    } as google.maps.MapOptions,
} as const

export const PAGE_LABELS = {
    explorarTitle: 'Explorar',
} as const

export const BADGE_VARIANTS = {
    success: {
        bgClass: 'bg-green-100',
        textClass: 'text-green-700',
        borderClass: 'border-green-200',
    },
    info: {
        bgClass: 'bg-blue-100',
        textClass: 'text-blue-700',
        borderClass: 'border-blue-200',
    },
    warning: {
        bgClass: 'bg-amber-100',
        textClass: 'text-amber-700',
        borderClass: 'border-amber-200',
    },
} as const

export const BADGE_CLASSES = {
    base: 'inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full border',
} as const

export const PAGINATION_CLASSES = {
    container: 'flex items-center justify-center gap-2 py-4',
    buttonBase: 'px-3 py-2 text-sm border border-border rounded-lg hover:bg-surface-muted',
    buttonActive: 'px-3 py-2 text-sm border rounded-lg bg-brand-600 text-white border-brand-600',
    buttonDisabled: 'px-3 py-2 text-sm border border-border rounded-lg opacity-50 cursor-not-allowed',
    ellipsis: 'px-2 py-2 text-text-muted',
} as const

export const PAGINATION_CONFIG = {
    maxVisiblePages: 5,
} as const

export const PAGINATION_LABELS = {
    previous: 'Anterior',
    next: 'Siguiente',
    ellipsis: '...',
} as const
