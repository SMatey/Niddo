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

export type FavoriteType = 'property' | 'user'
