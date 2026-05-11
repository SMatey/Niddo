'use server'

import { createClient } from '@/lib/supabase/server'
import type { PublicationFormValues } from '@/features/properties/schemas/publication.schema'
import { PROPERTY_ACTIONS_MESSAGES } from '@/features/properties/constants/property-actions.constants'
import { uploadPropertyImages } from '@/features/properties/lib/property-image-upload'

export interface UpdatePropertyPayload extends PublicationFormValues {
  images: File[] | string[]
  navigationUrl: string
}

export async function updateProperty(propertyId: string, payload: UpdatePropertyPayload) {
  try {
    // For Deno edge functions update via token (or normal client)
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: PROPERTY_ACTIONS_MESSAGES.errors.unauthorized }
    }

    // Prepare data
    const propertyData: any = {
      title: payload.title,
      description: payload.description || null,
      price: payload.price,
      location: payload.location,
      latitude: payload.latitude,
      longitude: payload.longitude,
      bedrooms: payload.bedrooms || 1,
      bathrooms: payload.bathrooms || 1,
      area: payload.squareMeters || 0,
      rules: payload.rules || [],
    }

    // Handle new images upload
    const newImageFiles = payload.images.filter((img): img is File => img instanceof File);
    let allImageUrls = payload.images.filter((img): img is string => typeof img === 'string');

    if (newImageFiles.length > 0) {
      const uploadedUrls = await uploadPropertyImages({
        supabase,
        bucket: PROPERTY_ACTIONS_MESSAGES.labels.propietiesImages,
        userId: user.id,
        propertyId,
        files: newImageFiles,
      });
      allImageUrls = [...allImageUrls, ...uploadedUrls];
    }

    propertyData.images = allImageUrls;

    // Use Edge function OR direct backend update
    const { data, error } = await supabase.functions.invoke('property-manage', {
      method: 'PUT',
      body: {
        id: propertyId,
        ...propertyData
      }
    });

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('Update update error:', error)
    return { success: false, error: PROPERTY_ACTIONS_MESSAGES.errors.unexpectedError }
  }
}
