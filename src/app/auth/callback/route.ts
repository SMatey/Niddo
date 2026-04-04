import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/shared/constants/routes.constants'

const DEFAULT_REDIRECT_PATH = ROUTES.DASHBOARD

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const nextPath = requestUrl.searchParams.get('next') ?? DEFAULT_REDIRECT_PATH

  if (!code) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url))
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url))
  }

  const safeNextPath = nextPath.startsWith('/') ? nextPath : DEFAULT_REDIRECT_PATH
  return NextResponse.redirect(new URL(safeNextPath, request.url))
}
