export const FAVORITES_LABELS = {
  pageTitle: 'Mis Favoritos',
  pageDescription: 'Tus propiedades y perfiles guardados',
  emptyState: 'No tienes favoritos guardados',
  emptyStateDescription: 'Cuando guardes una propiedad o perfil, aparecerá aquí',
  properties: 'Propiedades',
  users: 'Usuarios',
  tabs: {
    all: 'Todo',
    properties: 'Propiedades',
    users: 'Perfiles',
  },
} as const

export const FAVORITES_MESSAGES = {
  success: {
    addedProperty: 'Propiedad agregada a favoritos',
    addedUser: 'Perfil agregado a favoritos',
    removedProperty: 'Propiedad removida de favoritos',
    removedUser: 'Perfil removido de favoritos',
  },
  error: {
    failedToAddProperty: 'No se pudo agregar la propiedad a favoritos',
    failedToAddUser: 'No se pudo agregar el perfil a favoritos',
    failedToRemoveProperty: 'No se pudo remover la propiedad de favoritos',
    failedToRemoveUser: 'No se pudo remover el perfil de favoritos',
    failedToFetch: 'No se pudieron cargar los favoritos',
    unauthorized: 'Debes estar autenticado para agregar favoritos',
  },
} as const

export const FAVORITES_TABLE = {
  name: 'favorites',
  columns: {
    id: 'id',
    profileId: 'profile_id',
    propertyId: 'property_id',
    favoritedProfileId: 'favorited_profile_id',
    createdAt: 'created_at',
  },
} as const

export const SUPABASE_ERROR_CODES = {
  NOT_FOUND: 'PGRST116',
} as const

export const FAVORITES_CONSOLE_MESSAGES = {
  error: {
    checkingPropertyFavorite: 'Error checking property favorite status:',
    checkingProfileFavorite: 'Error checking profile favorite status:',
    togglingPropertyFavorite: 'Error toggling property favorite:',
    togglingUserFavorite: 'Error toggling user favorite:',
    fetchingFavorites: 'Error fetching favorites:',
  },
} as const

export const FAVORITES_UI_MESSAGES = {
  loading: 'Cargando favoritos...',
  errorLoading: 'Error al cargar favoritos',
  noProperties: 'No tienes propiedades favoritas',
  noProfiles: 'No tienes perfiles favoritos',
} as const

export type FavoriteType = 'property' | 'user'
