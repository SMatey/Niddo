// supabase/functions/users-search/index.ts
// Edge Function para búsqueda de usuarios con filtros backend-side (100% DB-side)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
}

function formatUser(row: Record<string, unknown>, tagLabels: string[]) {
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    bio: row.bio ?? undefined,
    location: row.location ?? undefined,
    imageUrl: row.avatar ?? undefined,
    verified: row.is_verified,
    isFavorite: false,
    minBudget: row.budget_min ? `$${row.budget_min}` : undefined,
    maxBudget: row.budget_max ? `$${row.budget_max}` : undefined,
    confidenceScore: row.trust_score,
    lat: row.latitude ?? undefined,
    lng: row.longitude ?? undefined,
    lifestyles: tagLabels,
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
    const lifestyles = url.searchParams.get('lifestyles')?.split(',').filter(Boolean) ?? []
    const page = Math.max(1, Number(url.searchParams.get('page') ?? 1))
    const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get('pageSize') ?? 20)))
    const offset = (page - 1) * pageSize

    // Fetch tag labels map
    const { data: tagData } = await supabase
      .from('lifestyle_tags')
      .select('id, label')

    const tagIdToLabel: Record<string, string> = {}
    const labelToTagId: Record<string, string> = {}
    ;(tagData ?? []).forEach(t => {
      tagIdToLabel[t.id] = t.label
      labelToTagId[t.label] = t.id
    })

    // Filter by lifestyle_tags via profile_lifestyle_tags
    if (lifestyles.length > 0) {
      // Convert label names to tag IDs (e.g., 'Ordenado' -> 'clean-freak')
      const tagIds = lifestyles
        .map(l => labelToTagId[l])
        .filter(Boolean)

      if (tagIds.length === 0) {
        return new Response(
          JSON.stringify({ items: [], total: 0 }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data: lifestyleMatches } = await supabase
        .from('profile_lifestyle_tags')
        .select('profile_id')
        .in('tag_id', tagIds)

      const matchedProfileIds = [...new Set((lifestyleMatches ?? []).map(m => m.profile_id))]

      if (matchedProfileIds.length === 0) {
        return new Response(
          JSON.stringify({ items: [], total: 0 }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      let profilesQuery = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .in('id', matchedProfileIds)

      if (location) {
        profilesQuery = profilesQuery.ilike('location', `%${location}%`)
      }

      const { data: profilesData, error: profilesError, count } = await profilesQuery
        .range(offset, offset + pageSize - 1)

      if (profilesError) {
        throw profilesError
      }

      const profileIds = (profilesData ?? []).map(p => p.id)
      let allProfileTags: Array<{ profile_id: string; tag_id: string }> = []

      if (profileIds.length > 0) {
        const { data: pTags } = await supabase
          .from('profile_lifestyle_tags')
          .select('profile_id, tag_id')
          .in('profile_id', profileIds)

        allProfileTags = pTags ?? []
      }

      const tagsByProfile: Record<string, string[]> = {}
      allProfileTags.forEach(t => {
        if (!tagsByProfile[t.profile_id]) tagsByProfile[t.profile_id] = []
        const label = tagIdToLabel[t.tag_id]
        if (label) tagsByProfile[t.profile_id].push(label)
      })

      const items = (profilesData ?? []).map((p: Record<string, unknown>) => {
        const tagLabels = tagsByProfile[p.id as string] ?? []
        return formatUser(p, tagLabels)
      })

      return new Response(
        JSON.stringify({ items, total: count ?? items.length }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // No lifestyle filter - query directly
    let profilesQuery = supabase
      .from('profiles')
      .select('*', { count: 'exact' })

    if (location) {
      profilesQuery = profilesQuery.ilike('location', `%${location}%`)
    }

    const { data: profilesData, error: profilesError, count } = await profilesQuery
      .range(offset, offset + pageSize - 1)

    if (profilesError) {
      throw profilesError
    }

    const profileIds = (profilesData ?? []).map(p => p.id)
    let allProfileTags: Array<{ profile_id: string; tag_id: string }> = []

    if (profileIds.length > 0) {
      const { data: pTags } = await supabase
        .from('profile_lifestyle_tags')
        .select('profile_id, tag_id')
        .in('profile_id', profileIds)

      allProfileTags = pTags ?? []
    }

    const tagsByProfile: Record<string, string[]> = {}
    allProfileTags.forEach(t => {
      if (!tagsByProfile[t.profile_id]) tagsByProfile[t.profile_id] = []
      const label = tagIdToLabel[t.tag_id]
      if (label) tagsByProfile[t.profile_id].push(label)
    })

    const items = (profilesData ?? []).map((p: Record<string, unknown>) => {
      const tagLabels = tagsByProfile[p.id as string] ?? []
      return formatUser(p, tagLabels)
    })

    return new Response(
      JSON.stringify({ items, total: count ?? items.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})