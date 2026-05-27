'use server'

import { createServerClient } from '@/lib/supabase/server'
import type { PublicationFormValues } from '@/features/properties/schemas/publication.schema'
import type { Property } from '@/lib/supabase/types'
import { PROPERTY_ACTIONS_MESSAGES } from '@/features/properties/constants/property-actions.constants'
import { uploadPropertyImages } from '@/features/properties/lib/property-image-upload'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export interface CreatePropertyPayload extends PublicationFormValues {
  images: File[]
  navigationUrl: string
}

export interface CreatePropertyResponse {
  success: boolean
  data?: Property
  error?: string
}

export async function createProperty(payload: CreatePropertyPayload): Promise<CreatePropertyResponse> {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: PROPERTY_ACTIONS_MESSAGES.errors.unauthorized,
      }
    }

    const propertyData = {
      id: `prop-${Date.now()}-${crypto.randomUUID()}`,
      owner_id: user.id,
      title: payload.title,
      description: payload.description || null,
      price: payload.price,
      location: payload.location,
      address: null,
      latitude: payload.latitude,
      longitude: payload.longitude,
      bedrooms: payload.bedrooms || 1,
      bathrooms: payload.bathrooms || 1,
      area: payload.squareMeters || 0,
      rules: payload.rules || [],
      status: PROPERTY_ACTIONS_MESSAGES.status.active,
      available_from: payload.availableFrom || null,
      images: [] as string[],
    }

    const { data: createdProperty, error: insertError } = await supabase
      .from(PROPERTY_ACTIONS_MESSAGES.labels.propieties)
      .insert([propertyData])
      .select()
      .single()

    if (insertError) {
      console.error(PROPERTY_ACTIONS_MESSAGES.errors.creationFailed, insertError)
      return {
        success: false,
        error: PROPERTY_ACTIONS_MESSAGES.errors.creationFailed + insertError.message,
      }
    }

    if (payload.images && payload.images.length > 0) {
      const uploadedUrls = await uploadPropertyImages({
        supabase,
        bucket: PROPERTY_ACTIONS_MESSAGES.labels.propietiesImages,
        userId: user.id,
        propertyId: propertyData.id,
        files: payload.images,
      })

      if (uploadedUrls.length > 0) {
        const { error: updateError } = await supabase
          .from(PROPERTY_ACTIONS_MESSAGES.labels.propieties)
          .update({ images: uploadedUrls })
          .eq('id', propertyData.id)

        if (updateError) {
          console.error("Warning: Could not update property with image URLs", updateError)
        } else {
          createdProperty.images = uploadedUrls 
        }
      }
    }

    if (payload.amenities && payload.amenities.length > 0) {
      const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      const amenitiesToUpsert = payload.amenities.map(amenity => ({
        id: amenity,
        label: amenity,
        category: 'general'
      }))
      
      const { error: upsertError } = await supabaseAdmin
        .from('amenities')
        .upsert(amenitiesToUpsert, { onConflict: 'id', ignoreDuplicates: true })

      if (upsertError) {
        console.error("Warning: Could not upsert amenities catalogue", upsertError)
      }

      const amenitiesData = payload.amenities.map(amenityId => ({
        property_id: propertyData.id,
        amenity_id: amenityId
      }))
      
      const { error: amenitiesError } = await supabase
        .from('property_amenities')
        .insert(amenitiesData)

      if (amenitiesError) {
        console.error("Warning: Could not save property amenities", amenitiesError)
      }
    }

    return {
      success: true,
      data: createdProperty as Property,
    }
  } catch (error) {
    console.error(PROPERTY_ACTIONS_MESSAGES.errors.unexpectedError, error)
    return {
      success: false,
      error: PROPERTY_ACTIONS_MESSAGES.errors.unexpectedError,
    }
  }
}
