-- ============================================================================
-- NIDDO - Schema Inicial de Base de Datos
-- ============================================================================
-- Plataforma de búsqueda de roomies y propiedades compartidas.
-- Este script crea el schema completo sobre Supabase (PostgreSQL 15+).
--
-- Secciones:
--   1.  Extensiones
--   2.  Tipos enumerados (ENUMs)
--   3.  Identidad y perfiles
--   4.  Preferencias y matching
--   5.  Propiedades
--   6.  Búsqueda, favoritos y matches
--   7.  Mensajería en tiempo real
--   8.  Reseñas y reputación
--   9.  Reportes y moderación
--   10. Invitaciones
--   11. Notificaciones
--   12. Índices de rendimiento
--   13. Funciones y triggers
--   14. Row Level Security (RLS)
--   15. Storage buckets
-- ============================================================================


-- ============================================================================
-- 1. EXTENSIONES
-- ============================================================================
-- PostGIS: consultas geoespaciales (propiedades cercanas, búsqueda por mapa)
CREATE EXTENSION IF NOT EXISTS postgis SCHEMA extensions;

-- pgcrypto: generación de UUIDs y funciones criptográficas
CREATE EXTENSION IF NOT EXISTS pgcrypto SCHEMA extensions;

-- pg_trgm: búsqueda difusa por similitud de texto (buscador principal)
CREATE EXTENSION IF NOT EXISTS pg_trgm SCHEMA extensions;


-- ============================================================================
-- 2. TIPOS ENUMERADOS (ENUMs)
-- ============================================================================

-- Rol del usuario en la plataforma
CREATE TYPE public.user_role AS ENUM ('user', 'admin', 'moderator');

-- Estado de la cuenta del usuario
CREATE TYPE public.user_status AS ENUM ('active', 'suspended', 'banned');

-- Estado de verificación de documentos de identidad
CREATE TYPE public.document_status AS ENUM ('pending', 'approved', 'rejected');

-- Estado de publicación de una propiedad
CREATE TYPE public.property_status AS ENUM ('draft', 'active', 'paused', 'expired');

-- Estado de una invitación de propietario a buscador
CREATE TYPE public.invitation_status AS ENUM ('pending', 'accepted', 'rejected', 'expired');

-- Estado de un reporte de moderación
CREATE TYPE public.report_status AS ENUM ('pending', 'resolved', 'dismissed');

-- Tipo de entidad que puede ser reportada
CREATE TYPE public.report_target_type AS ENUM ('user', 'property', 'review');

-- Estado de visibilidad de una reseña
CREATE TYPE public.review_status AS ENUM ('visible', 'hidden', 'removed');

-- Tipo de contenido en un mensaje de chat
CREATE TYPE public.message_type AS ENUM ('text', 'image', 'system');

-- Tipo de notificación del sistema
CREATE TYPE public.notification_type AS ENUM (
  'message',
  'invitation',
  'review',
  'report_resolved',
  'verification_update',
  'match_found',
  'system'
);

-- Tipo de evento que afecta el puntaje de confianza
CREATE TYPE public.trust_event_type AS ENUM (
  'verification_approved',
  'verification_rejected',
  'review_received',
  'report_filed_against',
  'report_dismissed',
  'profile_completed',
  'invitation_accepted'
);

-- Tipo de acción administrativa
CREATE TYPE public.admin_action_type AS ENUM (
  'ban_user',
  'suspend_user',
  'reactivate_user',
  'delete_property',
  'hide_review',
  'remove_review',
  'resolve_report',
  'dismiss_report'
);


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


-- ============================================================================
-- 6. BÚSQUEDA, FAVORITOS Y MATCHES
-- ============================================================================

-- ---------------------------------------------------------------------------
-- favorites: propiedades o perfiles guardados por el usuario
-- ---------------------------------------------------------------------------
-- Un favorito apunta a una propiedad O a un usuario, nunca ambos.
-- Unique constraints evitan duplicados.
-- ---------------------------------------------------------------------------
CREATE TABLE public.favorites (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id    UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT favorites_one_target CHECK (
    (property_id IS NOT NULL AND target_user_id IS NULL) OR
    (property_id IS NULL AND target_user_id IS NOT NULL)
  ),
  CONSTRAINT favorites_unique_property UNIQUE (user_id, property_id),
  CONSTRAINT favorites_unique_user UNIQUE (user_id, target_user_id)
);

COMMENT ON TABLE public.favorites IS 'Lista de favoritos del usuario (propiedades o perfiles)';

-- ---------------------------------------------------------------------------
-- matches: compatibilidad precomputada para el muro de recomendaciones
-- ---------------------------------------------------------------------------
-- score se calcula offline y se ordena descendentemente para el feed.
-- Puede apuntar a un usuario (roomie) o a una propiedad.
-- ---------------------------------------------------------------------------
CREATE TABLE public.matches (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id    UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  score          REAL NOT NULL DEFAULT 0,
  computed_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT matches_score_range CHECK (score >= 0 AND score <= 100),
  CONSTRAINT matches_one_target CHECK (
    (target_user_id IS NOT NULL AND property_id IS NULL) OR
    (target_user_id IS NULL AND property_id IS NOT NULL)
  )
);

COMMENT ON TABLE public.matches IS 'Compatibilidad precomputada entre usuario y roomies/propiedades';
COMMENT ON COLUMN public.matches.score IS 'Porcentaje de compatibilidad 0-100';


-- ============================================================================
-- 7. MENSAJERÍA EN TIEMPO REAL
-- ============================================================================

-- ---------------------------------------------------------------------------
-- conversations: hilo de conversación entre dos o más usuarios
-- ---------------------------------------------------------------------------
CREATE TABLE public.conversations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.conversations IS 'Hilos de conversación (chat)';

-- ---------------------------------------------------------------------------
-- conversation_participants: relación usuario ↔ conversación
-- ---------------------------------------------------------------------------
-- is_blocked impide que el otro participante envíe mensajes.
-- is_archived oculta la conversación de la bandeja sin eliminarla.
-- last_read_at permite calcular mensajes no leídos.
-- ---------------------------------------------------------------------------
CREATE TABLE public.conversation_participants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_blocked      BOOLEAN NOT NULL DEFAULT FALSE,
  is_archived     BOOLEAN NOT NULL DEFAULT FALSE,
  last_read_at    TIMESTAMPTZ DEFAULT now(),
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT conversation_participants_unique UNIQUE (conversation_id, user_id)
);

COMMENT ON TABLE public.conversation_participants IS 'Participantes de cada conversación con estado de lectura';
COMMENT ON COLUMN public.conversation_participants.last_read_at IS 'Marca temporal del último mensaje leído, para calcular unread count';

-- ---------------------------------------------------------------------------
-- messages: mensajes individuales dentro de una conversación
-- ---------------------------------------------------------------------------
CREATE TABLE public.messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content         TEXT NOT NULL DEFAULT '',
  type            public.message_type NOT NULL DEFAULT 'text',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.messages IS 'Mensajes de chat dentro de conversaciones';

-- ---------------------------------------------------------------------------
-- message_attachments: archivos adjuntos a un mensaje
-- ---------------------------------------------------------------------------
-- Los archivos se almacenan en el bucket "chat-attachments".
-- ---------------------------------------------------------------------------
CREATE TABLE public.message_attachments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  file_url   TEXT NOT NULL,
  file_type  TEXT DEFAULT 'image',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.message_attachments IS 'Archivos adjuntos en mensajes de chat';


-- ============================================================================
-- 8. RESEÑAS Y REPUTACIÓN
-- ============================================================================

-- ---------------------------------------------------------------------------
-- reviews: valoraciones de usuarios sobre roomies o propiedades
-- ---------------------------------------------------------------------------
-- is_cohabitation_confirmed indica si se verificó convivencia real.
-- status permite ocultar reseñas por moderación automática o manual.
-- ---------------------------------------------------------------------------
CREATE TABLE public.reviews (
  id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id                UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_user_id             UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id                UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  rating                     SMALLINT NOT NULL,
  comment                    TEXT DEFAULT '',
  status                     public.review_status NOT NULL DEFAULT 'visible',
  is_cohabitation_confirmed  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at                 TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT reviews_rating_range CHECK (rating >= 1 AND rating <= 5),
  CONSTRAINT reviews_one_target CHECK (
    (target_user_id IS NOT NULL AND property_id IS NULL) OR
    (target_user_id IS NULL AND property_id IS NOT NULL)
  ),
  CONSTRAINT reviews_no_self_review CHECK (reviewer_id != target_user_id)
);

COMMENT ON TABLE public.reviews IS 'Reseñas de usuarios sobre roomies o propiedades';
COMMENT ON COLUMN public.reviews.is_cohabitation_confirmed IS 'True si se verificó convivencia real antes de permitir la reseña';

-- ---------------------------------------------------------------------------
-- trust_events: eventos que afectan el puntaje de confianza
-- ---------------------------------------------------------------------------
-- Un trigger recalcula profiles.trust_score cada vez que se inserta un evento.
-- ---------------------------------------------------------------------------
CREATE TABLE public.trust_events (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type public.trust_event_type NOT NULL,
  value      REAL NOT NULL DEFAULT 0,
  metadata   JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.trust_events IS 'Historial de eventos que modifican el trust_score del usuario';
COMMENT ON COLUMN public.trust_events.value IS 'Valor positivo o negativo que suma/resta al trust_score';


-- ============================================================================
-- 9. REPORTES Y MODERACIÓN
-- ============================================================================

-- ---------------------------------------------------------------------------
-- reports: denuncias de usuarios sobre contenido o comportamiento
-- ---------------------------------------------------------------------------
-- Cuando un target acumula más de N reportes pendientes, un trigger
-- oculta automáticamente el contenido (hide review / pause property).
-- ---------------------------------------------------------------------------
CREATE TABLE public.reports (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type public.report_target_type NOT NULL,
  target_id   UUID NOT NULL,
  reason      TEXT NOT NULL,
  status      public.report_status NOT NULL DEFAULT 'pending',
  resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.reports IS 'Reportes de comportamiento sospechoso o contenido inapropiado';

-- ---------------------------------------------------------------------------
-- admin_actions: registro de acciones administrativas (auditoría)
-- ---------------------------------------------------------------------------
CREATE TABLE public.admin_actions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_type public.admin_action_type NOT NULL,
  target_type public.report_target_type NOT NULL,
  target_id   UUID NOT NULL,
  reason      TEXT DEFAULT '',
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.admin_actions IS 'Auditoría de acciones de moderación realizadas por admins';


-- ============================================================================
-- 10. INVITACIONES
-- ============================================================================

-- ---------------------------------------------------------------------------
-- invitations: propietario invita proactivamente a buscadores compatibles
-- ---------------------------------------------------------------------------
CREATE TABLE public.invitations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  sender_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status      public.invitation_status NOT NULL DEFAULT 'pending',
  message     TEXT DEFAULT '',
  expires_at  TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT invitations_no_self_invite CHECK (sender_id != receiver_id)
);

COMMENT ON TABLE public.invitations IS 'Invitaciones de propietarios a buscadores de roomie';
COMMENT ON COLUMN public.invitations.expires_at IS 'Las invitaciones expiran automáticamente tras 7 días por defecto';


-- ============================================================================
-- 11. NOTIFICACIONES
-- ============================================================================

-- ---------------------------------------------------------------------------
-- notifications: alertas del sistema hacia el usuario
-- ---------------------------------------------------------------------------
-- Se usa con Supabase Realtime para push en tiempo real.
-- reference_type + reference_id permiten enlazar a cualquier entidad.
-- ---------------------------------------------------------------------------
CREATE TABLE public.notifications (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type           public.notification_type NOT NULL,
  title          TEXT NOT NULL,
  body           TEXT DEFAULT '',
  reference_type TEXT,
  reference_id   UUID,
  is_read        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.notifications IS 'Notificaciones del sistema para el usuario (Realtime)';


-- ============================================================================
-- 12. ÍNDICES DE RENDIMIENTO
-- ============================================================================

-- Propiedades: búsqueda por precio, estado y geolocalización
CREATE INDEX idx_properties_status ON public.properties(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_properties_price ON public.properties(price) WHERE status = 'active' AND deleted_at IS NULL;
CREATE INDEX idx_properties_owner ON public.properties(owner_id);
CREATE INDEX idx_properties_location ON public.properties USING GIST (location);

-- Búsqueda de texto con trigram en título de propiedades
CREATE INDEX idx_properties_title_trgm ON public.properties USING GIN (title extensions.gin_trgm_ops);

-- Matches: ordenamiento por score descendente
CREATE INDEX idx_matches_user_score ON public.matches(user_id, score DESC);
CREATE INDEX idx_matches_computed ON public.matches(computed_at);

-- Mensajes: consultas por conversación ordenadas cronológicamente
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);

-- Participantes de conversación
CREATE INDEX idx_conversation_participants_user ON public.conversation_participants(user_id);

-- Favoritos
CREATE INDEX idx_favorites_user ON public.favorites(user_id);

-- Notificaciones: bandeja de alertas no leídas
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, created_at DESC) WHERE is_read = FALSE;

-- Reportes pendientes
CREATE INDEX idx_reports_pending ON public.reports(target_type, target_id) WHERE status = 'pending';

-- Trust events por usuario
CREATE INDEX idx_trust_events_user ON public.trust_events(user_id);

-- Invitaciones pendientes por receptor
CREATE INDEX idx_invitations_receiver ON public.invitations(receiver_id) WHERE status = 'pending';

-- Reviews visibles por target
CREATE INDEX idx_reviews_target_user ON public.reviews(target_user_id) WHERE status = 'visible';
CREATE INDEX idx_reviews_property ON public.reviews(property_id) WHERE status = 'visible';

-- Documentos por usuario
CREATE INDEX idx_user_documents_user ON public.user_documents(user_id);

-- Disponibilidad por propiedad
CREATE INDEX idx_property_availability_property ON public.property_availability(property_id);


-- ============================================================================
-- 13. FUNCIONES Y TRIGGERS
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Función auxiliar: actualizar updated_at automáticamente
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers de updated_at en tablas que lo requieren
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_privacy_settings_updated_at
  BEFORE UPDATE ON public.privacy_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ---------------------------------------------------------------------------
-- Función: sincronizar location PostGIS desde latitude/longitude
-- ---------------------------------------------------------------------------
-- Cuando se insertan o actualizan lat/lng, se genera el punto geográfico.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sync_property_location()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::extensions.geography;
  ELSE
    NEW.location = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_properties_sync_location
  BEFORE INSERT OR UPDATE OF latitude, longitude ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.sync_property_location();

-- ---------------------------------------------------------------------------
-- Función: recalcular trust_score cuando se inserta un trust_event
-- ---------------------------------------------------------------------------
-- Suma todos los values del usuario, los normaliza entre 0 y 100.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.recalculate_trust_score()
RETURNS TRIGGER AS $$
DECLARE
  raw_score REAL;
  clamped_score REAL;
BEGIN
  SELECT COALESCE(SUM(value), 0) INTO raw_score
  FROM public.trust_events
  WHERE user_id = NEW.user_id;

  -- Normalizar: clamp entre 0 y 100
  clamped_score = GREATEST(0, LEAST(100, raw_score));

  UPDATE public.profiles
  SET trust_score = clamped_score
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_trust_events_recalculate
  AFTER INSERT ON public.trust_events
  FOR EACH ROW EXECUTE FUNCTION public.recalculate_trust_score();

-- ---------------------------------------------------------------------------
-- Función: auto-ocultar contenido cuando acumula demasiados reportes
-- ---------------------------------------------------------------------------
-- Umbral: 3 reportes pendientes sobre el mismo target ocultan el contenido.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.auto_moderate_on_report()
RETURNS TRIGGER AS $$
DECLARE
  report_count INTEGER;
  report_threshold CONSTANT INTEGER := 3;
BEGIN
  SELECT COUNT(*) INTO report_count
  FROM public.reports
  WHERE target_type = NEW.target_type
    AND target_id = NEW.target_id
    AND status = 'pending';

  -- Auto-ocultar si supera el umbral
  IF report_count >= report_threshold THEN
    CASE NEW.target_type
      WHEN 'review' THEN
        UPDATE public.reviews SET status = 'hidden' WHERE id = NEW.target_id;
      WHEN 'property' THEN
        UPDATE public.properties SET status = 'paused' WHERE id = NEW.target_id;
      WHEN 'user' THEN
        UPDATE public.profiles SET status = 'suspended' WHERE id = NEW.target_id;
    END CASE;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_reports_auto_moderate
  AFTER INSERT ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.auto_moderate_on_report();

-- ---------------------------------------------------------------------------
-- Función: expirar invitaciones vencidas
-- ---------------------------------------------------------------------------
-- Se ejecuta via pg_cron o una Edge Function periódica.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.expire_old_invitations()
RETURNS void AS $$
BEGIN
  UPDATE public.invitations
  SET status = 'expired'
  WHERE status = 'pending' AND expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------------------------
-- Función: expirar propiedades cuya disponibilidad ha pasado
-- ---------------------------------------------------------------------------
-- Cambia status a 'expired' si todas las availability han vencido.
-- Se ejecuta via pg_cron o una Edge Function periódica.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.expire_unavailable_properties()
RETURNS void AS $$
BEGIN
  UPDATE public.properties p
  SET status = 'expired'
  WHERE p.status = 'active'
    AND p.deleted_at IS NULL
    AND NOT EXISTS (
      SELECT 1 FROM public.property_availability pa
      WHERE pa.property_id = p.id
        AND pa.end_date >= CURRENT_DATE
    )
    AND EXISTS (
      SELECT 1 FROM public.property_availability pa
      WHERE pa.property_id = p.id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------------------------
-- Función: crear perfil automáticamente al registrar usuario en auth
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || LEFT(NEW.id::TEXT, 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );

  -- Crear configuración de privacidad por defecto
  INSERT INTO public.privacy_settings (user_id) VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================================
-- 14. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preference_weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------------------
-- PROFILES
-- -------------------------------------------------------------------------
-- Cualquiera autenticado puede ver perfiles activos y públicos
CREATE POLICY profiles_select ON public.profiles
  FOR SELECT USING (
    status = 'active'
    OR id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
  );

-- Usuario solo edita su propio perfil
CREATE POLICY profiles_update ON public.profiles
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admins pueden actualizar cualquier perfil (suspender, banear, etc.)
CREATE POLICY profiles_admin_update ON public.profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- -------------------------------------------------------------------------
-- USER DOCUMENTS
-- -------------------------------------------------------------------------
-- Usuario ve sus propios documentos
CREATE POLICY user_documents_select ON public.user_documents
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
  );

-- Usuario sube sus propios documentos
CREATE POLICY user_documents_insert ON public.user_documents
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Admins pueden actualizar estado del documento
CREATE POLICY user_documents_admin_update ON public.user_documents
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
  );

-- -------------------------------------------------------------------------
-- PRIVACY SETTINGS
-- -------------------------------------------------------------------------
CREATE POLICY privacy_settings_owner ON public.privacy_settings
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- -------------------------------------------------------------------------
-- USER PREFERENCES
-- -------------------------------------------------------------------------
CREATE POLICY user_preferences_owner ON public.user_preferences
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- -------------------------------------------------------------------------
-- PREFERENCE WEIGHTS
-- -------------------------------------------------------------------------
CREATE POLICY preference_weights_owner ON public.preference_weights
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- -------------------------------------------------------------------------
-- PROPERTIES
-- -------------------------------------------------------------------------
-- Cualquiera autenticado ve propiedades activas no eliminadas
CREATE POLICY properties_select ON public.properties
  FOR SELECT USING (
    (status = 'active' AND deleted_at IS NULL)
    OR owner_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
  );

-- Propietario puede insertar
CREATE POLICY properties_insert ON public.properties
  FOR INSERT WITH CHECK (owner_id = auth.uid());

-- Propietario puede editar sus propiedades
CREATE POLICY properties_update ON public.properties
  FOR UPDATE USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Admin puede editar cualquier propiedad
CREATE POLICY properties_admin_update ON public.properties
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Propietario puede eliminar (soft delete)
CREATE POLICY properties_delete ON public.properties
  FOR DELETE USING (
    owner_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- -------------------------------------------------------------------------
-- PROPERTY IMAGES / RULES / AVAILABILITY
-- -------------------------------------------------------------------------
-- Lectura pública para propiedades activas, escritura solo del owner
CREATE POLICY property_images_select ON public.property_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_id AND (p.status = 'active' OR p.owner_id = auth.uid())
    )
  );

CREATE POLICY property_images_insert ON public.property_images
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.properties WHERE id = property_id AND owner_id = auth.uid())
  );

CREATE POLICY property_images_update ON public.property_images
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.properties WHERE id = property_id AND owner_id = auth.uid())
  );

CREATE POLICY property_images_delete ON public.property_images
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.properties WHERE id = property_id AND owner_id = auth.uid())
  );

-- Misma lógica para rules
CREATE POLICY property_rules_select ON public.property_rules
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_id AND (p.status = 'active' OR p.owner_id = auth.uid())
    )
  );

CREATE POLICY property_rules_modify ON public.property_rules
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.properties WHERE id = property_id AND owner_id = auth.uid())
  );

-- Misma lógica para availability
CREATE POLICY property_availability_select ON public.property_availability
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_id AND (p.status = 'active' OR p.owner_id = auth.uid())
    )
  );

CREATE POLICY property_availability_modify ON public.property_availability
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.properties WHERE id = property_id AND owner_id = auth.uid())
  );

-- -------------------------------------------------------------------------
-- FAVORITES
-- -------------------------------------------------------------------------
CREATE POLICY favorites_owner ON public.favorites
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- -------------------------------------------------------------------------
-- MATCHES
-- -------------------------------------------------------------------------
-- Usuario solo ve sus propios matches
CREATE POLICY matches_select ON public.matches
  FOR SELECT USING (user_id = auth.uid());

-- Solo el sistema (service_role) puede insertar/actualizar matches
-- No se crea policy de INSERT para usuarios normales

-- -------------------------------------------------------------------------
-- CONVERSATIONS Y PARTICIPANTES
-- -------------------------------------------------------------------------
-- Usuario solo ve conversaciones donde participa
CREATE POLICY conversations_select ON public.conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversation_participants cp
      WHERE cp.conversation_id = id AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY conversations_insert ON public.conversations
  FOR INSERT WITH CHECK (TRUE);

-- Participantes: usuario ve sus propias participaciones
CREATE POLICY conv_participants_select ON public.conversation_participants
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.conversation_participants cp
      WHERE cp.conversation_id = conversation_id AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY conv_participants_insert ON public.conversation_participants
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY conv_participants_update ON public.conversation_participants
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- -------------------------------------------------------------------------
-- MESSAGES
-- -------------------------------------------------------------------------
-- Solo participantes de la conversación pueden leer mensajes
CREATE POLICY messages_select ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversation_participants cp
      WHERE cp.conversation_id = conversation_id AND cp.user_id = auth.uid()
    )
  );

-- Solo participantes no bloqueados pueden enviar mensajes
CREATE POLICY messages_insert ON public.messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.conversation_participants cp
      WHERE cp.conversation_id = conversation_id
        AND cp.user_id = auth.uid()
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.conversation_participants cp
      WHERE cp.conversation_id = conversation_id
        AND cp.user_id != auth.uid()
        AND cp.is_blocked = TRUE
    )
  );

-- -------------------------------------------------------------------------
-- MESSAGE ATTACHMENTS
-- -------------------------------------------------------------------------
CREATE POLICY message_attachments_select ON public.message_attachments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.messages m
      JOIN public.conversation_participants cp ON cp.conversation_id = m.conversation_id
      WHERE m.id = message_id AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY message_attachments_insert ON public.message_attachments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.messages m WHERE m.id = message_id AND m.sender_id = auth.uid()
    )
  );

-- -------------------------------------------------------------------------
-- REVIEWS
-- -------------------------------------------------------------------------
-- Reseñas visibles son públicas; usuario ve todas las suyas
CREATE POLICY reviews_select ON public.reviews
  FOR SELECT USING (
    status = 'visible'
    OR reviewer_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
  );

CREATE POLICY reviews_insert ON public.reviews
  FOR INSERT WITH CHECK (reviewer_id = auth.uid());

-- Admin puede modificar estado de reseñas
CREATE POLICY reviews_admin_update ON public.reviews
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
  );

-- -------------------------------------------------------------------------
-- TRUST EVENTS
-- -------------------------------------------------------------------------
-- Solo lectura para el propio usuario; escritura via service_role
CREATE POLICY trust_events_select ON public.trust_events
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- -------------------------------------------------------------------------
-- REPORTS
-- -------------------------------------------------------------------------
-- Usuario puede ver sus propios reportes
CREATE POLICY reports_select ON public.reports
  FOR SELECT USING (
    reporter_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
  );

CREATE POLICY reports_insert ON public.reports
  FOR INSERT WITH CHECK (reporter_id = auth.uid());

-- Admin puede actualizar reportes
CREATE POLICY reports_admin_update ON public.reports
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
  );

-- -------------------------------------------------------------------------
-- ADMIN ACTIONS
-- -------------------------------------------------------------------------
-- Solo admins pueden ver y crear acciones
CREATE POLICY admin_actions_select ON public.admin_actions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY admin_actions_insert ON public.admin_actions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- -------------------------------------------------------------------------
-- INVITATIONS
-- -------------------------------------------------------------------------
-- Emisor y receptor pueden ver la invitación
CREATE POLICY invitations_select ON public.invitations
  FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

-- Solo propietarios pueden enviar invitaciones
CREATE POLICY invitations_insert ON public.invitations
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (SELECT 1 FROM public.properties WHERE id = property_id AND owner_id = auth.uid())
  );

-- Receptor puede actualizar estado (aceptar/rechazar)
CREATE POLICY invitations_update ON public.invitations
  FOR UPDATE USING (receiver_id = auth.uid())
  WITH CHECK (receiver_id = auth.uid());

-- -------------------------------------------------------------------------
-- NOTIFICATIONS
-- -------------------------------------------------------------------------
CREATE POLICY notifications_owner ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY notifications_update ON public.notifications
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());


-- ============================================================================
-- 15. STORAGE BUCKETS (se ejecutan via Supabase Dashboard o API)
-- ============================================================================
-- Estos INSERT crean los buckets en storage.buckets.
-- Las políticas de storage se definen sobre storage.objects.
-- ============================================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', TRUE);
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', TRUE);
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', FALSE);
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-attachments', 'chat-attachments', FALSE);

-- Políticas de storage: avatars (público lectura, escritura por owner)
CREATE POLICY storage_avatars_select ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY storage_avatars_insert ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

CREATE POLICY storage_avatars_update ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

-- Políticas de storage: property-images (público lectura, escritura por owner)
CREATE POLICY storage_property_images_select ON storage.objects
  FOR SELECT USING (bucket_id = 'property-images');

CREATE POLICY storage_property_images_insert ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'property-images'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

CREATE POLICY storage_property_images_update ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'property-images'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

CREATE POLICY storage_property_images_delete ON storage.objects
  FOR DELETE USING (
    bucket_id = 'property-images'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

-- Políticas de storage: documents (privado, solo owner y admin)
CREATE POLICY storage_documents_select ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents'
    AND (
      auth.uid()::TEXT = (storage.foldername(name))[1]
      OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
    )
  );

CREATE POLICY storage_documents_insert ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

-- Políticas de storage: chat-attachments (solo participantes)
CREATE POLICY storage_chat_attachments_select ON storage.objects
  FOR SELECT USING (
    bucket_id = 'chat-attachments'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY storage_chat_attachments_insert ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'chat-attachments'
    AND auth.uid() IS NOT NULL
  );


-- ============================================================================
-- FIN DEL SCHEMA INICIAL
-- ============================================================================
