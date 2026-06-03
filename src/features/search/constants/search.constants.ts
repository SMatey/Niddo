import type { FilterState } from '../types/domain.types'

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
    amenities: 'Amenidades',
    other: 'Otros',
    locationPlaceholder: 'Ciudad, barrio o dirección...',
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

// --- Lifestyle Tag Categories ---
export const LIFESTYLE_CATEGORIES = {
    HABITS: 'habits',
    WORK: 'work',
    SOCIAL: 'social',
    PREFERENCES: 'preferences',
} as const

export type LifestyleCategory = typeof LIFESTYLE_CATEGORIES[keyof typeof LIFESTYLE_CATEGORIES]

// --- Lifestyle Tags (from database) ---
export const LIFESTYLE_TAGS = [
    { id: 'early-bird', label: 'Madrugador', category: 'habits' },
    { id: 'night-owl', label: 'Noctámbulo', category: 'habits' },
    { id: 'clean-freak', label: 'Ordenado', category: 'habits' },
    { id: 'gym-lover', label: 'Fitness', category: 'habits' },
    { id: 'no-smoking', label: 'No fumador', category: 'habits' },
    { id: 'remote-work', label: 'Trabajo Remoto', category: 'work' },
    { id: 'student', label: 'Estudiante', category: 'work' },
    { id: 'social', label: 'Social', category: 'social' },
    { id: 'quiet', label: 'Tranquilo', category: 'social' },
    { id: 'music-lover', label: 'Músico', category: 'social' },
    { id: 'vegan', label: 'Vegano', category: 'preferences' },
    { id: 'pet-friendly', label: 'Pet friendly', category: 'preferences' },
] as const

// --- Label to ID mapping (for converting API label-based lifestyles to IDs) ---
export const LABEL_TO_TAG_ID: Readonly<Record<string, string>> = Object.freeze(
    LIFESTYLE_TAGS.reduce((acc, tag) => {
        acc[tag.label] = tag.id
        return acc
    }, {} as Record<string, string>)
)

// --- Lifestyle Tags Grouped by Category ---
export const LIFESTYLES_BY_CATEGORY: Record<LifestyleCategory, readonly typeof LIFESTYLE_TAGS[number][]> = {
    habits: LIFESTYLE_TAGS.filter((t) => t.category === 'habits'),
    work: LIFESTYLE_TAGS.filter((t) => t.category === 'work'),
    social: LIFESTYLE_TAGS.filter((t) => t.category === 'social'),
    preferences: LIFESTYLE_TAGS.filter((t) => t.category === 'preferences'),
} as const

// --- Category Labels (translated) ---
export const CATEGORY_LABELS: Record<LifestyleCategory, string> = {
    habits: 'Hábitos',
    work: 'Trabajo',
    social: 'Social',
    preferences: 'Preferencias',
} as const

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
    budgetPrefix: 'Presupuesto:',
    close: 'Cerrar',
    viewDetails: 'Ver detalles',
    selectedUbication: 'Ubicación seleccionada: ',
} as const

export const MAP_COORDINATES = {
    SAN_JOSE: {
        lat: 9.9281,
        lng: -84.0907,
    },
} as const

export const MAP_CONFIG = {
    containerStyle: {
        width: '100%',
        height: '500px', // Set a default fixed height to avoid 0px height issues
    },
    defaultCenter: MAP_COORDINATES.SAN_JOSE,
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
    defaultPageSize: 9,
    firstPage: 1,
    bufferThreshold: 2,
} as const

export const PAGINATION_LABELS = {
    previous: 'Anterior',
    next: 'Siguiente',
    ellipsis: '...',
} as const

export const ROUTING_PATHS = {
    PROPERTY_DETAIL: '/propiedad',
    USER_DETAIL: '/usuario',
} as const

export const SEARCH_DEFAULT_FILTERS: FilterState = {
    location: '',
    minPrice: '',
    maxPrice: '',
    minBudget: '',
    maxBudget: '',
    lifestyles: [],
}

export const FILTER_KEYS = {
    LOCATION: 'location',
    MIN_PRICE: 'minPrice',
    MAX_PRICE: 'maxPrice',
    MIN_BUDGET: 'minBudget',
    MAX_BUDGET: 'maxBudget',
    LIFESTYLES: 'lifestyles',
} as const

export const LAYOUT_CONFIG = {
    MAP_HEIGHT_MOBILE: 'calc(100vh - 16rem)',
    MAP_HEIGHT_DESKTOP: 'calc(100vh - 12rem)',
    SKELETON_COUNT: 6,
    DRAWER_MAX_WIDTH: 'max-w-sm',
    INFO_WINDOW_MIN_WIDTH: 'min-w-48',
} as const

export const MAP_VIEW_CONFIG = {
    BOUNDS_DEBOUNCE_MS: 400,
    MAX_MARKERS: 100,
    MAX_LIFESTYLES_IN_INFO_WINDOW: 2,
    SINGLE_POINT_LAT_OFFSET: 0.0055,
    DETAIL_VIEW_ZOOM: 15,
} as const

export const CONTENT_MODES = {
    PROPERTIES: 'properties',
    USERS: 'users',
} as const

export const VIEW_MODES = {
    LIST: 'list',
    MAP: 'map',
} as const

export const CONTENT_MODE_CONFIG = {
    [CONTENT_MODES.PROPERTIES]: {
        tags: AMENITY_TAGS.map((name) => ({ id: name, label: name })),
        tagLabel: FILTER_LABELS.amenities,
        priceFilter: { min: FILTER_KEYS.MIN_PRICE, max: FILTER_KEYS.MAX_PRICE },
        minPrice: 'minPrice' as const,
        maxPrice: 'maxPrice' as const,
    },
    [CONTENT_MODES.USERS]: {
        tags: LIFESTYLE_TAGS,
        tagLabel: FILTER_LABELS.lifestyle,
        priceFilter: { min: FILTER_KEYS.MIN_BUDGET, max: FILTER_KEYS.MAX_BUDGET },
        minPrice: 'minBudget' as const,
        maxPrice: 'maxBudget' as const,
    },
} as const