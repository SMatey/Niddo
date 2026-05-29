// supabase/functions/users-search/index.ts
// Edge Function para búsqueda de usuarios con filtros backend-side (100% DB-side)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
}

function formatUser(row: Record<string, unknown>, tagLabels: string[], matchScore: number) {
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
    budgetMin: row.budget_min ? Number(row.budget_min) : undefined,
    budgetMax: row.budget_max ? Number(row.budget_max) : undefined,
    confidenceScore: row.trust_score,
    lat: row.latitude ?? undefined,
    lng: row.longitude ?? undefined,
    lifestyles: tagLabels,
    matchScore,
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
    const profileId = url.searchParams.get('profileId') ?? ''
    const location = url.searchParams.get('location') ?? ''
    const lifestyles = url.searchParams.get('lifestyles')?.split(',').filter(Boolean) ?? []
    const minBudget = url.searchParams.get('minBudget') ?? ''
    const maxBudget = url.searchParams.get('maxBudget') ?? ''
    const page = Math.max(1, Number(url.searchParams.get('page') ?? 1))
    const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get('pageSize') ?? 20)))
    const offset = (page - 1) * pageSize
    const MAX_BOUND_RESULTS = 200

    // Importance weights for match score calculation
    const IMPORTANCE_WEIGHTS: Record<string, number> = {
      'must-have': 10,
      'important': 5,
      'nice-to-have': 2,
      'indifferent': 0,
    }

    // Fetch user's preferences if profileId provided
    let userPreferences: Array<{ tag_id: string; importance: string }> = []
    if (profileId) {
      const { data: prefs } = await supabase
        .from('profile_lifestyle_tags')
        .select('tag_id, importance')
        .eq('profile_id', profileId)
      userPreferences = prefs ?? []
    }

    // Calculate match score for a profile's lifestyle tags
    const calculateMatchScore = (profileTagIds: string[]): number => {
      if (userPreferences.length === 0) return 0

      const weightedPrefs = userPreferences.filter(p => p.importance !== 'indifferent')
      if (weightedPrefs.length === 0) return 0

      const totalWeight = weightedPrefs.reduce((sum, p) => sum + (IMPORTANCE_WEIGHTS[p.importance] ?? 0), 0)
      if (totalWeight === 0) return 0

      const matchedWeight = weightedPrefs
        .filter(p => profileTagIds.includes(p.tag_id))
        .reduce((sum, p) => sum + (IMPORTANCE_WEIGHTS[p.importance] ?? 0), 0)

      return Math.round((matchedWeight / totalWeight) * 100)
    }

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

      if (minBudget) {
        profilesQuery = profilesQuery.gte('budget_min', Number(minBudget))
      }
      if (maxBudget) {
        profilesQuery = profilesQuery.lte('budget_max', Number(maxBudget))
      }

      // Filter by map bounds using normalized bounds to ensure correct filtering
      if (normalizedBounds !== null) {
        profilesQuery = profilesQuery
          .gte('latitude', normalizedBounds.minLat)
          .lte('latitude', normalizedBounds.maxLat)
          .gte('longitude', normalizedBounds.minLng)
          .lte('longitude', normalizedBounds.maxLng)
      }

      const { data: profilesData, error: profilesError, count } = hasValidBounds
        ? await profilesQuery.range(0, MAX_BOUND_RESULTS - 1)
        : await profilesQuery.range(offset, offset + pageSize - 1)

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
      const tagIdsByProfile: Record<string, string[]> = {}
      allProfileTags.forEach(t => {
        if (!tagsByProfile[t.profile_id]) tagsByProfile[t.profile_id] = []
        if (!tagIdsByProfile[t.profile_id]) tagIdsByProfile[t.profile_id] = []
        const label = tagIdToLabel[t.tag_id]
        if (label) tagsByProfile[t.profile_id].push(label)
        tagIdsByProfile[t.profile_id].push(t.tag_id)
      })

      const items = (profilesData ?? []).map((p: Record<string, unknown>) => {
        const tagLabels = tagsByProfile[p.id as string] ?? []
        const profileTagIds = tagIdsByProfile[p.id as string] ?? []
        const score = calculateMatchScore(profileTagIds)
        return formatUser(p, tagLabels, score)
      })

      // Sort by match score descending
      items.sort((a, b) => b.matchScore - a.matchScore)

      const hasMore = !hasValidBounds && (count ?? 0) > offset + pageSize

      return new Response(
        JSON.stringify({ items, total: count ?? items.length, hasMore }),
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

    if (minBudget) {
      profilesQuery = profilesQuery.gte('budget_min', Number(minBudget))
    }
    if (maxBudget) {
      profilesQuery = profilesQuery.lte('budget_max', Number(maxBudget))
    }

    // Filter by map bounds using normalized bounds to ensure correct filtering
    if (normalizedBounds !== null) {
      profilesQuery = profilesQuery
        .gte('latitude', normalizedBounds.minLat)
        .lte('latitude', normalizedBounds.maxLat)
        .gte('longitude', normalizedBounds.minLng)
        .lte('longitude', normalizedBounds.maxLng)
    }

    const { data: profilesData, error: profilesError, count } = hasValidBounds
      ? await profilesQuery.range(0, MAX_BOUND_RESULTS - 1)
      : await profilesQuery.range(offset, offset + pageSize - 1)

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
    const tagIdsByProfile: Record<string, string[]> = {}
    allProfileTags.forEach(t => {
      if (!tagsByProfile[t.profile_id]) tagsByProfile[t.profile_id] = []
      if (!tagIdsByProfile[t.profile_id]) tagIdsByProfile[t.profile_id] = []
      const label = tagIdToLabel[t.tag_id]
      if (label) tagsByProfile[t.profile_id].push(label)
      tagIdsByProfile[t.profile_id].push(t.tag_id)
    })

    const items = (profilesData ?? []).map((p: Record<string, unknown>) => {
      const tagLabels = tagsByProfile[p.id as string] ?? []
      const profileTagIds = tagIdsByProfile[p.id as string] ?? []
      const score = calculateMatchScore(profileTagIds)
      return formatUser(p, tagLabels, score)
    })

    // Sort by match score descending
    items.sort((a, b) => b.matchScore - a.matchScore)

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