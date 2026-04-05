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
