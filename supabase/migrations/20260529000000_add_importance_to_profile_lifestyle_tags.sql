-- Add importance column to profile_lifestyle_tags for roomie preference priorities
-- This enables users to set priority levels (must-have, important, nice-to-have, indifferent) for each lifestyle tag

ALTER TABLE profile_lifestyle_tags
ADD COLUMN importance TEXT
DEFAULT 'important'
CHECK (importance IN ('must-have', 'important', 'nice-to-have', 'indifferent'));

-- Set default importance for existing rows
UPDATE profile_lifestyle_tags SET importance = 'important' WHERE importance IS NULL;

-- Add NOT NULL constraint after data is migrated
ALTER TABLE profile_lifestyle_tags ALTER COLUMN importance SET NOT NULL;
