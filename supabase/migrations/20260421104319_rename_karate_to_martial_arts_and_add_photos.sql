/*
  # Rename Karate to Martial Arts and add photos

  1. Data updates
    - Updates all gallery_photos with sport_category = 'Karate' to 'Martial Arts'
  2. New data
    - Inserts 5 new photos into the existing gallery event under Martial Arts category
*/

UPDATE gallery_photos
SET sport_category = 'Martial Arts'
WHERE sport_category = 'Karate';

DO $$
DECLARE
  ev_id uuid;
BEGIN
  SELECT id INTO ev_id FROM gallery_events ORDER BY created_at DESC LIMIT 1;

  IF ev_id IS NOT NULL THEN
    INSERT INTO gallery_photos (gallery_event_id, storage_path, public_url, filename, sport_category)
    VALUES
      (ev_id, 'public/kenpo_kids1.jpg', '/kenpo_kids1.jpg', 'Martial Arts Training Line-up.jpg', 'Martial Arts'),
      (ev_id, 'public/IMG-20240706-WA0099.jpg', '/IMG-20240706-WA0099.jpg', 'Martial Arts Session 1.jpg', 'Martial Arts'),
      (ev_id, 'public/IMG-20240706-WA0028.jpg', '/IMG-20240706-WA0028.jpg', 'Martial Arts Session 2.jpg', 'Martial Arts'),
      (ev_id, 'public/IMG_20221116_161659_215.jpg', '/IMG_20221116_161659_215.jpg', 'Martial Arts Certificate Presentation.jpg', 'Martial Arts'),
      (ev_id, 'public/0c56ab1063087ba6f6f59f554baf15b9.jpg', '/0c56ab1063087ba6f6f59f554baf15b9.jpg', 'Martial Arts Community Event.jpg', 'Martial Arts')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;