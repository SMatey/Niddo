// supabase/functions/user-detail/index.ts
// Edge Function para detalle de usuario
// Implementar en Supabase: supabase functions deploy user-detail

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

    // Fetch tag labels
    const { data: tagData } = await supabase
      .from('lifestyle_tags')
      .select('id, label')

    const tagIdToLabel: Record<string, string> = {}
    ;(tagData ?? []).forEach(t => { tagIdToLabel[t.id] = t.label })

    // Fetch profile from public.profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (profileError || !profileData) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let userEmail = undefined;
    try {
      const { data: authData, error: authError } = await supabase.auth.admin.getUserById(id);
      if (!authError && authData?.user) {
        userEmail = authData.user.email;
      } else {
        console.warn("No se encontró en auth.users o el ID no es UUID:", authError?.message);
      }
    } catch (e) {
      console.warn("Error al consultar auth.users:", e);
    }


    // Fetch profile lifestyle tags
    const { data: profileTags } = await supabase
      .from('profile_lifestyle_tags')
      .select('tag_id')
      .eq('profile_id', id)

    const tagIds = (profileTags ?? []).map(t => t.tag_id)
    const tagLabels = tagIds.map(id => tagIdToLabel[id] ?? id)

    const detail = {
      id: profileData.id,
      name: profileData.name,
      age: profileData.age,
      bio: profileData.bio ?? undefined,
      location: profileData.location ?? undefined,
      imageUrl: profileData.avatar ?? undefined,
      verified: profileData.is_verified,
      isFavorite: false,
      minBudget: profileData.budget_min ? `$${profileData.budget_min}` : undefined,
      maxBudget: profileData.budget_max ? `$${profileData.budget_max}` : undefined,
      confidenceScore: profileData.trust_score,
      lat: profileData.latitude ?? undefined,
      lng: profileData.longitude ?? undefined,
      lifestyles: tagLabels,
      description: profileData.bio ?? undefined,
      memberSince: profileData.joined_date,
      // Se prioriza el email extraído de auth.users, si no existe usa el de profiles
      email: userEmail ?? profileData.email ?? undefined,
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