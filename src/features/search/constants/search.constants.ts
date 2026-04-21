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
} as const

export const FILTER_LABELS = {
    title: 'Filtros',
    location: 'Ubicación',
    budget: 'Presupuesto',
    lifestyle: 'Estilo de vida',
    other: 'Otros',
    locationPlaceholder: 'Ciudad, barrio o dirección...',
    petFriendly: 'Mascotas permitidas',
    smoker: 'Fumador',
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
    'Gimnasio',
    'Piscina',
    'Limpieza',
    'Amueblado',
    'Aire acondicionado',
    'Calefacción',
    'Internet fiber',
    'Estacionamiento',
    'Seguridad 24h',
    'Terraza',
    'Balcón',
    'Lavadora',
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
