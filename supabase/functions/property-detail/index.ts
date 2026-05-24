import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  // 1. Configuración de CORS para permitir que el navegador web lea esta respuesta
  const corsHeaders = {
    'Access-Control-Allow-Origin': req.headers.get('origin') ?? '*',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
    'Access-Control-Allow-Credentials': 'true',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // 2. Conexión a la Base de Datos usando la Llave Maestra (Service Role)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 3. Captura del ID del inmueble desde la URL (ej. /funcion?id=123)
    const url = new URL(req.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Missing id parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 4. Descarga del catálogo general de amenidades para usarlo como traductor
    const { data: amenityData } = await supabase
      .from('amenities')
      .select('id, label')

    const amenityIdToLabel: Record<string, string> = {}
    ;(amenityData ?? []).forEach(a => { amenityIdToLabel[a.id] = a.label })

    // 5. Consulta Principal: Trae la propiedad y hace un JOIN automático con el perfil del dueño
    const { data: propertyData, error: propertyError } = await supabase
      .from('properties')
      .select(`
        id, owner_id, title, description, images, price, location, address,
        latitude, longitude, bedrooms, bathrooms, area, rules, status, available_from,
        profiles!owner_id ( id, name, avatar, is_verified, trust_score, joined_date )
      `)
      .eq('id', id)
      .single()

    if (propertyError || !propertyData) {
      return new Response(
        JSON.stringify({ error: 'Property not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 6. Busca qué amenidades específicas tiene esta propiedad
    const { data: propertyAmenities } = await supabase
      .from('property_amenities')
      .select('amenity_id')
      .eq('property_id', id)

    // 7. Traduce los IDs de las amenidades a sus nombres reales usando el catálogo
    const amenityIds = (propertyAmenities ?? []).map(a => a.amenity_id)
    const amenityLabels = amenityIds.map(id => amenityIdToLabel[id] ?? id)

    // 8. Extrae limpiamente la información del perfil del dueño
    const ownerRow = (propertyData as Record<string, unknown>).profiles as Record<string, unknown> | null

    // 9. Empaquetado Final: Formatea todos los datos en una estructura plana y amigable para el frontend
    const detail = {
      id: propertyData.id,
      title: propertyData.title,
      location: propertyData.location,
      price: `$${propertyData.price}/mes`,
      imageUrl: propertyData.images?.[0] ?? undefined,
      images: propertyData.images ?? [],
      bedrooms: propertyData.bedrooms,
      bathrooms: propertyData.bathrooms,
      squareMeters: propertyData.area,
      lat: propertyData.latitude ?? undefined,
      lng: propertyData.longitude ?? undefined,
      amenities: amenityLabels,
      isFavorite: false,
      description: propertyData.description ?? undefined,
      hostId: ownerRow?.id as string ?? '',
      hostName: ownerRow?.name as string ?? '',
      hostImageUrl: ownerRow?.avatar as string | undefined,
      hostVerified: (ownerRow?.is_verified as boolean) ?? false,
      hostConfidence: (ownerRow?.trust_score as number) ?? 0,
      memberSince: (ownerRow?.joined_date as string) ?? '',
      rules: propertyData.rules ?? [],
    }

    // 10. Envía el paquete terminado al cliente
    return new Response(JSON.stringify(detail), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})