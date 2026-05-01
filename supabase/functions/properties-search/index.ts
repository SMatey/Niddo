// supabase/functions/properties-search/index.ts
// Edge Function para búsqueda de propiedades con filtros backend-side

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
}

function formatProperty(row: Record<string, unknown>, amenityLabels: string[]) {
  const images = row.images as string[] | null
  return {
    id: row.id,
    title: row.title,
    location: row.location,
    price: `$${row.price}/mes`,
    imageUrl: images?.[0] ?? undefined,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    squareMeters: row.area,
    lat: row.latitude ?? undefined,
    lng: row.longitude ?? undefined,
    amenities: amenityLabels,
    isFavorite: false,
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const url = new URL(req.url)
    const location = url.searchParams.get('location') ?? ''
    const minPrice = url.searchParams.get('minPrice') ? Number(url.searchParams.get('minPrice')) : null
    const maxPrice = url.searchParams.get('maxPrice') ? Number(url.searchParams.get('maxPrice')) : null
    const amenities = url.searchParams.get('amenities')?.split(',').filter(Boolean) ?? []
    const page = Math.max(1, Number(url.searchParams.get('page') ?? 1))
    const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get('pageSize') ?? 20)))
    const offset = (page - 1) * pageSize

    // Bounds parameters for map view progressive loading
    const neLatParam = url.searchParams.get('neLat')
    const neLngParam = url.searchParams.get('neLng')
    const swLatParam = url.searchParams.get('swLat')
    const swLngParam = url.searchParams.get('swLng')

    // Parse and validate all bounds parameters
    const neLat = neLatParam !== null ? Number(neLatParam) : null
    const neLng = neLngParam !== null ? Number(neLngParam) : null
    const swLat = swLatParam !== null ? Number(swLatParam) : null
    const swLng = swLngParam !== null ? Number(swLngParam) : null

    // Validate that all bounds are valid numbers
    const allBoundsValid = neLat !== null && neLng !== null && swLat !== null && swLng !== null &&
        !isNaN(neLat) && !isNaN(neLng) && !isNaN(swLat) && !isNaN(swLng)

    // Validate that bounds form a valid area (not degenerate)
    const boundsArea = allBoundsValid
      ? Math.abs(neLat - swLat) * Math.abs(neLng - swLng)
      : 0
    const hasValidBounds = allBoundsValid && boundsArea > 0

    // Normalize bounds: ensure sw < ne for latitude and longitude
    const normalizedBounds = hasValidBounds ? {
        minLat: Math.min(swLat as number, neLat as number),
        maxLat: Math.max(swLat as number, neLat as number),
        minLng: Math.min(swLng as number, neLng as number),
        maxLng: Math.max(swLng as number, neLng as number),
    } : null

    // Fetch amenities catalog for label mapping
    const { data: amenityData } = await supabase
      .from('amenities')
      .select('id, label')

    const amenityIdToLabel: Record<string, string> = {}
    const labelToAmenityId: Record<string, string> = {}
    ;(amenityData ?? []).forEach(a => {
      amenityIdToLabel[a.id] = a.label
      labelToAmenityId[a.label] = a.id
    })

    // Build property list query
    let propertiesQuery = supabase
      .from('properties')
      .select(`
        id, owner_id, title, description, images, price, location, address,
        latitude, longitude, bedrooms, bathrooms, area, rules,
        status, available_from,
        profiles!owner_id ( name, avatar, is_verified, trust_score )
      `, { count: 'exact' })
      .eq('status', 'active')

    if (location) {
      propertiesQuery = propertiesQuery.ilike('location', `%${location}%`)
    }
    if (minPrice !== null && !isNaN(minPrice)) {
      propertiesQuery = propertiesQuery.gte('price', minPrice)
    }
    if (maxPrice !== null && !isNaN(maxPrice)) {
      propertiesQuery = propertiesQuery.lte('price', maxPrice)
    }

    // Filter by map bounds using normalized bounds to ensure correct filtering
    if (normalizedBounds !== null) {
      propertiesQuery = propertiesQuery
        .gte('latitude', normalizedBounds.minLat)
        .lte('latitude', normalizedBounds.maxLat)
        .gte('longitude', normalizedBounds.minLng)
        .lte('longitude', normalizedBounds.maxLng)
    }

    // Filter by amenities via property_amenities
    if (amenities.length > 0) {
      // Convert label names to amenity IDs (e.g., 'WiFi' -> 'wifi')
      const amenityIds = amenities
        .map(a => labelToAmenityId[a])
        .filter(Boolean)

      if (amenityIds.length === 0) {
        return new Response(
          JSON.stringify({ items: [], total: 0 }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data: amenityMatches } = await supabase
        .from('property_amenities')
        .select('property_id')
        .in('amenity_id', amenityIds)

      const matchedPropertyIds = [...new Set((amenityMatches ?? []).map(m => m.property_id))]
      if (matchedPropertyIds.length > 0) {
        propertiesQuery = propertiesQuery.in('id', matchedPropertyIds)
      } else {
        return new Response(
          JSON.stringify({ items: [], total: 0 }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // If bounds are present and valid, limit results to avoid massive payloads; otherwise paginate
    const MAX_BOUND_RESULTS = 200
    const { data: propertiesData, error: propertiesError, count } = hasValidBounds
      ? await propertiesQuery.range(0, MAX_BOUND_RESULTS - 1)
      : await propertiesQuery.range(offset, offset + pageSize - 1)

    if (propertiesError) {
      throw propertiesError
    }

    // Fetch ALL amenity labels for all properties
    const propertyIds = (propertiesData ?? []).map(p => p.id)
    let allPropertyAmenities: Array<{ property_id: string; amenity_id: string }> = []

    if (propertyIds.length > 0) {
      const { data: pAmenities } = await supabase
        .from('property_amenities')
        .select('property_id, amenity_id')
        .in('property_id', propertyIds)

      allPropertyAmenities = pAmenities ?? []
    }

    // Group amenities by property
    const amenitiesByProperty: Record<string, string[]> = {}
    allPropertyAmenities.forEach(a => {
      if (!amenitiesByProperty[a.property_id]) amenitiesByProperty[a.property_id] = []
      const label = amenityIdToLabel[a.amenity_id]
      if (label) amenitiesByProperty[a.property_id].push(label)
    })

    // Build response
    const items = (propertiesData ?? []).map((p: Record<string, unknown>) => {
      const ownerRow = p.profiles as Record<string, unknown> | null
      const amenityLabels = amenitiesByProperty[p.id as string] ?? []
      return {
        ...formatProperty(p, amenityLabels),
        ownerName: ownerRow?.name as string ?? '',
        ownerAvatar: ownerRow?.avatar as string | null ?? null,
        ownerVerified: (ownerRow?.is_verified as boolean) ?? false,
        ownerTrustScore: (ownerRow?.trust_score as number) ?? 0,
      }
    })

    const hasMore = !hasValidBounds && (count ?? 0) > offset + pageSize

    return new Response(
      JSON.stringify({ items, total: count ?? items.length, hasMore }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})