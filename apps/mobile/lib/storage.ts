import { supabase } from './supabase';
import { getCurrentUser } from './supabase';

/**
 * Upload an image to Supabase Storage
 * @param uri - Local image URI (from camera)
 * @param bucket - Storage bucket name ('space-images', 'annotated-images', 'diagrams')
 * @param filename - Optional custom filename (defaults to timestamp-uuid)
 */
export const uploadImage = async (
  uri: string,
  bucket: 'space-images' | 'annotated-images' | 'diagrams',
  filename?: string
): Promise<string | null> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      console.error('No authenticated user');
      return null;
    }

    // Generate filename if not provided
    const safeFilename = filename || `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
    const fullPath = `${user.id}/${safeFilename}`;

    // Convert URI to blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fullPath, blob, {
        contentType: blob.type || 'image/jpeg',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fullPath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Upload failed:', error);
    return null;
  }
};

/**
 * Upload multiple images
 */
export const uploadImages = async (
  uris: string[],
  bucket: 'space-images' | 'annotated-images' | 'diagrams'
): Promise<string[]> => {
  const urls: string[] = [];

  for (const uri of uris) {
    const url = await uploadImage(uri, bucket);
    if (url) {
      urls.push(url);
    }
  }

  return urls;
};

/**
 * Delete an image from storage
 */
export const deleteImage = async (
  publicUrl: string,
  bucket: 'space-images' | 'annotated-images' | 'diagrams'
): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    if (!user) return false;

    // Extract path from public URL
    const urlParts = publicUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const path = `${user.id}/${fileName}`;

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    return !error;
  } catch (error) {
    console.error('Delete failed:', error);
    return false;
  }
};
