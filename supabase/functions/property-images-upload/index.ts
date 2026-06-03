import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Image } from 'https://deno.land/x/imagescript@1.3.0/mod.ts' 

// Configuración CORS para no bloquear la petición del navegador
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
}

const MAX_IMAGE_WIDTH = 1200
const IMAGE_RESIZE_WIDTH = 1200
const JPEG_QUALITY = 80

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Control de identidad: Extrae el token para saber quién llama a la puerta
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('No authorization header')

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')

    // Extracción del "Paquete": Saca las fotos y los IDs del FormData que envió el cliente
    const formData = await req.formData()
    const propertyId = formData.get('propertyId') as string
    const files = formData.getAll('file') as File[]
    const fileIndexes = formData.getAll('index') as string[] 

    if (!files.length) {
      throw new Error('No files provided')
    }

    // Doble Seguridad: Si hay un ID de propiedad, confirma en la BD que este usuario es el dueño legítimo
    if (propertyId) {
      const { data: prop, error: propErr } = await supabase
        .from('properties')
        .select('id')
        .eq('id', propertyId)
        .eq('owner_id', user.id)
        .single()
      if (propErr || !prop) throw new Error('Property not found or unauthorized')
    }

    // Creamos un cliente con poder absoluto para guardar los archivos sin restricciones
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
    const uploadedUrls = []

    // La "Lavadora" de Imágenes: Procesamos cada foto una por una
    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const idx = fileIndexes[i] || i.toString()

        // Convertimos el archivo en datos puros para que 'imagescript' lo pueda leer
        const arrayBuffer = await file.arrayBuffer()
        const image = await Image.decode(new Uint8Array(arrayBuffer))
        
        // Dieta estricta: Si la imagen es más ancha de MAX_IMAGE_WIDTH, la encoge sin deformarla
        if (image.width > MAX_IMAGE_WIDTH) {
            image.resize(IMAGE_RESIZE_WIDTH, Image.RESIZE_AUTO)
        }
        // Compresión: La convierte a JPEG bajándole la calidad al JPEG_QUALITY%
        const jpegBuffer = await image.encodeJPEG(JPEG_QUALITY) 
        
        // Le asigna un nombre único basado en la fecha y el índice
        const timestamp = Date.now()
        const storagePath = `properties/${user.id}/${propertyId || 'temp'}/${timestamp}_${idx}.jpg`

        // Sube la versión ya optimizada al Storage de Supabase
        const { data, error } = await supabaseAdmin.storage
          .from('property-media') 
          .upload(storagePath, jpegBuffer.buffer, {
              contentType: 'image/jpeg',
              upsert: true
          })

        if (error) {
            console.error('Upload Error:', error)
            continue // Si una foto falla, no detiene el resto, simplemente se la salta
        }

        // Obtiene el enlace público que usaremos en el <img src="...">
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('property-media')
          .getPublicUrl(storagePath)

        uploadedUrls.push({ index: parseInt(idx), url: publicUrl })
    }
    
    // Entrega final: Ordena las URLs para que coincidan con cómo las ordenó el usuario en pantalla
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