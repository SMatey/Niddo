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
