import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Filtro de Método: Solo permitimos operaciones que impliquen escritura o actualización
  if (req.method !== 'POST' && req.method !== 'PUT') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders })
  }

  try {
    // Extraemos el token JWT del usuario
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('No authorization header')

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    // Creamos un cliente que actúa exclusivamente en nombre de este usuario
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')

    // Solo necesitamos dos piezas de información del frontend
    const { id, status } = await req.json()
    if (!id || !status) throw new Error('Property ID and new status are required')

    // Bloquea estados inventados o hackeos
    const validStatuses = ['active', 'draft', 'paused', 'deleted', 'sold']
    if (!validStatuses.includes(status)) throw new Error('Invalid status')

    // Actualizamos estrictamente la columna de estado y la fecha de modificación
    const { data, error } = await supabase
      .from('properties')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('owner_id', user.id) // Regla de oro: debe ser el dueño legítimo
      .select('id, status')
      .single()

    if (error) throw error

    // Retornamos el estado nuevo para que el frontend pueda refrescar la tarjeta visual
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal error' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})