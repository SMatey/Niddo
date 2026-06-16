-- =====================================================================
-- Deduplicación de conversaciones 1:1
-- ---------------------------------------------------------------------
-- Objetivo: evitar que existan múltiples conversaciones entre el mismo
-- par de usuarios. Se introduce una clave determinística por par de
-- participantes (participant_key), se fusionan las conversaciones
-- duplicadas existentes en una sola (canónica) y se agrega un índice
-- único para impedir nuevos duplicados a nivel de base de datos.
-- =====================================================================

-- 1. Columna con la clave del par de participantes (ids ordenados, unidos por '|')
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS participant_key TEXT;

-- 2. Backfill: calcular participant_key a partir de los participantes actuales
WITH keys AS (
  SELECT conversation_id,
         string_agg(profile_id, '|' ORDER BY profile_id) AS k
  FROM conversation_participants
  GROUP BY conversation_id
)
UPDATE conversations c
SET participant_key = keys.k
FROM keys
WHERE keys.conversation_id = c.id;

-- 3. Construir el mapa duplicado -> canónica.
--    La canónica es la conversación más antigua (created_at, desempate por id).
CREATE TEMP TABLE conv_merge_map ON COMMIT DROP AS
WITH ranked AS (
  SELECT id,
         participant_key,
         ROW_NUMBER() OVER (
           PARTITION BY participant_key ORDER BY created_at ASC, id ASC
         ) AS rn,
         FIRST_VALUE(id) OVER (
           PARTITION BY participant_key ORDER BY created_at ASC, id ASC
         ) AS canonical_id
  FROM conversations
  WHERE participant_key IS NOT NULL
)
SELECT id AS dup_id, canonical_id
FROM ranked
WHERE rn > 1;

-- 4. Repuntar todos los mensajes de las conversaciones duplicadas a la canónica
UPDATE messages m
SET conversation_id = cm.canonical_id
FROM conv_merge_map cm
WHERE m.conversation_id = cm.dup_id;

-- 5. Mantener actualizado updated_at de la canónica al mensaje más reciente
UPDATE conversations c
SET updated_at = sub.last_at
FROM (
  SELECT conversation_id, MAX(created_at) AS last_at
  FROM messages
  GROUP BY conversation_id
) sub
WHERE sub.conversation_id = c.id
  AND sub.last_at > c.updated_at;

-- 6. Eliminar las conversaciones duplicadas.
--    ON DELETE CASCADE limpia sus filas en conversation_participants.
DELETE FROM conversations c
USING conv_merge_map cm
WHERE c.id = cm.dup_id;

-- 7. Índice único: garantiza una sola conversación por par de participantes.
CREATE UNIQUE INDEX IF NOT EXISTS conversations_participant_key_unique
ON conversations (participant_key)
WHERE participant_key IS NOT NULL;
