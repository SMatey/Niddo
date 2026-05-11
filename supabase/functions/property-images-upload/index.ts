// supabase/functions/property-images-upload/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Image } from 'https://deno.land/x/imagescript@1.3.0/mod.ts'

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
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })
    
    // Auth Check
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')

    // Parse form data
    const formData = await req.formData()
    const propertyId = formData.get('propertyId') as string
    const files = formData.getAll('file') as File[]
    const fileIndexes = formData.getAll('index') as string[] // Used for specific ordering

    if (!files.length) {
      throw new Error('No files provided')
    }

    // Optional: verification that property belongs to user before attempting up to Deno limit
    if (propertyId) {
      const { data: prop, error: propErr } = await supabase
        .from('properties')
        .select('id')
        .eq('id', propertyId)
        .eq('owner_id', user.id)
        .single()
      if (propErr || !prop) throw new Error('Property not found or unauthorized')
    }

    // Elevated client to bypass RLS for direct storage insert if configured that way, 
    // or standard auth client if Storage RLS is correctly tracking auth.uid()
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    const uploadedUrls = []

    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const idx = fileIndexes[i] || i.toString()

        const arrayBuffer = await file.arrayBuffer()
        const image = await Image.decode(new Uint8Array(arrayBuffer))
        
        // Resize while maintaining aspect ratio, max width 1200px
        if (image.width > 1200) {
            image.resize(1200, Image.RESIZE_AUTO)
        }

        // Compress to WEBP
        const webpBuffer = await image.encodeWEBP(80) // 80% quality
        
        const timestamp = Date.now()
        const storagePath = `properties/${user.id}/${propertyId || 'temp'}/${timestamp}_${idx}.webp`

        const { data, error } = await supabaseAdmin.storage
          .from('property-media') // Ensure this bucket exists
          .upload(storagePath, webpBuffer, {
              contentType: 'image/webp',
              upsert: true
          })

        if (error) {
            console.error('Upload Error:', error)
            continue
        }

        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('property-media')
          .getPublicUrl(storagePath)

        uploadedUrls.push({ index: parseInt(idx), url: publicUrl })
    }

    // Optional ordering update logic could be handled here or returned to client
    return new Response(JSON.stringify({ urls: uploadedUrls.sort((a,b)=>a.index-b.index) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal error' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
