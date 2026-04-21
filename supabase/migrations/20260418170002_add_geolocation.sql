ALTER TABLE profiles ADD COLUMN latitude DOUBLE PRECISION;
ALTER TABLE profiles ADD COLUMN longitude DOUBLE PRECISION;

UPDATE profiles SET latitude = 19.4111, longitude = -99.1733 WHERE id = 'user-1';
UPDATE profiles SET latitude = 19.3895, longitude = -99.1686 WHERE id = 'user-2';
UPDATE profiles SET latitude = 19.3467, longitude = -99.1617 WHERE id = 'user-3';
UPDATE profiles SET latitude = 19.4195, longitude = -99.1619 WHERE id = 'user-4';
UPDATE profiles SET latitude = 19.4320, longitude = -99.1937 WHERE id = 'user-5';
UPDATE profiles SET latitude = 19.3595, longitude = -99.2614 WHERE id = 'user-6';

CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(latitude, longitude);
