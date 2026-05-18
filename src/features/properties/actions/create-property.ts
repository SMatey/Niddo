'use server'

import { createClient } from '@/lib/supabase/server'
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

/**
 * Creates a new property listing in the database
 */
export async function createProperty(payload: CreatePropertyPayload): Promise<CreatePropertyResponse> {
  try {
    const supabase = await createClient()

    // Get current user
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

    // Prepare property data (without amenities, since they belong in property_amenities)
    // and initially without images, because we need the property ID first for bucket storage.
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

    // Insert property into database FIRST
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

    // Now upload images using the created property.id
    if (payload.images && payload.images.length > 0) {
      const uploadedUrls = await uploadPropertyImages({
        supabase,
        bucket: PROPERTY_ACTIONS_MESSAGES.labels.propietiesImages,
        userId: user.id,
        propertyId: propertyData.id,
        files: payload.images,
      })

      // Update the property with the uploaded image URLs
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

    // Insert amenities into related table
    if (payload.amenities && payload.amenities.length > 0) {
      // Use service role to bypass RLS for inserting new amenities
      const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      // Ensure amenities exist in the amenities table (using the amenity string as ID and Label temporarily)
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

      // Now insert the relations using normal client
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
