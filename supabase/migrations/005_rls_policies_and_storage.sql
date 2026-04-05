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
