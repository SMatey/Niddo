import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Configuración CORS: Permite que tu frontend web se comunique con este servidor sin bloqueos del navegador
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
}

Deno.serve(async (req) => {
  // Preflight request: Responde automáticamente a las verificaciones de seguridad del navegador
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Extracción del "Gafete": Sacamos el token JWT que el frontend nos envió
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    // Cliente Autenticado: Creamos la conexión a Supabase "disfrazada" con la identidad del usuario
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    // Confirmamos que el token sea válido y real
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')

    // Paginación Defensiva: Extraemos los parámetros de la URL limitando numéricamente abusos o errores
    const url = new URL(req.url)
    const page = Math.max(1, Number(url.searchParams.get('page') ?? 1))
    const pageSize = Math.min(50, Math.max(1, Number(url.searchParams.get('pageSize') ?? 10)))
    const status = url.searchParams.get('status') // Ej: 'active', 'draft', 'paused'
    
    // Calculamos desde qué fila exacta de la base de datos empezar a cortar (Offset)
    const offset = (page - 1) * pageSize

    // Construcción de la Consulta: Seleccionamos campos específicos y pedimos el conteo total exacto
    let query = supabase
      .from('properties')
      .select('id, title, description, images, price, status, location, created_at, updated_at', { count: 'exact' })
      .eq('owner_id', user.id) // Regla de oro: Solo traer las casas de este usuario
      .order('created_at', { ascending: false }) // Las más recientes primero

    // Filtro Dinámico: Si el frontend pidió un estado específico, lo agregamos a la consulta
    if (status) {
      query = query.eq('status', status)
    }

    const { data: properties, error: dbError, count } = await query.range(offset, offset + pageSize - 1)

    if (dbError) throw dbError

    // Respuesta Exitosa: Empaquetamos los datos, el total real y la metadata de la página
    return new Response(
      JSON.stringify({ items: properties, total: count ?? 0, page, pageSize }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    // Manejo de Errores: Si algo explota, devolvemos un estado 400 limpio sin crashear el servicio
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal error' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})