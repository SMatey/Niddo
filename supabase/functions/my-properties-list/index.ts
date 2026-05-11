// supabase/functions/my-properties-list/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    // Create client with the user's JWT
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')

    const url = new URL(req.url)
    const page = Math.max(1, Number(url.searchParams.get('page') ?? 1))
    const pageSize = Math.min(50, Math.max(1, Number(url.searchParams.get('pageSize') ?? 10)))
    const status = url.searchParams.get('status') // e.g., 'active', 'draft', 'paused'
    const offset = (page - 1) * pageSize

    let query = supabase
      .from('properties')
      .select('id, title, description, images, price, status, location, created_at, updated_at', { count: 'exact' })
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data: properties, error: dbError, count } = await query.range(offset, offset + pageSize - 1)

    if (dbError) throw dbError

    return new Response(
      JSON.stringify({ items: properties, total: count ?? 0, page, pageSize }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal error' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
