-- =====================================================================
-- Habilitar Supabase Realtime para mensajería
-- ---------------------------------------------------------------------
-- Sin esto, la suscripción del cliente (postgres_changes) se conecta
-- pero nunca recibe eventos, por lo que los mensajes nuevos solo
-- aparecían tras recargar la página. Aquí agregamos las tablas a la
-- publicación supabase_realtime y fijamos REPLICA IDENTITY FULL para
-- que los eventos incluyan la fila completa (necesario para filtros
-- en UPDATE/DELETE).
-- =====================================================================

-- REPLICA IDENTITY FULL: envía la fila completa en cada cambio
ALTER TABLE messages REPLICA IDENTITY FULL;
ALTER TABLE conversations REPLICA IDENTITY FULL;
ALTER TABLE conversation_participants REPLICA IDENTITY FULL;

-- Agregar las tablas a la publicación supabase_realtime (idempotente)
DO $$
BEGIN
  -- messages: imprescindible para ver mensajes en tiempo real
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE messages;
  END IF;

  -- conversations: para reaccionar a cambios de la conversación
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'conversations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
  END IF;

  -- conversation_participants: para reflejar unread_count y nuevas conversaciones
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'conversation_participants'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE conversation_participants;
  END IF;
END $$;
