/*
  # Deactivate Taekwondo sport

  Sets is_active = false for Taekwondo so it no longer appears
  in the Sports Categories section on the public site.
*/

UPDATE sports_categories
SET is_active = false
WHERE name = 'Taekwondo';