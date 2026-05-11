// supabase/functions/property-manage/index.ts
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
    if (!authHeader) throw new Error('No authorization header')

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')

    const payload = await req.json()
    const isUpdate = req.method === 'PUT'

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
      status: payload.status ?? 'draft', // Draft by default
      images: payload.images ?? [], // Assume images are sent securely
      amenities: payload.amenities ?? [], // Direct amenities string array fallback
      owner_id: user.id, // Enforce ownership
      updated_at: new Date().toISOString()
    }

    if (isUpdate) {
      if (!payload.id) throw new Error('Property ID is required for update')
      const { data, error } = await supabase
        .from('properties')
        .update(propertyData)
        .eq('id', payload.id)
        .eq('owner_id', user.id) // Security check
        .select()
        .single()
      
      if (error) throw error
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    } else {
      const { data, error } = await supabase
        .from('properties')
        .insert({ ...propertyData, created_at: new Date().toISOString() })
        .select()
        .single()
      
      if (error) throw error
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal error' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
