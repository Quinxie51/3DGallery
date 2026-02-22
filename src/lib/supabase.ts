import { createClient } from '@supabase/supabase-js';

// These will be set via environment variables
// You'll need to create a .env file with your Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface GalleryData {
  id: string;
  created_at: string;
  updated_at: string;
  photos: PhotoData[];
  sky_mode: string;
  youtube_url: string | null;
}

export interface PhotoData {
  url: string | null;
  position: [number, number, number];
  rotation: [number, number, number];
  title: string;
  description: string;
  artist: string;
  year: string;
}

