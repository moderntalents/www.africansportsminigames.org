/*
  # Fix gallery write permissions

  ## Summary
  Remove overly-permissive anonymous write policies from gallery tables and storage.
  Public (anon) users should only be able to READ gallery content.
  Only authenticated (admin) users should be able to INSERT, UPDATE, or DELETE.

  ## Changes
  - Drop anon INSERT/DELETE/UPDATE policies on gallery_events
  - Drop anon INSERT/DELETE policies on gallery_photos
  - Drop anon INSERT/DELETE policies on storage.objects for gallery bucket

  ## Result
  - Guests: can view all gallery events and photos (unchanged)
  - Admin (authenticated): can create, upload, and delete gallery content (unchanged)
  - Guests: can NO LONGER insert or delete gallery data (security fix)
*/

-- Remove anon write policies from gallery_events
DROP POLICY IF EXISTS "Anon can insert gallery events" ON gallery_events;
DROP POLICY IF EXISTS "Anon can delete gallery events" ON gallery_events;
DROP POLICY IF EXISTS "Anon can update gallery events" ON gallery_events;

-- Remove anon write policies from gallery_photos
DROP POLICY IF EXISTS "Anon can insert gallery photos" ON gallery_photos;
DROP POLICY IF EXISTS "Anon can delete gallery photos" ON gallery_photos;

-- Remove anon write policies from storage
DROP POLICY IF EXISTS "Anon can upload gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Anon can delete gallery images" ON storage.objects;
