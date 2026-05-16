'use server'

import { createServerClient } from '@/lib/supabase/server'
import type { PublicationFormValues } from '@/features/properties/schemas/publication.schema'
import type { Property } from '@/lib/supabase/types'
import { PROPERTY_ACTIONS_MESSAGES } from '@/features/properties/constants/property-actions.constants'
import { uploadPropertyImages } from '@/features/properties/lib/property-image-upload'

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
    const supabase = await createServerClient()

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

    // Prepare property data
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
      amenities: payload.amenities || [],
      rules: payload.rules || [],
      status: PROPERTY_ACTIONS_MESSAGES.status.active,
      available_from: payload.availableFrom || null,
      images: [] as string[],
    }

    if (payload.images && payload.images.length > 0) {
      propertyData.images = await uploadPropertyImages({
        supabase,
        bucket: PROPERTY_ACTIONS_MESSAGES.labels.propietiesImages,
        userId: user.id,
        propertyId: propertyData.id,
        files: payload.images,
      })
    }

    // Insert property into database
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
