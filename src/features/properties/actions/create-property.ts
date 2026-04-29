'use server'

import { createClient } from '@/lib/supabase/server'
import type { PublicationFormValues } from '@/features/properties/schemas/publication.schema'
import type { Property } from '@/lib/supabase/types'
import { PROPERTY_ACTIONS_MESSAGES } from '@/features/properties/constants/property-actions.constants'

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

    // Prepare property data
    const propertyData = {
      id: `prop-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      owner_id: user.id,
      title: payload.title,
      description: payload.description || null,
      price: Math.round(Number(payload.price.replace(/,/g, '')) || 0),
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
      images: [], // Will be populated if images are uploaded
    }

    // Upload images if provided
    if (payload.images && payload.images.length > 0) {
      const uploadedImages: string[] = []

      for (const file of payload.images) {
        try {
          const fileExt = file.name.split('.').pop()
          const fileName = `${propertyData.id}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
          const filePath = `properties/${user.id}/${fileName}`

          const { error: uploadError, data } = await supabase.storage
            .from('property-images')
            .upload(filePath, file)

          if (uploadError) {
            console.error('Error uploading image:', uploadError)
            continue
          }

          if (data) {
            const {
              data: { publicUrl },
            } = supabase.storage.from('property-images').getPublicUrl(filePath)

            uploadedImages.push(publicUrl)
          }
        } catch (error) {
          console.error('Error processing image upload:', error)
          continue
        }
      }

      propertyData.images = uploadedImages
    }

    // Insert property into database
    const { data: createdProperty, error: insertError } = await supabase
      .from('properties')
      .insert([propertyData])
      .select()
      .single()

    if (insertError) {
      console.error('Database error:', insertError)
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
    console.error('Unexpected error in createProperty:', error)
    return {
      success: false,
      error: PROPERTY_ACTIONS_MESSAGES.errors.unexpectedError,
    }
  }
}
