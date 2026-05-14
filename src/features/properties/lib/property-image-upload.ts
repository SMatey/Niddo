'use server'

import type { SupabaseClient } from '@supabase/supabase-js'
import { PROPERTY_ACTIONS_MESSAGES } from '@/features/properties/constants/property-actions.constants'

interface UploadSinglePropertyImageOptions {
  supabase: SupabaseClient
  bucket: string
  userId: string
  propertyId: string
  file: File
}

interface UploadPropertyImagesOptions {
  supabase: SupabaseClient
  bucket: string
  userId: string
  propertyId: string
  files: File[]
}

export async function uploadSinglePropertyImage({
  supabase,
  bucket,
  userId,
  propertyId,
  file,
}: UploadSinglePropertyImageOptions): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'jpg'
  const fileName = `${propertyId}-${crypto.randomUUID()}.${fileExt}`
  const filePath = `properties/${userId}/${fileName}`

  const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file)
  if (uploadError) {
    throw uploadError
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath)

  if (!publicUrl) {
    throw new Error(PROPERTY_ACTIONS_MESSAGES.errors.NoUploadedImages)
  }

  return publicUrl
}

export async function uploadPropertyImages({
  supabase,
  bucket,
  userId,
  propertyId,
  files,
}: UploadPropertyImagesOptions): Promise<string[]> {
  const uploadPromises = files.map((file) =>
    uploadSinglePropertyImage({ supabase, bucket, userId, propertyId, file })
  )

  const results = await Promise.allSettled(uploadPromises)

  return results.reduce<string[]>((uploadedImages, result) => {
    if (result.status === 'fulfilled') {
      uploadedImages.push(result.value)
    } else {
      console.error(PROPERTY_ACTIONS_MESSAGES.errors.NoUploadedImages, result.reason)
    }
    return uploadedImages
  }, [])
}
