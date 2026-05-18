'use server'

import { NextResponse } from 'next/server'
import { createClient as createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { profileId, idDocumentPath, keyB64, fileIvB64 } = body

    if (!profileId || !idDocumentPath || !keyB64 || !fileIvB64) {
      return new NextResponse('Missing parameters', { status: 400 })
    }

    // We only update the two requested columns in `profiles`.
    // The encryption/storage of the client AES key is out of scope for this change.

    // Prefer using a server-side service role key when available (safe on server env)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    let supabase: any
    let usingServiceKey = false
    if (supabaseUrl && serviceKey) {
      const { createClient } = await import('@supabase/supabase-js')
      supabase = createClient(supabaseUrl, serviceKey)
      usingServiceKey = true
    } else {
      // fallback to server client using cookies/session
      supabase = await createServerSupabaseClient()
    }

    console.log('[id-doc/save] Using service key:', usingServiceKey)
    console.log('[id-doc/save] profileId:', profileId)
    console.log('[id-doc/save] idDocumentPath:', idDocumentPath)

    const fullPayload = {
      id_document_path: idDocumentPath,
      has_uploaded_id: true,
    }

    // If not using service key, ensure the authenticated user matches profileId
    if (!usingServiceKey) {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        const authUserId = user?.id
        console.log('[id-doc/save] authUserId:', authUserId)
        if (!authUserId || authUserId !== profileId) {
          console.warn('[id-doc/save] Authenticated user mismatch or missing; refusing update')
          return new NextResponse('Forbidden: user mismatch', { status: 403 })
        }
      } catch (e) {
        console.warn('[id-doc/save] Could not verify auth user via server client', e)
      }
    }

    let updateError: any = null
    let res: any
    console.log('payload for update:', fullPayload)
    try {
      res = await supabase.from('profiles').update(fullPayload).eq('id', profileId)
      updateError = res.error
      console.log('[id-doc/save] update result:', res)
      if (!updateError) {
        return NextResponse.json({ ok: true })
      }
    } catch (err) {
      updateError = err
      console.error('[id-doc/save] update threw', err)
    }

    const errorMessage = (updateError && (updateError.message || updateError.error || String(updateError))) ?? ''
    if (updateError) {
      console.error('Supabase update error', updateError)
      return new NextResponse('Failed to save metadata', { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error(err)
    return new NextResponse(err?.message ?? 'Internal error', { status: 500 })
  }
}
