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
