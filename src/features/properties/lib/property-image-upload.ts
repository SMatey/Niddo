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
  try {
    const formData = new FormData();
    formData.append('propertyId', propertyId);
    
    // Add all files
    files.forEach((file, index) => {
      formData.append('file', file);
      formData.append('index', String(index));
    });

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    
    if (!token) {
      throw new Error("No session found for uploading images");
    }

    // Call the Edge Function to handle optimized WebP upload
    const { data, error } = await supabase.functions.invoke('property-images-upload', {
      body: formData,
      headers: {
        // Fetch handles FormData content type automatically, don't set it manually
        Authorization: `Bearer ${token}`
      }
    });

    if (error) {
      console.error(PROPERTY_ACTIONS_MESSAGES.errors.NoUploadedImages, error);
      throw error;
    }

    // Extracts ordered URLs
    const urls = (data?.urls || []).map((item: { url: string }) => item.url);
    return urls;
  } catch (err) {
    console.error(PROPERTY_ACTIONS_MESSAGES.errors.NoUploadedImages, err);
    return [];
  }
}

