import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: Array<{name: string, value: string, options?: any}>) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              ...options,
            })
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Rutas protegidas dentro del grupo (dashboard)
  const protectedPaths = [
    '/favoritos',
    '/mis-publicaciones',
    '/mensajes',
    '/configuracion',
    '/perfil',
  ]

  // Rutas API protegidas para acciones reservadas
  const protectedApiPaths = [
    '/api/favorites',
    '/api/messages',
    '/api/contact',
  ]

  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  const isProtectedApiPath = protectedApiPaths.some(path => pathname.startsWith(path))

  // Redirigir a login si no autenticado en rutas protegidas
  if ((isProtectedPath || isProtectedApiPath) && !user) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
  //   return NextResponse.redirect(redirectUrl)
  // }

  // Rutas de auth → redirigir si ya está logueado
  if ((pathname === '/login' || pathname === '/register') && user) {
    const redirectTo = request.nextUrl.searchParams.get('redirect') || '/favoritos'
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}