-- Verify and sync emails from auth.users to profiles
UPDATE profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id::text AND p.email IS NULL;

-- Add RLS policy to allow viewing email
CREATE POLICY "Email is viewable by everyone" ON profiles FOR SELECT USING (true);

