import { supabase, GalleryData, PhotoData } from '../lib/supabase';

// Generate a random gallery ID
export function generateGalleryId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Save a gallery to Supabase
export async function saveGallery(
  photos: PhotoData[],
  skyMode: string,
  youtubeUrl: string,
  galleryId?: string
): Promise<{ success: boolean; galleryId: string; error?: string }> {
  try {
    const id = galleryId || generateGalleryId();
    
    // Upload images to Supabase Storage and replace data URLs with storage URLs
    const photosWithStorageUrls = await Promise.all(
      photos.map(async (photo, index) => {
        if (photo.url && photo.url.startsWith('data:')) {
          // This is a base64 data URL, upload it to storage
          const imageUrl = await uploadImageToStorage(photo.url, id, index);
          return { ...photo, url: imageUrl };
        }
        return photo;
      })
    );

    const galleryData = {
      id,
      photos: photosWithStorageUrls,
      sky_mode: skyMode,
      youtube_url: youtubeUrl || null,
      updated_at: new Date().toISOString(),
    };

    // Check if gallery exists
    const { data: existing } = await supabase
      .from('galleries')
      .select('id')
      .eq('id', id)
      .single();

    if (existing) {
      // Update existing gallery
      const { error } = await supabase
        .from('galleries')
        .update(galleryData)
        .eq('id', id);

      if (error) throw error;
    } else {
      // Insert new gallery
      const { error } = await supabase
        .from('galleries')
        .insert({ ...galleryData, created_at: new Date().toISOString() });

      if (error) throw error;
    }

    return { success: true, galleryId: id };
  } catch (error) {
    console.error('Error saving gallery:', error);
    return { 
      success: false, 
      galleryId: '', 
      error: error instanceof Error ? error.message : 'Failed to save gallery' 
    };
  }
}

// Load a gallery from Supabase
export async function loadGallery(galleryId: string): Promise<{
  success: boolean;
  data?: GalleryData;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('galleries')
      .select('*')
      .eq('id', galleryId)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Gallery not found');

    return { success: true, data };
  } catch (error) {
    console.error('Error loading gallery:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load gallery',
    };
  }
}

// Upload image to Supabase Storage
async function uploadImageToStorage(
  dataUrl: string,
  galleryId: string,
  photoIndex: number
): Promise<string> {
  try {
    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    // Generate unique filename
    const filename = `${galleryId}/photo-${photoIndex}-${Date.now()}.jpg`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('gallery-photos')
      .upload(filename, blob, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('gallery-photos')
      .getPublicUrl(filename);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    // Return the original data URL as fallback
    return dataUrl;
  }
}

// Delete a gallery's images from storage
export async function deleteGalleryImages(galleryId: string): Promise<void> {
  try {
    const { data: files } = await supabase.storage
      .from('gallery-photos')
      .list(galleryId);

    if (files && files.length > 0) {
      const filePaths = files.map(file => `${galleryId}/${file.name}`);
      await supabase.storage.from('gallery-photos').remove(filePaths);
    }
  } catch (error) {
    console.error('Error deleting gallery images:', error);
  }
}

