import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/shared/constants/routes.constants'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || ROUTES.FAVORITES

  if (!code) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, requestUrl.origin))
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    const loginUrl = new URL(ROUTES.LOGIN, requestUrl.origin)
    loginUrl.searchParams.set('error', error.message)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin))
}
