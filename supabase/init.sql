-- =============================================================================
-- VIVIANA – Inicialización de Base de Datos (Supabase / PostgreSQL)
-- =============================================================================
-- 1. Pega todo este bloque en el SQL Editor de Supabase (Dashboard → SQL Editor)
-- 2. Ejecútalo (una sola vez)
-- 3. Después ajusta la conexión en backend/.env:
--       DB_CLIENT=pg
--       DB_HOST=<host-de-supabase>
--       DB_PORT=5432
--       DB_USER=<user>
--       DB_PASSWORD=<password>
--       DB_NAME=postgres
-- =============================================================================

-- ── Crear tablas ────────────────────────────────────────────────────────────

-- Agentes / Asesores
CREATE TABLE IF NOT EXISTS agents (
  id          VARCHAR(20) PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  title       VARCHAR(120) NOT NULL,
  avatar_url  TEXT NOT NULL,
  phone_e164  VARCHAR(30) NOT NULL,
  email       VARCHAR(120) NOT NULL,
  whatsapp_e164 VARCHAR(30) NOT NULL,
  experience  VARCHAR(60),
  specialties VARCHAR(200),
  languages   VARCHAR(60),
  region      VARCHAR(120)
);

-- Propiedades
CREATE TABLE IF NOT EXISTS properties (
  id                   VARCHAR(20) PRIMARY KEY,
  title                VARCHAR(200) NOT NULL,
  subtitle             VARCHAR(200),
  location_label       VARCHAR(200) NOT NULL,
  location_address_line VARCHAR(200),
  location_lat         NUMERIC(10,7) NOT NULL,
  location_lng         NUMERIC(10,7) NOT NULL,
  description          TEXT NOT NULL,
  bedrooms             INTEGER NOT NULL DEFAULT 0,
  bathrooms            NUMERIC(4,1) NOT NULL DEFAULT 0,
  built_area_m2        NUMERIC(10,2) NOT NULL DEFAULT 0,
  land_area_m2         NUMERIC(10,2) NOT NULL DEFAULT 0,
  floors               INTEGER NOT NULL DEFAULT 0,
  parking_spaces       INTEGER NOT NULL DEFAULT 0,
  price                NUMERIC(14,2) NOT NULL,
  status               VARCHAR(30) NOT NULL DEFAULT 'active'
                         CHECK (status IN ('active','under_offer','sold','pre_construction')),
  type                 VARCHAR(30) NOT NULL
                         CHECK (type IN ('villa','penthouse','estate','chalet','apartment','land')),
  operation            VARCHAR(10) NOT NULL
                         CHECK (operation IN ('sale','rent')),
  agent_id             VARCHAR(20) NOT NULL REFERENCES agents(id) ON DELETE RESTRICT,
  featured             BOOLEAN NOT NULL DEFAULT FALSE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Imágenes de propiedades (una propiedad puede tener varias)
CREATE TABLE IF NOT EXISTS property_images (
  id           SERIAL PRIMARY KEY,
  property_id  VARCHAR(20) NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url          TEXT NOT NULL,
  sort_order   INTEGER NOT NULL DEFAULT 0
);

-- Desarrollos
CREATE TABLE IF NOT EXISTS developments (
  id              VARCHAR(20) PRIMARY KEY,
  title           VARCHAR(200) NOT NULL,
  description     TEXT NOT NULL,
  image_url       TEXT NOT NULL,
  location        VARCHAR(200) NOT NULL,
  price_range     VARCHAR(60) NOT NULL,
  units_total     INTEGER NOT NULL,
  units_left      INTEGER NOT NULL,
  status          VARCHAR(30) NOT NULL DEFAULT 'pre_launch'
                    CHECK (status IN ('pre_launch','in_progress','sold_out')),
  completion_date VARCHAR(30),
  category        VARCHAR(60) NOT NULL
);

-- Usuarios (autenticación)
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(120) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name          VARCHAR(120) NOT NULL,
  role          VARCHAR(20) NOT NULL DEFAULT 'client'
                  CHECK (role IN ('admin','agent','client')),
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Seed data ───────────────────────────────────────────────────────────────

-- Agentes
INSERT INTO agents (id, name, title, avatar_url, phone_e164, email, whatsapp_e164, experience, specialties, languages, region) VALUES
  ('a-1', 'Julian Thorne',       'Director de Ventas Elite',        'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80', '+5215512345678', 'julian@viviana.mx',   '+5215512345678', '15+ Años', 'Quintas y Mansiones',     'ES, EN',   'Puerto Vallarta, Jalisco'),
  ('a-2', 'Camila Reyes',        'Directora de Propiedades Premium','https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80', '+526241234567', 'camila@viviana.mx',   '+526241234567', '18+ Años', 'Propiedades de Playa',    'ES, EN',   'Los Cabos, BCS'),
  ('a-3', 'Mariana Covarrubias', 'Especialista en Penthouse',       'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=256&q=80', '+525512345678', 'mariana@viviana.mx',  '+525512345678', '10+ Años', 'Penthouse y Áticos',      'ES, EN, FR', 'CDMX'),
  ('a-4', 'Diego Montenegro',    'Especialista en Inversiones',     'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80', '+528181234567', 'diego@viviana.mx',    '+528181234567', '12+ Años', 'Desarrollos Residenciales','ES, EN, PT', 'Monterrey, Nuevo León'),
  ('a-5', 'Sofía Hernández',     'Especialista en Patrimonio',      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=256&q=80', '+524421234567', 'sofia@viviana.mx',    '+524421234567', '12+ Años', 'Haciendas Históricas',    'ES, EN',   'San Miguel de Allende, Guanajuato'),
  ('a-6', 'Ricardo Fuentes',     'Corredor de Lujo',                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80', '+529991234567', 'ricardo@viviana.mx',  '+529991234567', '20+ Años', 'Haciendas y Ranchos',     'ES, EN',   'Mérida, Yucatán')
ON CONFLICT (id) DO NOTHING;

-- Propiedades
INSERT INTO properties (id, title, subtitle, location_label, location_address_line, location_lat, location_lng, description, bedrooms, bathrooms, built_area_m2, land_area_m2, floors, parking_spaces, price, status, type, operation, agent_id, featured) VALUES
  ('p-1', 'Villa Celeste',      'Frente al mar en Puerto Vallarta',     'Puerto Vallarta, Jalisco',           'Zona Hotelera, Puerto Vallarta',            20.6534, -105.2253, 'Arquitectura premium frente al mar con acabados de lujo. Cada espacio ha sido diseñado para maximizar las vistas al océano con muros de cristal retráctiles que crean un estilo de vida interior-exterior inigualable.',                                                                                                                                  5, 6,   840,  1200, 3, 4,  4250000, 'active', 'villa',     'sale', 'a-1', TRUE),
  ('p-2', 'Hacienda San Lucas',  NULL,                                   'San Miguel de Allende, Guanajuato',  'Centro Histórico',                          20.9146, -100.7438, 'Hacienda colonial restaurada con jardines interiores, fuentes de cantera y una vista imponente a la parroquia. Techos de vigas, pisos de barro y cocina gourmet equipada con electrodomésticos europeos.',                                                                                                                           6, 8,   1150, 2500, 2, 6,  4800000, 'active', 'villa',     'sale', 'a-5', TRUE),
  ('p-3', 'Reserva del Ángel',   NULL,                                   'Cuernavaca, Morelos',                'Club de Golf',                              18.9242, -99.2216,  'Residencia contemporánea con acabados de piedra volcánica y maderas finas enclavada en la ladera del cerro. Alberca infinita con vista al valle, iluminación cálida y espacios abiertos.',                                                                                                                                              5, 6,   910,  4000, 3, 4,  3200000, 'active', 'chalet',    'sale', 'a-1', TRUE),
  ('p-4', 'Penthouse Reforma',   NULL,                                   'Ciudad de México, CDMX',             'Paseo de la Reforma',                       19.4252, -99.1636,  'Penthouse bañado por el sol con terraza que domina el horizonte de la ciudad. Pisos de mármol, plantas tropicales, muebles de exterior y cocina italiana con electrodomésticos premium.',                                                                                                                                              4, 5,   670,   670,  1, 3,  5900000, 'active', 'penthouse', 'sale', 'a-3', TRUE),
  ('p-5', 'Casa de la Luz',      NULL,                                   'San Miguel de Allende, Guanajuato',  'Barrio de Guadalupe',                       20.9146, -100.7438, 'Hacienda restaurada con arquitectura colonial mexicana, jardines interiores y vista a la parroquia. Techos de vigas, pisos de barro y cocina gourmet.',                                                                                                                                                                                 4, 4,   520,   800,  2, 3,  2850000, 'active', 'villa',     'sale', 'a-5', FALSE),
  ('p-6', 'Villa Marbella',     NULL,                                   'Los Cabos, Baja California Sur',     'Cabo del Sol',                              22.8905, -109.9167, 'Espectacular villa contemporánea en la punta de Baja California. Vistas panorámicas al Mar de Cortés, terraza infinita y acceso directo a la playa privada.',                                                                                                                                                                            7, 9,   1400, 3000, 3, 8, 12500000, 'active', 'villa',     'sale', 'a-2', TRUE),
  ('p-7', 'Departamento Polanco', NULL,                                   'Polanco, Ciudad de México',          'Av. Presidente Masaryk',                    19.4326, -99.1911,  'Lujoso departamento en el corazón de Polanco. Acabados italianos, vistas panorámicas, roof garden con alberca y amenidades de primer nivel.',                                                                                                                                                                                         3, 3.5, 340,   340,  1, 2,  2800000, 'active', 'apartment', 'sale', 'a-3', FALSE),
  ('p-8', 'Terreno Punta Mita',  NULL,                                   'Punta Mita, Nayarit',                'Residencial Punta Mita',                    20.7682, -105.5437, 'Terreno premium dentro del exclusivo desarrollo Punta Mita. Vistas ininterrumpidas al océano, colindancia con campo de golf y acceso a club de playa privado.',                                                                                                                                                                         0, 0,   0,    2500, 0, 0,  1850000, 'active', 'land',      'sale', 'a-2', FALSE)
ON CONFLICT (id) DO NOTHING;

-- Imágenes de propiedades
INSERT INTO property_images (property_id, url, sort_order) VALUES
  ('p-1', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80', 0),
  ('p-1', 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1600&q=80', 1),
  ('p-1', 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1600&q=80', 2),
  ('p-1', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80', 3),
  ('p-2', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80', 0),
  ('p-2', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80', 1),
  ('p-3', 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1600&q=80', 0),
  ('p-3', 'https://images.unsplash.com/photo-1600566753086-00f18f0b0260?auto=format&fit=crop&w=1600&q=80', 1),
  ('p-4', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80', 0),
  ('p-5', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80', 0),
  ('p-6', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80', 0),
  ('p-6', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80', 1),
  ('p-7', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80', 0),
  ('p-8', 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1600&q=80', 0);

-- Desarrollos
INSERT INTO developments (id, title, description, image_url, location, price_range, units_total, units_left, status, completion_date, category) VALUES
  ('d-1', 'Reserva Obsidiana',      'Una obra maestra arquitectónica esculpida en los acantilados de la costa nayarita. Experimenta un estilo de vida definido por la belleza natural del Pacífico mexicano y el lujo interior sin concesiones.',                                                                                        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80', 'Costa de Nayarit, México',           '$4.2M — $18.5M', 24, 7,  'in_progress', 'Q4 2025', 'COSTERO'),
  ('d-2', 'Torre Reforma Sky',      'Rascacielos futurista con fachada de vidrio y acero, terrazas ajardinadas en espiral. Un oasis verde en el corazón de la CDMX que representa la cima del lujo urbano en Latinoamérica.',                                                                                                          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80', 'Paseo de la Reforma, CDMX',         '$2.8M — $9.5M',  42, 18, 'in_progress', 'Q2 2026', 'URBANO'),
  ('d-3', 'Retiro de la Sierra',    'Cabañas contemporáneas de madera y piedra enclavadas en el bosque de la Sierra Madre Oriental. Muros de vidrio masivos revelan interiores cálidos con chimenea central y vistas a las montañas.',                                                                                                 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80', 'Sierra de Arteaga, Coahuila',       '$1.8M — $4.2M',  12, 6,  'in_progress', 'Q1 2025', 'MONTAÑA'),
  ('d-4', 'Pabellones del Desierto', 'Pabellones orgánicos de piedra caliza color arena que se fusionan con las dunas costeras de Baja California. Albercas infinitas que reflejan el sol del desierto y el azul del Mar de Cortés.',                                                                                                 'https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=1600&q=80', 'Cabo Pulmo, Baja California Sur',   '$3.4M — $8.0M',  16, 14, 'pre_launch',  'Q3 2027', 'COSTERO')
ON CONFLICT (id) DO NOTHING;

-- Usuarios (contraseña: "123456" para todos)
-- El hash fue generado con bcryptjs, costo 12.
INSERT INTO users (email, password_hash, name, role, avatar_url) VALUES
  ('admin@viviana.mx',  '$2a$12$mTg86oxzyU4l3MEfnbY6huihaH6g6uuORlIl2kxQjO2LkIW04ytk.', 'Admin Viviana', 'admin', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=128&q=80'),
  ('agente@viviana.mx', '$2a$12$mTg86oxzyU4l3MEfnbY6huihaH6g6uuORlIl2kxQjO2LkIW04ytk.', 'Camila Reyes',  'agent', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=128&q=80'),
  ('cliente@viviana.mx', '$2a$12$mTg86oxzyU4l3MEfnbY6huihaH6g6uuORlIl2kxQjO2LkIW04ytk.', 'Cliente Demo',  'client', NULL)
ON CONFLICT (email) DO NOTHING;

-- ── Índices adicionales (rendimiento) ────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_properties_status     ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_type       ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_operation  ON properties(operation);
CREATE INDEX IF NOT EXISTS idx_properties_featured   ON properties(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_properties_agent_id   ON properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_property_images_prop  ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_users_email           ON users(email);

-- ── Fin ──────────────────────────────────────────────────────────────────────
