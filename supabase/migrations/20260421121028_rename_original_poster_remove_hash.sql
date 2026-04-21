/*
  # Rename poster URLs to remove '#' character

  1. Changes
    - Update `resource_posters` rows where `public_url` or `preview_url`
      reference the old filename `original_poster_#1.png.jpeg`, replacing it
      with `original_poster_1.jpeg`.
  2. Notes
    - The `#` character is not allowed on Netlify deployments and breaks
      static asset links. The new filename already exists in `/public` and
      `/dist` and is bundled with the build.
*/

UPDATE resource_posters
SET
  public_url = '/original_poster_1.jpeg',
  preview_url = '/original_poster_1.jpeg'
WHERE public_url LIKE '%original_poster_#1.png.jpeg%'
   OR preview_url LIKE '%original_poster_#1.png.jpeg%';
