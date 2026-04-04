const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email']
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/my-listings',
  '/search',
  '/inbox',
  '/roomies',
  '/favorites',
  '/settings',
  '/admin',
]

export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route))
}

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
}
