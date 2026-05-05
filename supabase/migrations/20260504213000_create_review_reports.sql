CREATE TABLE review_reports (
  id TEXT PRIMARY KEY,
  reporter_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  report_target_type TEXT NOT NULL CHECK (report_target_type IN ('profile', 'property', 'review')),
  report_reason_type TEXT NOT NULL CHECK (report_reason_type IN ('suspicious_behavior', 'fake_review')),
  reported_profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reported_property_id TEXT REFERENCES properties(id) ON DELETE CASCADE,
  related_review_id TEXT REFERENCES reviews(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT review_reports_description_length CHECK (char_length(description) <= 500),
  CONSTRAINT review_reports_target_check CHECK (
    (report_target_type = 'profile' AND reported_property_id IS NULL AND related_review_id IS NULL) OR
    (report_target_type = 'property' AND reported_property_id IS NOT NULL AND related_review_id IS NULL) OR
    (report_target_type = 'review' AND related_review_id IS NOT NULL)
  )
);

CREATE INDEX idx_review_reports_profile ON review_reports(reported_profile_id);
CREATE INDEX idx_review_reports_property ON review_reports(reported_property_id);
CREATE INDEX idx_review_reports_reporter ON review_reports(reporter_id);
CREATE UNIQUE INDEX idx_review_reports_unique_case
  ON review_reports(
    reporter_id,
    report_target_type,
    report_reason_type,
    reported_profile_id,
    COALESCE(reported_property_id, ''),
    COALESCE(related_review_id, '')
  );

ALTER TABLE review_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own review reports"
  ON review_reports
  FOR SELECT
  USING (auth.uid()::TEXT = reporter_id);

CREATE POLICY "Users can create review reports"
  ON review_reports
  FOR INSERT
  WITH CHECK (auth.uid()::TEXT = reporter_id);

CREATE OR REPLACE FUNCTION get_review_report_auto_hide_threshold()
RETURNS INTEGER
LANGUAGE SQL
IMMUTABLE
AS $$
  SELECT 3;
$$;

CREATE OR REPLACE FUNCTION get_review_report_moderation_status(target_type TEXT, target_id TEXT)
RETURNS TABLE (
  report_count BIGINT,
  auto_hide_threshold INTEGER,
  is_hidden BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  normalized_target_type TEXT := lower(target_type);
  resolved_report_count BIGINT := 0;
  resolved_threshold INTEGER := get_review_report_auto_hide_threshold();
BEGIN
  IF normalized_target_type NOT IN ('profile', 'property', 'review') THEN
    RAISE EXCEPTION 'Invalid report target type: %', normalized_target_type;
  END IF;

  SELECT COUNT(*)
  INTO resolved_report_count
  FROM review_reports
  WHERE status IN ('pending', 'reviewed')
    AND (
      (normalized_target_type = 'profile' AND report_target_type = 'profile' AND reported_profile_id = target_id)
      OR
      (normalized_target_type = 'property' AND report_target_type = 'property' AND reported_property_id = target_id)
      OR
      (normalized_target_type = 'review' AND report_target_type = 'review' AND related_review_id = target_id)
    );

  RETURN QUERY
  SELECT
    resolved_report_count,
    resolved_threshold,
    resolved_report_count >= resolved_threshold;
END;
$$;

GRANT EXECUTE ON FUNCTION get_review_report_auto_hide_threshold() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_review_report_moderation_status(TEXT, TEXT) TO anon, authenticated, service_role;
