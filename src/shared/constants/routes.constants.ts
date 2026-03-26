export const ROUTES = {
  // Public
  HOME: '/',
  PUBLIC_LISTINGS: '/listings',
  PUBLIC_LISTING_DETAIL: (id: string) => `/listings/${id}`,

  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',

  // App (protected)
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
  MY_LISTINGS: '/my-listings',
  LISTING_NEW: '/my-listings/new',
  LISTING_EDIT: (id: string) => `/my-listings/${id}/edit`,
  SEARCH: '/search',
  INBOX: '/inbox',
  CONVERSATION: (id: string) => `/inbox/${id}`,
  ROOMIES: '/roomies',
  FAVORITES: '/favorites',
  SETTINGS: '/settings',
  ADMIN: '/admin',
} as const
