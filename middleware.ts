import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase/middleware'
import { isAuthRoute, isProtectedRoute } from '@/lib/middleware/routes'

export async function middleware(request: NextRequest) {
  const { supabase, getResponse } = createMiddlewareClient(request)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Auth routes: redirect to dashboard if already logged in
  if (isAuthRoute(pathname) && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Protected routes: redirect to login if not logged in
  if (isProtectedRoute(pathname) && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return getResponse()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
