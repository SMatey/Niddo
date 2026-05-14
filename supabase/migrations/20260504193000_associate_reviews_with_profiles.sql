CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_author_target_unique
  ON reviews(author_id, target_id);
