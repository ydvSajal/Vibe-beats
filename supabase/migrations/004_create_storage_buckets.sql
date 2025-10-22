-- ============================================================================
-- Migration: Create Storage Buckets with RLS Policies for Vibe Beats
-- ============================================================================
-- NOTE: Storage buckets CANNOT be created via SQL - must use Supabase UI or API
-- But you CAN create RLS policies with this SQL

-- ============================================================================
-- STORAGE BUCKET SETUP (Supabase UI)
-- ============================================================================
-- Do the following in Supabase Dashboard:
-- 1. Go to Storage → Buckets
-- 2. Create new bucket called: "avatars"
--    - Make PUBLIC (toggle public access)
--    - Upload limit: 5 MB
-- 3. Create new bucket called: "profile-pictures"
--    - Make PUBLIC (toggle public access)
--    - Upload limit: 10 MB
-- 4. Create new bucket called: "cover-photos"
--    - Make PUBLIC (toggle public access)
--    - Upload limit: 10 MB

-- ============================================================================
-- STORAGE RLS POLICIES (SQL - Run this after creating buckets)
-- ============================================================================

-- ============================================================================
-- 1. AVATARS BUCKET POLICIES
-- ============================================================================

-- Policy: Users can view avatars (public)
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

-- Policy: Users can upload to their own folder
CREATE POLICY "Users can upload avatars" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can delete their own avatars
CREATE POLICY "Users can delete own avatars" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================================
-- 2. PROFILE PICTURES BUCKET POLICIES
-- ============================================================================

-- Policy: Users can view profile pictures (public)
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'profile-pictures');

-- Policy: Users can upload to their own folder
CREATE POLICY "Users can upload profiles" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-pictures' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can delete their own profile pictures
CREATE POLICY "Users can delete own profiles" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'profile-pictures' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================================
-- 3. COVER PHOTOS BUCKET POLICIES
-- ============================================================================

-- Policy: Users can view cover photos (public)
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'cover-photos');

-- Policy: Users can upload cover photos
CREATE POLICY "Users can upload covers" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'cover-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can delete their own covers
CREATE POLICY "Users can delete own covers" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'cover-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================================
-- STORAGE FOLDER STRUCTURE (Create these paths when uploading)
-- ============================================================================
-- avatars/[user-id]/[filename].jpg
-- profile-pictures/[user-id]/[filename].jpg
-- cover-photos/[user-id]/[filename].jpg

-- ============================================================================
-- Storage setup complete!
-- ============================================================================
