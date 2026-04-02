# Niddo - Documentacion de Base de Datos

## Resumen

Base de datos PostgreSQL desplegada sobre Supabase para la plataforma Niddo, una aplicacion de busqueda de roomies y propiedades compartidas. El schema cubre identidad, propiedades, matching, mensajeria en tiempo real, reputacion y moderacion.

**Archivo de migracion:** `supabase/migrations/00001_initial_schema.sql`

---

## Diagrama de Relaciones (ER simplificado)

```
auth.users
  |
  +--< profiles >--+--< user_documents
  |                 |--< privacy_settings
  |                 |--< user_preferences >--< preference_weights
  |                 |--< properties >--+--< property_images
  |                 |                  |--< property_rules
  |                 |                  |--< property_availability
  |                 |                  |--< invitations
  |                 |
  |                 |--< favorites (-> properties | profiles)
  |                 |--< matches (-> properties | profiles)
  |                 |--< reviews (-> properties | profiles)
  |                 |--< trust_events
  |                 |--< reports
  |                 |--< notifications
  |                 |
  |                 +--< conversation_participants >--< conversations
  |                                                        |--< messages >--< message_attachments
  |
  +--< admin_actions (solo role=admin)
```

---

## Extensiones Habilitadas

| Extension | Schema | Proposito |
|-----------|--------|-----------|
| **PostGIS** | extensions | Consultas geoespaciales: `ST_DWithin`, `ST_Distance` para busqueda por mapa |
| **pgcrypto** | extensions | `gen_random_uuid()` para IDs, funciones criptograficas |
| **pg_trgm** | extensions | Busqueda difusa por similitud de texto (buscador principal) |

---

## Tipos Enumerados (ENUMs)

| Tipo | Valores | Usado en |
|------|---------|----------|
| `user_role` | user, admin, moderator | profiles.role |
| `user_status` | active, suspended, banned | profiles.status |
| `document_status` | pending, approved, rejected | user_documents.status |
| `property_status` | draft, active, paused, expired | properties.status |
| `invitation_status` | pending, accepted, rejected, expired | invitations.status |
| `report_status` | pending, resolved, dismissed | reports.status |
| `report_target_type` | user, property, review | reports.target_type, admin_actions.target_type |
| `review_status` | visible, hidden, removed | reviews.status |
| `message_type` | text, image, system | messages.type |
| `notification_type` | message, invitation, review, report_resolved, verification_update, match_found, system | notifications.type |
| `trust_event_type` | verification_approved, verification_rejected, review_received, report_filed_against, report_dismissed, profile_completed, invitation_accepted | trust_events.event_type |
| `admin_action_type` | ban_user, suspend_user, reactivate_user, delete_property, hide_review, remove_review, resolve_report, dismiss_report | admin_actions.action_type |

---

## Tablas por Dominio

### 3. Identidad y Perfiles

#### `profiles`

Extiende `auth.users` con datos publicos. Se crea automaticamente al registrarse via trigger `trg_auth_user_created`.

| Columna | Tipo | Null | Default | Descripcion |
|---------|------|------|---------|-------------|
| id | UUID (PK, FK -> auth.users) | NO | - | ID del usuario autenticado |
| username | TEXT (UNIQUE) | NO | - | Nombre de usuario unico |
| full_name | TEXT | NO | '' | Nombre completo |
| avatar_url | TEXT | SI | NULL | URL de imagen de perfil (bucket avatars) |
| bio | TEXT | SI | '' | Biografia del usuario |
| birth_date | DATE | SI | NULL | Fecha de nacimiento |
| phone | TEXT | SI | NULL | Telefono de contacto |
| role | user_role | NO | 'user' | Rol: user, admin, moderator |
| status | user_status | NO | 'active' | Estado de cuenta: active, suspended, banned |
| is_verified | BOOLEAN | NO | FALSE | Identidad verificada por admin |
| trust_score | REAL | NO | 0.0 | Puntaje 0-100 (auto-calculado via trigger) |
| created_at | TIMESTAMPTZ | NO | now() | Fecha de creacion |
| updated_at | TIMESTAMPTZ | NO | now() | Ultima actualizacion (auto via trigger) |

#### `user_documents`

Documentos de identidad subidos para verificacion. Los archivos estan en el bucket `documents` (privado).

| Columna | Tipo | Null | Default | Descripcion |
|---------|------|------|---------|-------------|
| id | UUID (PK) | NO | gen_random_uuid() | ID del documento |
| user_id | UUID (FK -> profiles) | NO | - | Propietario del documento |
| document_type | TEXT | NO | 'id_card' | Tipo de documento |
| file_url | TEXT | NO | - | URL en Supabase Storage |
| status | document_status | NO | 'pending' | Estado de revision |
| encrypted_metadata | JSONB | SI | {} | Datos sensibles cifrados (app-level AES) |
| reviewer_id | UUID (FK -> profiles) | SI | NULL | Admin que reviso |
| reviewed_at | TIMESTAMPTZ | SI | NULL | Fecha de revision |
| created_at | TIMESTAMPTZ | NO | now() | Fecha de carga |

#### `privacy_settings`

Controla la visibilidad del perfil del usuario. Se crea automaticamente junto con el perfil.

| Columna | Tipo | Null | Default | Descripcion |
|---------|------|------|---------|-------------|
| user_id | UUID (PK, FK -> profiles) | NO | - | ID del usuario |
| show_profile | BOOLEAN | NO | TRUE | Perfil visible en busquedas |
| show_location | BOOLEAN | NO | TRUE | Ubicacion visible |
| show_contact_info | BOOLEAN | NO | FALSE | Info de contacto visible |
| searchable | BOOLEAN | NO | TRUE | Aparece en resultados de busqueda |
| updated_at | TIMESTAMPTZ | NO | now() | Ultima actualizacion |

---

### 4. Preferencias y Matching

#### `user_preferences`

Criterios de busqueda del usuario: presupuesto, zonas, estilo de vida.

| Columna | Tipo | Null | Default | Descripcion |
|---------|------|------|---------|-------------|
| id | UUID (PK) | NO | gen_random_uuid() | ID |
| user_id | UUID (FK, UNIQUE -> profiles) | NO | - | Un registro por usuario |
| budget_min | NUMERIC(10,2) | SI | 0 | Presupuesto minimo |
| budget_max | NUMERIC(10,2) | SI | 999999 | Presupuesto maximo |
| preferred_zones | JSONB | SI | [] | Array de zonas preferidas |
| lifestyle_tags | JSONB | SI | [] | Etiquetas: ["madrugador", "no fumador"] |
| created_at | TIMESTAMPTZ | NO | now() | Creacion |
| updated_at | TIMESTAMPTZ | NO | now() | Actualizacion |

#### `preference_weights`

Ponderacion de atributos para el algoritmo de matching. Cada fila = un atributo y su peso.

| Columna | Tipo | Null | Default | Descripcion |
|---------|------|------|---------|-------------|
| id | UUID (PK) | NO | gen_random_uuid() | ID |
| user_id | UUID (FK -> profiles) | NO | - | Usuario |
| attribute | TEXT | NO | - | Nombre del atributo (ej: "smoking", "pets") |
| weight | REAL | NO | 0.5 | Peso 0.0 a 1.0 |

**Constraints:** `UNIQUE (user_id, attribute)`, `CHECK (weight >= 0.0 AND weight <= 1.0)`

---

### 5. Propiedades

#### `properties`

Inmuebles publicados. Usa PostGIS para geolocalizacion.

| Columna | Tipo | Null | Default | Descripcion |
|---------|------|------|---------|-------------|
| id | UUID (PK) | NO | gen_random_uuid() | ID |
| owner_id | UUID (FK -> profiles) | NO | - | Propietario |
| title | TEXT | NO | - | Titulo del anuncio |
| description | TEXT | SI | '' | Descripcion detallada |
| price | NUMERIC(10,2) | NO | - | Precio mensual |
| status | property_status | NO | 'draft' | draft, active, paused, expired |
| address_text | TEXT | SI | '' | Direccion legible |
| latitude | DOUBLE PRECISION | SI | NULL | Latitud |
| longitude | DOUBLE PRECISION | SI | NULL | Longitud |
| location | geography(Point, 4326) | SI | NULL | Punto PostGIS (auto-sync desde lat/lng) |
| deleted_at | TIMESTAMPTZ | SI | NULL | Soft delete para moderacion |
| created_at | TIMESTAMPTZ | NO | now() | Creacion |
| updated_at | TIMESTAMPTZ | NO | now() | Actualizacion |

**Nota:** El campo `location` se sincroniza automaticamente desde `latitude`/`longitude` via trigger `trg_properties_sync_location`.

#### `property_images`

Galeria de fotos con orden personalizable.

| Columna | Tipo | Null | Default | Descripcion |
|---------|------|------|---------|-------------|
| id | UUID (PK) | NO | gen_random_uuid() | ID |
| property_id | UUID (FK -> properties) | NO | - | Propiedad |
| url | TEXT | NO | - | URL en bucket property-images |
| order_index | INTEGER | NO | 0 | Orden de visualizacion |
| created_at | TIMESTAMPTZ | NO | now() | Fecha de carga |

#### `property_rules`

Normas de convivencia por propiedad.

| Columna | Tipo | Null | Default | Descripcion |
|---------|------|------|---------|-------------|
| id | UUID (PK) | NO | gen_random_uuid() | ID |
| property_id | UUID (FK -> properties) | NO | - | Propiedad |
| rule | TEXT | NO | - | Regla (ej: "no mascotas") |

#### `property_availability`

Periodos de disponibilidad. Cuando todas las disponibilidades vencen, la propiedad expira automaticamente.

| Columna | Tipo | Null | Default | Descripcion |
|---------|------|------|---------|-------------|
| id | UUID (PK) | NO | gen_random_uuid() | ID |
| property_id | UUID (FK -> properties) | NO | - | Propiedad |
| start_date | DATE | NO | - | Inicio de disponibilidad |
| end_date | DATE | NO | - | Fin de disponibilidad |

**Constraint:** `CHECK (end_date > start_date)`

---

### 6. Busqueda, Favoritos y Matches

#### `favorites`

Lista de elementos guardados por el usuario. Apunta a UNA propiedad O a UN usuario.

| Columna | Tipo | Null | Default | Descripcion |
|---------|------|------|---------|-------------|
| id | UUID (PK) | NO | gen_random_uuid() | ID |
| user_id | UUID (FK -> profiles) | NO | - | Usuario que guarda |
| property_id | UUID (FK -> properties) | SI | NULL | Propiedad guardada |
| target_user_id | UUID (FK -> profiles) | SI | NULL | Perfil guardado |
| created_at | TIMESTAMPTZ | NO | now() | Fecha |

**Constraints:**
- `CHECK`: exactamente uno de property_id o target_user_id debe ser NOT NULL
- `UNIQUE (user_id, property_id)`, `UNIQUE (user_id, target_user_id)`

#### `matches`

Compatibilidad precomputada. Se calcula offline y alimenta el muro de recomendaciones.

| Columna | Tipo | Null | Default | Descripcion |
|---------|------|------|---------|-------------|
| id | UUID (PK) | NO | gen_random_uuid() | ID |
| user_id | UUID (FK -> profiles) | NO | - | Usuario para quien se calcula |
| target_user_id | UUID (FK -> profiles) | SI | NULL | Roomie compatible |
| property_id | UUID (FK -> properties) | SI | NULL | Propiedad compatible |
| score | REAL | NO | 0 | Porcentaje 0-100 |
| computed_at | TIMESTAMPTZ | NO | now() | Fecha de calculo |

**Constraint:** `CHECK (score >= 0 AND score <= 100)`, exactamente un target

---

### 7. Mensajeria en Tiempo Real

#### `conversations`

Hilo de conversacion. Minimalista, la relacion se define via participants.

| Columna | Tipo | Null | Default | Descripcion |
|---------|------|------|---------|-------------|
| id | UUID (PK) | NO | gen_random_uuid() | ID |
| created_at | TIMESTAMPTZ | NO | now() | Creacion |

#### `conversation_participants`

Relacion N:M entre usuarios y conversaciones. Controla bloqueo y archivo.

| Columna | Tipo | Null | Default | Descripcion |
|---------|------|------|---------|-------------|
| id | UUID (PK) | NO | gen_random_uuid() | ID |
| conversation_id | UUID (FK -> conversations) | NO | - | Conversacion |
| user_id | UUID (FK -> profiles) | NO | - | Participante |
| is_blocked | BOOLEAN | NO | FALSE | Bloquear al otro participante |
| is_archived | BOOLEAN | NO | FALSE | Ocultar de bandeja |
| last_read_at | TIMESTAMPTZ | SI | now() | Ultimo mensaje leido (para unread count) |
| joined_at | TIMESTAMPTZ | NO | now() | Fecha de ingreso |

**Constraint:** `UNIQUE (conversation_id, user_id)`

#### `messages`

Mensajes individuales dentro de una conversacion.

| Columna | Tipo | Null | Default | Descripcion |
|---------|------|------|---------|-------------|
| id | UUID (PK) | NO | gen_random_uuid() | ID |
| conversation_id | UUID (FK -> conversations) | NO | - | Conversacion |
| sender_id | UUID (FK -> profiles) | NO | - | Emisor |
| content | TEXT | NO | '' | Contenido del mensaje |
| type | message_type | NO | 'text' | text, image, system |
| created_at | TIMESTAMPTZ | NO | now() | Timestamp |

#### `message_attachments`

Archivos adjuntos a mensajes. Almacenados en bucket `chat-attachments`.

| Columna | Tipo | Null | Default | Descripcion |
|---------|------|------|---------|-------------|
| id | UUID (PK) | NO | gen_random_uuid() | ID |
| message_id | UUID (FK -> messages) | NO | - | Mensaje padre |
| file_url | TEXT | NO | - | URL en Storage |
| file_type | TEXT | SI | 'image' | Tipo de archivo |
| created_at | TIMESTAMPTZ | NO | now() | Fecha |

---

### 8. Resenas y Reputacion

#### `reviews`

Valoraciones sobre roomies o propiedades.

| Columna | Tipo | Null | Default | Descripcion |
|---------|------|------|---------|-------------|
| id | UUID (PK) | NO | gen_random_uuid() | ID |
| reviewer_id | UUID (FK -> profiles) | NO | - | Autor de la resena |
| target_user_id | UUID (FK -> profiles) | SI | NULL | Roomie evaluado |
| property_id | UUID (FK -> properties) | SI | NULL | Propiedad evaluada |
| rating | SMALLINT | NO | - | Calificacion 1-5 |
| comment | TEXT | SI | '' | Comentario |
| status | review_status | NO | 'visible' | visible, hidden, removed |
| is_cohabitation_confirmed | BOOLEAN | NO | FALSE | Convivencia verificada |
| created_at | TIMESTAMPTZ | NO | now() | Fecha |

**Constraints:**
- `CHECK (rating >= 1 AND rating <= 5)`
- Exactamente un target (user o property)
- `CHECK (reviewer_id != target_user_id)` — no auto-resenas

#### `trust_events`

Eventos que modifican el puntaje de confianza. Un trigger recalcula `profiles.trust_score` automaticamente.

| Columna | Tipo | Null | Default | Descripcion |
|---------|------|------|---------|-------------|
| id | UUID (PK) | NO | gen_random_uuid() | ID |
| user_id | UUID (FK -> profiles) | NO | - | Usuario afectado |
| event_type | trust_event_type | NO | - | Tipo de evento |
| value | REAL | NO | 0 | Valor +/- que se suma al score |
| metadata | JSONB | SI | {} | Datos adicionales del evento |
| created_at | TIMESTAMPTZ | NO | now() | Fecha |

---

### 9. Reportes y Moderacion

#### `reports`

Denuncias de usuarios. Un trigger auto-oculta contenido con 3+ reportes pendientes.

| Columna | Tipo | Null | Default | Descripcion |
|---------|------|------|---------|-------------|
| id | UUID (PK) | NO | gen_random_uuid() | ID |
| reporter_id | UUID (FK -> profiles) | NO | - | Quien reporta |
| target_type | report_target_type | NO | - | user, property, review |
| target_id | UUID | NO | - | ID del target reportado |
| reason | TEXT | NO | - | Motivo del reporte |
| status | report_status | NO | 'pending' | pending, resolved, dismissed |
| resolved_by | UUID (FK -> profiles) | SI | NULL | Admin que resolvio |
| resolved_at | TIMESTAMPTZ | SI | NULL | Fecha de resolucion |
| created_at | TIMESTAMPTZ | NO | now() | Fecha |

#### `admin_actions`

Auditoria de acciones de moderacion.

| Columna | Tipo | Null | Default | Descripcion |
|---------|------|------|---------|-------------|
| id | UUID (PK) | NO | gen_random_uuid() | ID |
| admin_id | UUID (FK -> profiles) | NO | - | Admin ejecutor |
| action_type | admin_action_type | NO | - | Tipo de accion |
| target_type | report_target_type | NO | - | Tipo de entidad |
| target_id | UUID | NO | - | ID de la entidad |
| reason | TEXT | SI | '' | Justificacion |
| metadata | JSONB | SI | {} | Datos adicionales |
| created_at | TIMESTAMPTZ | NO | now() | Fecha |

---

### 10. Invitaciones

#### `invitations`

Propietarios invitan proactivamente a buscadores compatibles.

| Columna | Tipo | Null | Default | Descripcion |
|---------|------|------|---------|-------------|
| id | UUID (PK) | NO | gen_random_uuid() | ID |
| property_id | UUID (FK -> properties) | NO | - | Propiedad ofrecida |
| sender_id | UUID (FK -> profiles) | NO | - | Propietario emisor |
| receiver_id | UUID (FK -> profiles) | NO | - | Buscador receptor |
| status | invitation_status | NO | 'pending' | pending, accepted, rejected, expired |
| message | TEXT | SI | '' | Mensaje opcional |
| expires_at | TIMESTAMPTZ | NO | now() + 7 dias | Expiracion automatica |
| created_at | TIMESTAMPTZ | NO | now() | Fecha |

**Constraint:** `CHECK (sender_id != receiver_id)`

---

### 11. Notificaciones

#### `notifications`

Alertas del sistema. Se usa con Supabase Realtime para push en tiempo real.

| Columna | Tipo | Null | Default | Descripcion |
|---------|------|------|---------|-------------|
| id | UUID (PK) | NO | gen_random_uuid() | ID |
| user_id | UUID (FK -> profiles) | NO | - | Destinatario |
| type | notification_type | NO | - | Tipo de notificacion |
| title | TEXT | NO | - | Titulo |
| body | TEXT | SI | '' | Cuerpo |
| reference_type | TEXT | SI | NULL | Tipo de entidad referenciada |
| reference_id | UUID | SI | NULL | ID de la entidad |
| is_read | BOOLEAN | NO | FALSE | Leida o no |
| created_at | TIMESTAMPTZ | NO | now() | Fecha |

---

## Funciones y Triggers

| Funcion | Trigger | Tabla | Evento | Descripcion |
|---------|---------|-------|--------|-------------|
| `handle_updated_at()` | `trg_profiles_updated_at` | profiles | BEFORE UPDATE | Auto-actualiza `updated_at` |
| `handle_updated_at()` | `trg_properties_updated_at` | properties | BEFORE UPDATE | Auto-actualiza `updated_at` |
| `handle_updated_at()` | `trg_user_preferences_updated_at` | user_preferences | BEFORE UPDATE | Auto-actualiza `updated_at` |
| `handle_updated_at()` | `trg_privacy_settings_updated_at` | privacy_settings | BEFORE UPDATE | Auto-actualiza `updated_at` |
| `sync_property_location()` | `trg_properties_sync_location` | properties | BEFORE INSERT/UPDATE (lat, lng) | Genera punto PostGIS desde lat/lng |
| `recalculate_trust_score()` | `trg_trust_events_recalculate` | trust_events | AFTER INSERT | Recalcula `profiles.trust_score` |
| `auto_moderate_on_report()` | `trg_reports_auto_moderate` | reports | AFTER INSERT | Auto-oculta contenido con 3+ reportes |
| `handle_new_user()` | `trg_auth_user_created` | auth.users | AFTER INSERT | Crea perfil + privacy_settings automaticamente |
| `expire_old_invitations()` | - (cron) | invitations | Manual/Cron | Expira invitaciones vencidas |
| `expire_unavailable_properties()` | - (cron) | properties | Manual/Cron | Expira propiedades sin disponibilidad |

### Funciones Cron (requieren pg_cron o Edge Function)

Estas funciones no tienen trigger automatico. Deben ejecutarse periodicamente:

```sql
-- Ejecutar diariamente via pg_cron o Supabase Edge Function:
SELECT public.expire_old_invitations();
SELECT public.expire_unavailable_properties();
```

---

## Politicas RLS (Row Level Security)

Todas las tablas tienen RLS habilitado. A continuacion el resumen por tabla:

| Tabla | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| profiles | Activos publicos + propio + admin | Auto (trigger) | Solo propio | - |
| user_documents | Propio + admin | Propio | Solo admin | - |
| privacy_settings | Propio | Propio | Propio | - |
| user_preferences | Propio | Propio | Propio | - |
| preference_weights | Propio | Propio | Propio | - |
| properties | Activas publicas + owner + admin | Owner | Owner + admin | Owner + admin |
| property_images | Propiedad activa + owner | Owner de la propiedad | Owner | Owner |
| property_rules | Propiedad activa + owner | Owner | Owner | Owner |
| property_availability | Propiedad activa + owner | Owner | Owner | Owner |
| favorites | Propio | Propio | Propio | Propio |
| matches | Propio | service_role | service_role | - |
| conversations | Solo participantes | Autenticado | - | - |
| conversation_participants | Participantes de la conversacion | Propio | Propio | - |
| messages | Solo participantes | Participante no bloqueado | - | - |
| message_attachments | Participante de la conversacion | Emisor del mensaje | - | - |
| reviews | Visibles publicas + propias + admin | Propio | Solo admin | - |
| trust_events | Propio + admin | service_role | - | - |
| reports | Propios + admin | Propio | Solo admin | - |
| admin_actions | Solo admin | Solo admin | - | - |
| invitations | Emisor + receptor | Owner de la propiedad | Receptor | - |
| notifications | Propio | service_role | Propio (marcar leido) | - |

---

## Storage Buckets

| Bucket | Publico | Proposito | Politica de escritura |
|--------|---------|-----------|----------------------|
| `avatars` | SI | Fotos de perfil | Owner (carpeta = user_id) |
| `property-images` | SI | Fotos de propiedades | Owner (carpeta = user_id) |
| `documents` | NO | Documentos de identidad | Owner + lectura admin |
| `chat-attachments` | NO | Adjuntos de chat | Cualquier autenticado |

**Estructura de carpetas sugerida:**
```
avatars/{user_id}/avatar.jpg
property-images/{user_id}/{property_id}/foto-1.jpg
documents/{user_id}/cedula.pdf
chat-attachments/{conversation_id}/{message_id}/archivo.jpg
```

---

## Indices de Rendimiento

| Indice | Tabla | Columnas | Tipo | Condicion |
|--------|-------|----------|------|-----------|
| idx_properties_status | properties | status | B-tree | WHERE deleted_at IS NULL |
| idx_properties_price | properties | price | B-tree | WHERE status='active' AND deleted_at IS NULL |
| idx_properties_owner | properties | owner_id | B-tree | - |
| idx_properties_location | properties | location | GIST | Para ST_DWithin |
| idx_properties_title_trgm | properties | title | GIN (trgm) | Busqueda difusa |
| idx_matches_user_score | matches | user_id, score DESC | B-tree | Muro de recomendaciones |
| idx_matches_computed | matches | computed_at | B-tree | Recalculos |
| idx_messages_conversation | messages | conversation_id, created_at DESC | B-tree | Chat cronologico |
| idx_messages_sender | messages | sender_id | B-tree | - |
| idx_conversation_participants_user | conversation_participants | user_id | B-tree | Bandeja de entrada |
| idx_favorites_user | favorites | user_id | B-tree | Lista de favoritos |
| idx_notifications_user_unread | notifications | user_id, created_at DESC | B-tree | WHERE is_read=FALSE |
| idx_reports_pending | reports | target_type, target_id | B-tree | WHERE status='pending' |
| idx_trust_events_user | trust_events | user_id | B-tree | - |
| idx_invitations_receiver | invitations | receiver_id | B-tree | WHERE status='pending' |
| idx_reviews_target_user | reviews | target_user_id | B-tree | WHERE status='visible' |
| idx_reviews_property | reviews | property_id | B-tree | WHERE status='visible' |
| idx_user_documents_user | user_documents | user_id | B-tree | - |
| idx_property_availability_property | property_availability | property_id | B-tree | - |

---

## Mapeo: Historias de Usuario -> Tablas

| Historia | Tablas involucradas |
|----------|-------------------|
| Registro y autenticacion | auth.users, profiles, privacy_settings |
| Recuperacion de contrasena | auth.users (Supabase Auth nativo) |
| Edicion de perfil y foto | profiles, storage:avatars |
| Verificacion de identidad | user_documents, storage:documents, trust_events |
| Configuracion de privacidad | privacy_settings |
| Publicacion de propiedad (wizard) | properties, property_images, property_rules, property_availability, storage:property-images |
| Gestion de fotos (drag & reorder) | property_images |
| Mapa interactivo / ubicacion | properties (location, latitude, longitude) |
| Reglas y disponibilidad | property_rules, property_availability |
| Pausar/reactivar anuncio | properties (status) |
| Preferencias de busqueda | user_preferences |
| Ponderacion de cualidades | preference_weights |
| Muro de recomendaciones / match % | matches |
| Filtros avanzados + mapa | properties (indices, PostGIS) |
| Invitaciones de propietario | invitations, notifications |
| Favoritos | favorites |
| Chat en tiempo real | conversations, conversation_participants, messages, message_attachments |
| Bandeja de entrada | conversation_participants (last_read_at), messages |
| Imagenes en chat | message_attachments, storage:chat-attachments |
| Archivar/bloquear contactos | conversation_participants (is_archived, is_blocked) |
| Resenas | reviews, trust_events |
| Puntaje de confianza | trust_events, profiles (trust_score) |
| Reportes | reports, notifications |
| Auto-moderacion (ocultar contenido) | reports (trigger), reviews (status), properties (status), profiles (status) |
| Panel de administracion | reports, admin_actions, profiles (role=admin) |
| Scroll infinito / paginacion | Todas las tablas con indices + LIMIT/OFFSET o cursor |
| Notificaciones | notifications (+ Supabase Realtime) |

---

## Consideraciones Tecnicas

### Supabase Realtime

Habilitar Realtime en estas tablas para push instantaneo:

- `messages` — chat en tiempo real
- `notifications` — alertas instantaneas
- `properties` — actualizaciones de estado en vivo
- `conversation_participants` — estado de lectura

### Encriptacion

- **user_documents.encrypted_metadata**: cifrado a nivel de aplicacion (AES-256 recomendado). El campo almacena el JSON cifrado como texto dentro de JSONB. Supabase no maneja cifrado de campos; se implementa en la capa de aplicacion Next.js.

### Funciones Cron

Dos funciones requieren ejecucion periodica (diaria recomendado):

1. `expire_old_invitations()` — marca invitaciones vencidas
2. `expire_unavailable_properties()` — marca propiedades sin disponibilidad

**Opciones de implementacion:**
- pg_cron (extension de PostgreSQL, disponible en Supabase Pro)
- Supabase Edge Function con schedule
- Vercel Cron Jobs desde Next.js

### Soft Delete

Solo `properties` usa soft delete (`deleted_at`). Esto permite que la moderacion oculte propiedades sin destruir datos, manteniendo integridad referencial con reviews, favorites y matches existentes.
