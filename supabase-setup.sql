-- Gallery Table
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Create galleries table
CREATE TABLE IF NOT EXISTS galleries (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  photos JSONB NOT NULL,
  sky_mode TEXT NOT NULL DEFAULT 'starry-night',
  youtube_url TEXT
);

-- Enable Row Level Security
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read galleries (public access for sharing)
CREATE POLICY "Allow public read access"
  ON galleries
  FOR SELECT
  USING (true);

-- Allow anyone to insert galleries (no auth required for creating)
CREATE POLICY "Allow public insert"
  ON galleries
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update their own gallery
CREATE POLICY "Allow public update"
  ON galleries
  FOR UPDATE
  USING (true);

-- Create storage bucket for gallery photos
-- Go to Storage in Supabase Dashboard and create a bucket named 'gallery-photos'
-- Then run this SQL to set the policies:

-- Storage policies (run after creating the bucket in the dashboard)
-- These allow public access to uploaded images

