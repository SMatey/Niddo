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
    // Verificación de Identidad: Extraemos el token del usuario
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('No authorization header')

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    // Creamos el cliente actuando en nombre del usuario logueado
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')

    // Análisis del Paquete: Leemos los datos y vemos qué acción se solicita
    const payload = await req.json()
    // Si el método es PUT, sabemos que es una edición. Si no, es una creación.
    const isUpdate = req.method === 'PUT'

    // Normalización: Preparamos un objeto limpio con los datos en común para ambas acciones
    const propertyData = {
      title: payload.title,
      description: payload.description,
      price: payload.price,
      location: payload.location,
      address: payload.address,
      latitude: payload.latitude,
      longitude: payload.longitude,
      bedrooms: payload.bedrooms,
      bathrooms: payload.bathrooms,
      area: payload.area,
      rules: payload.rules ?? [], 
      available_from: payload.available_from ?? null,
      status: payload.status ?? 'draft', 
      images: payload.images ?? [], 
      owner_id: user.id, // Forzamos que el dueño sea quien hace la petición
      updated_at: new Date().toISOString()
    }

    // ==========================================
    // RUTA A: ACTUALIZAR PROPIEDAD EXISTENTE
    // ==========================================
    if (isUpdate) {
      if (!payload.id) throw new Error('Property ID is required for update')
      
      const { data, error } = await supabase
        .from('properties')
        .update(propertyData)
        .eq('id', payload.id)
        .eq('owner_id', user.id) // Capa de seguridad extra: solo el dueño puede editar
        .select()
        .single()
      
      if (error) throw error

      // Manejo de Amenidades (Estrategia Wipe & Replace)
      if (payload.amenities && Array.isArray(payload.amenities)) {
        // Borramos todas las relaciones viejas
        await supabase.from('property_amenities').delete().eq('property_id', payload.id);
        
        // Si la nueva lista no está vacía, insertamos todo desde cero
        if (payload.amenities.length > 0) {
            const amenitiesData = payload.amenities.map((amenityId: string) => ({
                property_id: payload.id,
                amenity_id: amenityId
            }))
            await supabase.from('property_amenities').insert(amenitiesData);
        }
      }

      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    
    // ==========================================
    // RUTA B: CREAR NUEVA PROPIEDAD
    // ==========================================
    } else {
      const { data, error } = await supabase
        .from('properties')
        .insert({ ...propertyData, created_at: new Date().toISOString() })
        .select()
        .single()
      
      if (error) throw error

      // Al ser una casa nueva, simplemente insertamos las amenidades por primera vez
      if (payload.amenities && Array.isArray(payload.amenities) && payload.amenities.length > 0) {
        const amenitiesData = payload.amenities.map((amenityId: string) => ({
            property_id: data.id,
            amenity_id: amenityId
        }))
        await supabase.from('property_amenities').insert(amenitiesData);
      }

      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal error' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})