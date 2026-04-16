-- =============================================
-- ROOMIE FINDER - SCHEMA COMPLETO
-- =============================================

-- =============================================
-- LIFESTYLE TAGS (catálogo)
-- =============================================
CREATE TABLE lifestyle_tags (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('habits', 'preferences', 'work', 'social'))
);

-- =============================================
-- PROFILES (usuarios)
-- =============================================
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18),
  avatar TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT false,
  trust_score INTEGER DEFAULT 0 CHECK (trust_score >= 0 AND trust_score <= 100),
  location TEXT,
  budget_min INTEGER,
  budget_max INTEGER,
  joined_date DATE DEFAULT CURRENT_DATE,
  CONSTRAINT budget_check CHECK (budget_min <= budget_max)
);

-- =============================================
-- PROPERTIES (inmuebles/rentas)
-- =============================================
CREATE TABLE properties (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  price INTEGER NOT NULL CHECK (price > 0),
  location TEXT NOT NULL,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  bedrooms INTEGER DEFAULT 1 CHECK (bedrooms >= 0),
  bathrooms INTEGER DEFAULT 1 CHECK (bathrooms >= 0),
  area INTEGER DEFAULT 0 CHECK (area >= 0),
  amenities TEXT[] DEFAULT '{}',
  rules TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'paused')),
  available_from DATE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- PROFILE LIFESTYLE TAGS (preferencias de usuario)
-- =============================================
CREATE TABLE profile_lifestyle_tags (
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tag_id TEXT NOT NULL REFERENCES lifestyle_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (profile_id, tag_id)
);

-- =============================================
-- PROPERTY LIFESTYLE TAGS (preferencias de inmueble)
-- =============================================
CREATE TABLE property_lifestyle_tags (
  property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  tag_id TEXT NOT NULL REFERENCES lifestyle_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (property_id, tag_id)
);

-- =============================================
-- FAVORITES
-- =============================================
CREATE TABLE favorites (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  property_id TEXT REFERENCES properties(id) ON DELETE CASCADE,
  favorited_profile_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT favorites_unique UNIQUE (profile_id, property_id, favorited_profile_id),
  CONSTRAINT favorites_check CHECK (
    (property_id IS NOT NULL AND favorited_profile_id IS NULL) OR
    (property_id IS NULL AND favorited_profile_id IS NOT NULL)
  )
);

-- =============================================
-- REVIEWS
-- =============================================
CREATE TABLE reviews (
  id TEXT PRIMARY KEY,
  author_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  is_verified_stay BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT reviews_unique UNIQUE (author_id, target_id, created_at)
);

-- =============================================
-- CONVERSATIONS
-- =============================================
CREATE TABLE conversations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- CONVERSATION PARTICIPANTS
-- =============================================
CREATE TABLE conversation_participants (
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  unread_count INTEGER DEFAULT 0,
  PRIMARY KEY (conversation_id, profile_id)
);

-- =============================================
-- MESSAGES
-- =============================================
CREATE TABLE messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'image')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_location ON properties(location);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_reviews_target ON reviews(target_id);
CREATE INDEX idx_favorites_profile ON favorites(profile_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifestyle_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_lifestyle_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_lifestyle_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid()::TEXT = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid()::TEXT = id);

CREATE POLICY "Active properties are viewable" ON properties FOR SELECT USING (status = 'active' OR owner_id = auth.uid()::TEXT);
CREATE POLICY "Authenticated users can create properties" ON properties FOR INSERT WITH CHECK (auth.uid()::TEXT = owner_id);
CREATE POLICY "Owners can update their properties" ON properties FOR UPDATE USING (auth.uid()::TEXT = owner_id);
CREATE POLICY "Owners can delete their properties" ON properties FOR DELETE USING (auth.uid()::TEXT = owner_id);

CREATE POLICY "Users can manage their own favorites" ON favorites FOR ALL USING (auth.uid()::TEXT = profile_id);
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid()::TEXT = author_id);

CREATE POLICY "Participants can view conversations" ON conversations FOR SELECT USING (
  EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = id AND profile_id = auth.uid()::TEXT)
);
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT WITH CHECK (auth.uid()::TEXT IS NOT NULL);

CREATE POLICY "Participants can view messages" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = messages.conversation_id AND profile_id = auth.uid()::TEXT)
);
CREATE POLICY "Participants can send messages" ON messages FOR INSERT WITH CHECK (auth.uid()::TEXT = sender_id);

CREATE POLICY "Lifestyle tags are viewable by everyone" ON lifestyle_tags FOR SELECT USING (true);
CREATE POLICY "Profile lifestyle tags viewable" ON profile_lifestyle_tags FOR SELECT USING (true);
CREATE POLICY "Property lifestyle tags viewable" ON property_lifestyle_tags FOR SELECT USING (true);
CREATE POLICY "Profile lifestyle tags manageable by profile owner" ON profile_lifestyle_tags FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = profile_id AND id = auth.uid()::TEXT)
);
CREATE POLICY "Property lifestyle tags manageable by property owner" ON property_lifestyle_tags FOR ALL USING (
  EXISTS (SELECT 1 FROM properties WHERE id = property_id AND owner_id = auth.uid()::TEXT)
);

CREATE POLICY "Users can view their conversation participations" ON conversation_participants FOR SELECT USING (auth.uid()::TEXT = profile_id);
CREATE POLICY "Users can join conversations" ON conversation_participants FOR INSERT WITH CHECK (auth.uid()::TEXT = profile_id);

-- =============================================
-- SEED DATA
-- =============================================

-- Lifestyle Tags
INSERT INTO lifestyle_tags (id, label, category) VALUES
  ('pet-friendly', 'Pet Friendly', 'preferences'),
  ('no-smoking', 'No Fumador', 'habits'),
  ('early-bird', 'Madrugador', 'habits'),
  ('night-owl', 'Noctámbulo', 'habits'),
  ('remote-work', 'Trabajo Remoto', 'work'),
  ('student', 'Estudiante', 'work'),
  ('social', 'Social', 'social'),
  ('quiet', 'Tranquilo', 'social'),
  ('clean-freak', 'Ordenado', 'habits'),
  ('gym-lover', 'Fitness', 'habits'),
  ('vegan', 'Vegano', 'preferences'),
  ('music-lover', 'Músico', 'social');

-- Profiles
INSERT INTO profiles (id, name, age, avatar, bio, is_verified, trust_score, location, budget_min, budget_max, joined_date) VALUES
  ('user-1', 'María García', 28, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', 'Diseñadora UX trabajando remoto. Busco un espacio tranquilo y luminoso. Me encanta cocinar los fines de semana y salir a correr por las mañanas.', true, 92, 'Ciudad de México, CDMX', 8000, 12000, '2024-01-15'),
  ('user-2', 'Carlos Mendoza', 32, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', 'Ingeniero de software. Trabajo híbrido, 3 días en oficina. Busco roomie responsable y que le guste mantener el orden.', true, 88, 'Monterrey, NL', 7000, 10000, '2023-11-20'),
  ('user-3', 'Ana Rodríguez', 25, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', 'Estudiante de maestría en la UNAM. Busco departamento cerca del campus. Soy tranquila pero me gusta organizar cenas con amigos de vez en cuando.', false, 75, 'Ciudad de México, CDMX', 5000, 8000, '2024-02-10'),
  ('user-4', 'Diego López', 30, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', 'Músico profesional y profesor de guitarra. Tengo estudio en casa pero uso audífonos siempre. Busco lugar con buena vibra.', true, 85, 'Guadalajara, JAL', 6000, 9000, '2023-09-05'),
  ('user-5', 'Sofía Hernández', 27, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop', 'Abogada en firma corporativa. Horarios largos pero ordenada. Busco roomie responsable con quien compartir gastos de un buen depa.', true, 95, 'Ciudad de México, CDMX', 10000, 15000, '2024-03-01'),
  ('user-6', 'Roberto Sánchez', 35, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', 'Emprendedor con startup de tecnología. Tengo 2 propiedades disponibles para rentar habitaciones. Busco roomies profesionales.', true, 90, 'Ciudad de México, CDMX', 0, 0, '2023-06-15');

-- Profile Lifestyle Tags
INSERT INTO profile_lifestyle_tags (profile_id, tag_id) VALUES
  ('user-1', 'remote-work'), ('user-1', 'early-bird'), ('user-1', 'clean-freak'), ('user-1', 'gym-lover'),
  ('user-2', 'no-smoking'), ('user-2', 'remote-work'), ('user-2', 'quiet'), ('user-2', 'clean-freak'),
  ('user-3', 'student'), ('user-3', 'quiet'), ('user-3', 'no-smoking'), ('user-3', 'vegan'),
  ('user-4', 'music-lover'), ('user-4', 'night-owl'), ('user-4', 'social'), ('user-4', 'pet-friendly'),
  ('user-5', 'early-bird'), ('user-5', 'no-smoking'), ('user-5', 'clean-freak'), ('user-5', 'quiet'),
  ('user-6', 'remote-work'), ('user-6', 'no-smoking'), ('user-6', 'clean-freak'), ('user-6', 'gym-lover');

-- Properties
INSERT INTO properties (id, owner_id, title, description, images, price, location, address, latitude, longitude, bedrooms, bathrooms, area, amenities, rules, status, available_from, created_at) VALUES
  ('prop-1', 'user-6', 'Habitación en Condesa con terraza', 'Hermosa habitación en departamento compartido con terraza. Excelente ubicación a pasos de Parque México. Incluye servicios, internet de alta velocidad y limpieza semanal de áreas comunes.',
   ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop','https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop','https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'],
   9500, 'Condesa, CDMX', 'Av. Ámsterdam 123, Condesa', 19.4111, -99.1733, 1, 2, 15,
   ARRAY['WiFi','Terraza','Lavadora','Cocina equipada','Gimnasio'], ARRAY['No fumar','No fiestas','Mascotas pequeñas OK'], 'active', '2024-04-01', '2024-03-10'),

  ('prop-2', 'user-6', 'Estudio independiente en Roma Norte',
   'Estudio completamente equipado con entrada independiente. Ideal para profesionistas. Zona segura con vigilancia 24/7. A 5 min del metro Insurgentes.',
   ARRAY['https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&h=600&fit=crop','https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&h=600&fit=crop','https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?w=800&h=600&fit=crop'],
   12000, 'Roma Norte, CDMX', 'Calle Córdoba 45, Roma Norte', 19.4195, -99.1619, 1, 1, 35,
   ARRAY['WiFi','Aire acondicionado','Cocina','Estacionamiento','Seguridad 24/7'], ARRAY['No fumar dentro','Contrato mínimo 6 meses'], 'active', '2024-03-15', '2024-03-05'),

  ('prop-3', 'user-5', 'Cuarto amplio en Polanco',
   'Habitación grande con baño propio en departamento de lujo. Áreas comunes amplias, cocina gourmet, sala de TV. Edificio con amenidades completas.',
   ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop','https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop'],
   15000, 'Polanco, CDMX', 'Av. Presidente Masaryk 200, Polanco', 19.4320, -99.1937, 1, 1, 25,
   ARRAY['WiFi','Gimnasio','Alberca','Roof garden','Concierge','Pet friendly'], ARRAY['No fumar','Mascotas OK con depósito'], 'active', '2024-04-15', '2024-03-12'),

  ('prop-4', 'user-2', 'Depa compartido en Del Valle',
   'Buscamos roomie para completar el depa. Somos 2 profesionistas tranquilos. El cuarto tiene buena luz natural y closet amplio.',
   ARRAY['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop','https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&h=600&fit=crop','https://images.unsplash.com/photo-1560185008-b033106af5c3?w=800&h=600&fit=crop'],
   7500, 'Del Valle, CDMX', 'Calle Adolfo Prieto 800, Del Valle', 19.3895, -99.1686, 1, 2, 12,
   ARRAY['WiFi','Lavadora','Netflix','Cocina equipada'], ARRAY['No fumar','No mascotas','Orden en áreas comunes'], 'active', '2024-03-20', '2024-03-08'),

  ('prop-5', 'user-1', 'Habitación cerca de CU',
   'Ideal para estudiantes de la UNAM. Habitación cómoda en casa compartida. Ambiente estudiantil y tranquilo. Internet incluido.',
   ARRAY['https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=600&fit=crop','https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop','https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop'],
   5500, 'Coyoacán, CDMX', 'Av. Universidad 1500, Coyoacán', 19.3467, -99.1617, 1, 1, 10,
   ARRAY['WiFi','Escritorio','Closet','Jardín común'], ARRAY['No fiestas entre semana','Silencio después de 11pm'], 'active', '2024-04-01', '2024-03-14'),

  ('prop-6', 'user-5', 'Loft moderno en Santa Fe',
   'Loft de diseño contemporáneo con vista panorámica. Perfecto para ejecutivos. Incluye 1 cajón de estacionamiento y acceso a business center.',
   ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop','https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=600&fit=crop','https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop'],
   18000, 'Santa Fe, CDMX', 'Av. Santa Fe 440, Santa Fe', 19.3595, -99.2614, 1, 1, 45,
   ARRAY['WiFi','Gimnasio','Business Center','Estacionamiento','Seguridad 24/7','Vista panorámica'], ARRAY['No fumar','No mascotas grandes'], 'active', '2024-05-01', '2024-03-15');

-- Property Lifestyle Tags
INSERT INTO property_lifestyle_tags (property_id, tag_id) VALUES
  ('prop-1', 'no-smoking'), ('prop-1', 'clean-freak'), ('prop-1', 'remote-work'),
  ('prop-2', 'remote-work'), ('prop-2', 'quiet'),
  ('prop-3', 'pet-friendly'), ('prop-3', 'clean-freak'), ('prop-3', 'remote-work'), ('prop-3', 'gym-lover'),
  ('prop-4', 'no-smoking'), ('prop-4', 'quiet'), ('prop-4', 'clean-freak'),
  ('prop-5', 'student'), ('prop-5', 'quiet'), ('prop-5', 'no-smoking'),
  ('prop-6', 'remote-work'), ('prop-6', 'clean-freak'), ('prop-6', 'early-bird');

-- Reviews
INSERT INTO reviews (id, author_id, target_id, rating, content, is_verified_stay, created_at) VALUES
  ('review-1', 'user-1', 'user-6', 5, 'Excelente anfitrión. El departamento estaba tal cual las fotos y Roberto fue muy atento durante toda mi estancia.', true, '2024-02-15'),
  ('review-2', 'user-3', 'user-6', 4, 'Muy buena experiencia. Ubicación inmejorable y las áreas comunes siempre limpias.', true, '2024-01-20'),
  ('review-3', 'user-6', 'user-1', 5, 'María fue una roomie exemplar. Ordenada, respetuosa y siempre cumplió con los pagos a tiempo.', true, '2024-02-28');

-- Conversations
INSERT INTO conversations (id, created_at, updated_at) VALUES ('conv-1', '2024-03-15T10:00:00', '2024-03-15T11:20:00');
INSERT INTO conversation_participants (conversation_id, profile_id, unread_count) VALUES ('conv-1', 'user-1', 1), ('conv-1', 'user-6', 0);

INSERT INTO conversations (id, created_at, updated_at) VALUES ('conv-2', '2024-03-14T16:00:00', '2024-03-14T16:45:00');
INSERT INTO conversation_participants (conversation_id, profile_id, unread_count) VALUES ('conv-2', 'user-3', 0), ('conv-2', 'user-6', 0);

-- Messages
INSERT INTO messages (id, conversation_id, sender_id, receiver_id, content, read, type, created_at) VALUES
  ('msg-1', 'conv-1', 'user-1', 'user-6', 'Hola Roberto, me interesa mucho la habitación en Condesa. ¿Sigue disponible?', true, 'text', '2024-03-15T10:30:00'),
  ('msg-2', 'conv-1', 'user-6', 'user-1', '¡Hola María! Sí, sigue disponible. ¿Te gustaría agendar una visita?', true, 'text', '2024-03-15T11:15:00'),
  ('msg-3', 'conv-1', 'user-1', 'user-6', '¡Me encantaría! ¿Qué días tienes disponibles esta semana?', false, 'text', '2024-03-15T11:20:00'),
  ('msg-4', 'conv-2', 'user-3', 'user-6', 'Gracias por la información, lo pensaré.', true, 'text', '2024-03-14T16:45:00');
