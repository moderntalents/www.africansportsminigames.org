/*
  # Create Gallery Storage Bucket

  ## Summary
  Creates the `gallery` public storage bucket so uploaded images can be
  served publicly. The RLS policies on storage.objects were already applied
  in previous migrations; this migration only creates the missing bucket row.

  ## Changes
  - Inserts a new bucket named `gallery` with public = true into storage.buckets
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery',
  'gallery',
  true,
  10485760,
  ARRAY['image/jpeg','image/png','image/webp','image/gif','image/heic','image/heif']
)
ON CONFLICT (id) DO UPDATE SET public = true;
