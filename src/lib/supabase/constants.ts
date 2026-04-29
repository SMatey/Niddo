export const SUPABASE_HEADERS = {
    API_KEY: 'apikey',
    AUTHORIZATION: 'Authorization',
    BEARER: 'Bearer',
} as const

export const SUPABASE_ENDPOINTS = {
    FUNCTIONS: {
        PROPERTIES_SEARCH: '/functions/v1/properties-search',
        PROPERTY_DETAIL: '/functions/v1/property-detail',
        USERS_SEARCH: '/functions/v1/users-search',
    }
} as const

export const SEARCH_PARAMS = {
    PAGE: 'page',
    PAGE_SIZE: 'pageSize',
    LOCATION: 'location',
    MIN_PRICE: 'minPrice',
    MAX_PRICE: 'maxPrice',
    PET_FRIENDLY: 'petFriendly',
    SMOKER: 'smoker',
    AMENITIES: 'amenities',
    LIFESTYLES: 'lifestyles',
    MIN_BUDGET: 'minBudget',
    MAX_BUDGET: 'maxBudget',
    NE_LAT: 'neLat',
    NE_LNG: 'neLng',
    SW_LAT: 'swLat',
    SW_LNG: 'swLng',
} as const

export const API_ERROR_MESSAGES = {
    HTTP_PREFIX: 'HTTP',
} as const
