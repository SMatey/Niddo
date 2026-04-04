-- ============================================================================
-- 3. IDENTIDAD Y PERFILES
-- ============================================================================

-- ---------------------------------------------------------------------------
-- profiles: extiende auth.users con datos públicos del perfil
-- ---------------------------------------------------------------------------
-- No duplica autenticación; usa el id de auth.users como PK.
-- trust_score se recalcula automáticamente via trigger sobre trust_events.
-- ---------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT UNIQUE NOT NULL,
  full_name   TEXT NOT NULL DEFAULT '',
  avatar_url  TEXT,
  bio         TEXT DEFAULT '',
  birth_date  DATE,
  phone       TEXT,
  role        public.user_role NOT NULL DEFAULT 'user',
  status      public.user_status NOT NULL DEFAULT 'active',
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  trust_score REAL NOT NULL DEFAULT 0.0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'Perfil público del usuario, extiende auth.users';
COMMENT ON COLUMN public.profiles.trust_score IS 'Puntaje 0-100 calculado automáticamente desde trust_events';
COMMENT ON COLUMN public.profiles.role IS 'Rol: user, admin, moderator. Define permisos en RLS';
COMMENT ON COLUMN public.profiles.status IS 'Estado de la cuenta. suspended/banned bloquean acceso';

-- ---------------------------------------------------------------------------
-- user_documents: documentos de identidad para verificación
-- ---------------------------------------------------------------------------
-- Los archivos se almacenan en el bucket "documents" de Supabase Storage.
-- encrypted_metadata guarda datos sensibles cifrados a nivel de aplicación.
-- ---------------------------------------------------------------------------
CREATE TABLE public.user_documents (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type       TEXT NOT NULL DEFAULT 'id_card',
  file_url            TEXT NOT NULL,
  status              public.document_status NOT NULL DEFAULT 'pending',
  encrypted_metadata  JSONB DEFAULT '{}',
  reviewer_id         UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at         TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.user_documents IS 'Documentos de identidad subidos para verificación';
COMMENT ON COLUMN public.user_documents.encrypted_metadata IS 'Metadata cifrada a nivel de aplicación (pgcrypto o app-level AES)';

-- ---------------------------------------------------------------------------
-- privacy_settings: controla visibilidad del perfil en búsquedas
-- ---------------------------------------------------------------------------
CREATE TABLE public.privacy_settings (
  user_id           UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  show_profile      BOOLEAN NOT NULL DEFAULT TRUE,
  show_location     BOOLEAN NOT NULL DEFAULT TRUE,
  show_contact_info BOOLEAN NOT NULL DEFAULT FALSE,
  searchable        BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.privacy_settings IS 'Configuración de privacidad por usuario';


-- ============================================================================
-- 4. PREFERENCIAS Y MATCHING
-- ============================================================================

-- ---------------------------------------------------------------------------
-- user_preferences: criterios de búsqueda del usuario
-- ---------------------------------------------------------------------------
-- preferred_zones usa JSONB con arrays de nombres o IDs de zona.
-- Si se habilita PostGIS a nivel zona, se puede migrar a geography(Polygon).
-- lifestyle_tags almacena etiquetas libres: ["madrugador", "no fumador", ...].
-- ---------------------------------------------------------------------------
CREATE TABLE public.user_preferences (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  budget_min      NUMERIC(10,2) DEFAULT 0,
  budget_max      NUMERIC(10,2) DEFAULT 999999,
  preferred_zones JSONB DEFAULT '[]',
  lifestyle_tags  JSONB DEFAULT '[]',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.user_preferences IS 'Preferencias de búsqueda: presupuesto, zonas, estilo de vida';
COMMENT ON COLUMN public.user_preferences.preferred_zones IS 'Array JSON de nombres/IDs de zonas preferidas';
COMMENT ON COLUMN public.user_preferences.lifestyle_tags IS 'Array JSON de etiquetas de estilo de vida';

-- ---------------------------------------------------------------------------
-- preference_weights: ponderación de atributos para el algoritmo de matching
-- ---------------------------------------------------------------------------
-- Cada fila representa un atributo y su peso relativo (0.0 a 1.0).
-- El algoritmo multiplica la coincidencia de cada atributo por su peso.
-- ---------------------------------------------------------------------------
CREATE TABLE public.preference_weights (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  attribute TEXT NOT NULL,
  weight    REAL NOT NULL DEFAULT 0.5,
  CONSTRAINT preference_weights_weight_range CHECK (weight >= 0.0 AND weight <= 1.0),
  CONSTRAINT preference_weights_user_attribute UNIQUE (user_id, attribute)
);

COMMENT ON TABLE public.preference_weights IS 'Pesos de importancia por atributo para el algoritmo de compatibilidad';


-- ============================================================================
-- 5. PROPIEDADES
-- ============================================================================

-- ---------------------------------------------------------------------------
-- properties: inmuebles publicados en la plataforma
-- ---------------------------------------------------------------------------
-- location usa geography(Point) de PostGIS para consultas de proximidad.
-- status controla la visibilidad: solo "active" aparece en búsquedas.
-- ---------------------------------------------------------------------------
CREATE TABLE public.properties (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT DEFAULT '',
  price        NUMERIC(10,2) NOT NULL,
  status       public.property_status NOT NULL DEFAULT 'draft',
  address_text TEXT DEFAULT '',
  latitude     DOUBLE PRECISION,
  longitude    DOUBLE PRECISION,
  location     extensions.geography(Point, 4326),
  deleted_at   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.properties IS 'Propiedades/apartamentos publicados por propietarios';
COMMENT ON COLUMN public.properties.location IS 'Punto geográfico PostGIS para queries de proximidad (ST_DWithin)';
COMMENT ON COLUMN public.properties.deleted_at IS 'Soft delete: no nulo significa eliminado por moderación';

-- ---------------------------------------------------------------------------
-- property_images: galería de fotos de una propiedad
-- ---------------------------------------------------------------------------
-- order_index permite al usuario reordenar las fotos arrastrándolas.
-- Las imágenes se almacenan en el bucket "property-images".
-- ---------------------------------------------------------------------------
CREATE TABLE public.property_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.property_images IS 'Fotos de propiedades, ordenables por el usuario';

-- ---------------------------------------------------------------------------
-- property_rules: normas de convivencia definidas por el propietario
-- ---------------------------------------------------------------------------
CREATE TABLE public.property_rules (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  rule        TEXT NOT NULL
);

COMMENT ON TABLE public.property_rules IS 'Reglas de convivencia por propiedad (ej: no mascotas)';

-- ---------------------------------------------------------------------------
-- property_availability: períodos de disponibilidad de una propiedad
-- ---------------------------------------------------------------------------
-- Cuando end_date < now(), un cron job o trigger cambia el status a "expired".
-- ---------------------------------------------------------------------------
CREATE TABLE public.property_availability (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  CONSTRAINT property_availability_date_range CHECK (end_date > start_date)
);

COMMENT ON TABLE public.property_availability IS 'Períodos en que la propiedad está disponible';
