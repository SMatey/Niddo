import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': req.headers.get('origin') ?? '*',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
    'Access-Control-Allow-Credentials': 'true',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const url = new URL(req.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Missing id parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch amenities catalog
    const { data: amenityData } = await supabase
      .from('amenities')
      .select('id, label')

    const amenityIdToLabel: Record<string, string> = {}
    ;(amenityData ?? []).forEach(a => { amenityIdToLabel[a.id] = a.label })

    // Fetch property with owner info
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

    // Fetch property amenities
    const { data: propertyAmenities } = await supabase
      .from('property_amenities')
      .select('amenity_id')
      .eq('property_id', id)

    const amenityIds = (propertyAmenities ?? []).map(a => a.amenity_id)
    const amenityLabels = amenityIds.map(id => amenityIdToLabel[id] ?? id)

    const ownerRow = (propertyData as Record<string, unknown>).profiles as Record<string, unknown> | null

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