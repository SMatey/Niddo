CREATE TABLE property_characteristics (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('furnishing', 'amenities', 'building', 'restrictions', 'location'))
);

CREATE TABLE property_characteristics_tags (
  property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  characteristic_id TEXT NOT NULL REFERENCES property_characteristics(id) ON DELETE CASCADE,
  PRIMARY KEY (property_id, characteristic_id)
);

INSERT INTO property_characteristics (id, label, category) VALUES
  ('pet-friendly', 'Pet Friendly', 'restrictions'),
  ('no-smoking', 'No fumar', 'restrictions'),
  ('furnished', 'Amueblado', 'furnishing'),
  ('pool', 'Piscina', 'amenities'),
  ('parking', 'Estacionamiento', 'amenities'),
  ('air-conditioning', 'Aire acondicionado', 'amenities'),
  ('security-24h', 'Seguridad 24h', 'amenities'),
  ('balcony', 'Balcón', 'amenities'),
  ('garden', 'Terraza/Jardín', 'amenities'),
  ('near-metro', 'Cerca del metro', 'location'),
  ('doorman', 'Portero', 'building'),
  ('elevator', 'Ascensor', 'building'),
  ('laundry', 'Lavadora en edificio', 'amenities'),
  ('internet-fiber', 'Internet fiber', 'amenities'),
  ('workspace', 'Espacio de trabajo', 'amenities')
ON CONFLICT DO NOTHING;

INSERT INTO property_characteristics_tags (property_id, characteristic_id)
SELECT pt.property_id, pt.tag_id
FROM property_lifestyle_tags pt
WHERE pt.tag_id IN ('pet-friendly', 'no-smoking')
ON CONFLICT DO NOTHING;

DELETE FROM property_lifestyle_tags
WHERE tag_id IN ('pet-friendly', 'no-smoking');

DELETE FROM lifestyle_tags
WHERE id IN ('pet-friendly', 'no-smoking');

ALTER TABLE property_characteristics ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_characteristics_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Property characteristics are viewable by everyone"
  ON property_characteristics FOR SELECT USING (true);

CREATE POLICY "Property characteristics tags viewable by everyone"
  ON property_characteristics_tags FOR SELECT USING (true);

CREATE POLICY "Property owner can manage characteristics tags"
  ON property_characteristics_tags FOR ALL USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_characteristics_tags.property_id
      AND properties.owner_id = auth.uid()::TEXT
    )
  );

CREATE INDEX idx_property_characteristics_property
  ON property_characteristics_tags(property_id);
CREATE INDEX idx_property_characteristics_category
  ON property_characteristics(category);

INSERT INTO property_characteristics_tags (property_id, characteristic_id) VALUES
  ('prop-1', 'no-smoking'),
  ('prop-2', 'no-smoking'),
  ('prop-3', 'pet-friendly'),
  ('prop-4', 'no-smoking'),
  ('prop-5', 'no-smoking'),
  ('prop-6', 'no-smoking')
ON CONFLICT DO NOTHING;