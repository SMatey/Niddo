-- Add email field to profiles table
ALTER TABLE profiles ADD COLUMN email TEXT;

-- Sync existing profiles with their emails
UPDATE profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id::text;

