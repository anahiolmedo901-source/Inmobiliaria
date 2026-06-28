import bcrypt from 'bcryptjs';
import { getDb } from './config/database';
import type { PropertyRow, AgentRow, DevelopmentRow, UserRow } from './types';

const PROPERTIES: Omit<PropertyRow, 'created_at'>[] = [
  {
    id: 'p-1', title: 'Villa Celeste', subtitle: 'Frente al mar en Puerto Vallarta',
    location_label: 'Puerto Vallarta, Jalisco', location_address_line: 'Zona Hotelera, Puerto Vallarta',
    location_lat: 20.6534, location_lng: -105.2253,
    description: 'Arquitectura premium frente al mar con acabados de lujo. Cada espacio ha sido diseñado para maximizar las vistas al océano con muros de cristal retráctiles que crean un estilo de vida interior-exterior inigualable.',
    bedrooms: 5, bathrooms: 6, built_area_m2: 840, land_area_m2: 1200, floors: 3, parking_spaces: 4,
    price: 4250000, status: 'active', type: 'villa', operation: 'sale', agent_id: 'a-1', featured: true,
  },
  {
    id: 'p-2', title: 'Hacienda San Lucas',
    location_label: 'San Miguel de Allende, Guanajuato', location_address_line: 'Centro Histórico',
    location_lat: 20.9146, location_lng: -100.7438,
    description: 'Hacienda colonial restaurada con jardines interiores, fuentes de cantera y una vista imponente a la parroquia. Techos de vigas, pisos de barro y cocina gourmet equipada con electrodomésticos europeos.',
    bedrooms: 6, bathrooms: 8, built_area_m2: 1150, land_area_m2: 2500, floors: 2, parking_spaces: 6,
    price: 4800000, status: 'active', type: 'villa', operation: 'sale', agent_id: 'a-5', featured: true,
  },
  {
    id: 'p-3', title: 'Reserva del Ángel',
    location_label: 'Cuernavaca, Morelos', location_address_line: 'Club de Golf',
    location_lat: 18.9242, location_lng: -99.2216,
    description: 'Residencia contemporánea con acabados de piedra volcánica y maderas finas enclavada en la ladera del cerro. Alberca infinita con vista al valle, iluminación cálida y espacios abiertos.',
    bedrooms: 5, bathrooms: 6, built_area_m2: 910, land_area_m2: 4000, floors: 3, parking_spaces: 4,
    price: 3200000, status: 'active', type: 'chalet', operation: 'sale', agent_id: 'a-1', featured: true,
  },
  {
    id: 'p-4', title: 'Penthouse Reforma',
    location_label: 'Ciudad de México, CDMX', location_address_line: 'Paseo de la Reforma',
    location_lat: 19.4252, location_lng: -99.1636,
    description: 'Penthouse bañado por el sol con terraza que domina el horizonte de la ciudad. Pisos de mármol, plantas tropicales, muebles de exterior y cocina italiana con electrodomésticos premium.',
    bedrooms: 4, bathrooms: 5, built_area_m2: 670, land_area_m2: 670, floors: 1, parking_spaces: 3,
    price: 5900000, status: 'active', type: 'penthouse', operation: 'sale', agent_id: 'a-3', featured: true,
  },
  {
    id: 'p-5', title: 'Casa de la Luz',
    location_label: 'San Miguel de Allende, Guanajuato', location_address_line: 'Barrio de Guadalupe',
    location_lat: 20.9146, location_lng: -100.7438,
    description: 'Hacienda restaurada con arquitectura colonial mexicana, jardines interiores y vista a la parroquia. Techos de vigas, pisos de barro y cocina gourmet.',
    bedrooms: 4, bathrooms: 4, built_area_m2: 520, land_area_m2: 800, floors: 2, parking_spaces: 3,
    price: 2850000, status: 'active', type: 'villa', operation: 'sale', agent_id: 'a-5', featured: false,
  },
  {
    id: 'p-6', title: 'Villa Marbella',
    location_label: 'Los Cabos, Baja California Sur', location_address_line: 'Cabo del Sol',
    location_lat: 22.8905, location_lng: -109.9167,
    description: 'Espectacular villa contemporánea en la punta de Baja California. Vistas panorámicas al Mar de Cortés, terraza infinita y acceso directo a la playa privada.',
    bedrooms: 7, bathrooms: 9, built_area_m2: 1400, land_area_m2: 3000, floors: 3, parking_spaces: 8,
    price: 12500000, status: 'active', type: 'villa', operation: 'sale', agent_id: 'a-2', featured: true,
  },
  {
    id: 'p-7', title: 'Departamento Polanco',
    location_label: 'Polanco, Ciudad de México', location_address_line: 'Av. Presidente Masaryk',
    location_lat: 19.4326, location_lng: -99.1911,
    description: 'Lujoso departamento en el corazón de Polanco. Acabados italianos, vistas panorámicas, roof garden con alberca y amenidades de primer nivel.',
    bedrooms: 3, bathrooms: 3.5, built_area_m2: 340, land_area_m2: 340, floors: 1, parking_spaces: 2,
    price: 2800000, status: 'active', type: 'apartment', operation: 'sale', agent_id: 'a-3', featured: false,
  },
  {
    id: 'p-8', title: 'Terreno Punta Mita',
    location_label: 'Punta Mita, Nayarit', location_address_line: 'Residencial Punta Mita',
    location_lat: 20.7682, location_lng: -105.5437,
    description: 'Terreno premium dentro del exclusivo desarrollo Punta Mita. Vistas ininterrumpidas al océano, colindancia con campo de golf y acceso a club de playa privado.',
    bedrooms: 0, bathrooms: 0, built_area_m2: 0, land_area_m2: 2500, floors: 0, parking_spaces: 0,
    price: 1850000, status: 'active', type: 'land', operation: 'sale', agent_id: 'a-2', featured: false,
  },
];

const PROPERTY_IMAGES: { property_id: string; url: string; sort_order: number }[] = [
  { property_id: 'p-1', url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80', sort_order: 0 },
  { property_id: 'p-1', url: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1600&q=80', sort_order: 1 },
  { property_id: 'p-1', url: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1600&q=80', sort_order: 2 },
  { property_id: 'p-1', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80', sort_order: 3 },
  { property_id: 'p-2', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80', sort_order: 0 },
  { property_id: 'p-2', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80', sort_order: 1 },
  { property_id: 'p-3', url: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1600&q=80', sort_order: 0 },
  { property_id: 'p-3', url: 'https://images.unsplash.com/photo-1600566753086-00f18f0b0260?auto=format&fit=crop&w=1600&q=80', sort_order: 1 },
  { property_id: 'p-4', url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80', sort_order: 0 },
  { property_id: 'p-5', url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80', sort_order: 0 },
  { property_id: 'p-6', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80', sort_order: 0 },
  { property_id: 'p-6', url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80', sort_order: 1 },
  { property_id: 'p-7', url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80', sort_order: 0 },
  { property_id: 'p-8', url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1600&q=80', sort_order: 0 },
];

const AGENTS: AgentRow[] = [
  { id: 'a-1', name: 'Julian Thorne', title: 'Director de Ventas Elite', avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80', phone_e164: '+5215512345678', email: 'julian@viviana.mx', whatsapp_e164: '+5215512345678', experience: '15+ Años', specialties: 'Quintas y Mansiones', languages: 'ES, EN', region: 'Puerto Vallarta, Jalisco' },
  { id: 'a-2', name: 'Camila Reyes', title: 'Directora de Propiedades Premium', avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80', phone_e164: '+526241234567', email: 'camila@viviana.mx', whatsapp_e164: '+526241234567', experience: '18+ Años', specialties: 'Propiedades de Playa', languages: 'ES, EN', region: 'Los Cabos, BCS' },
  { id: 'a-3', name: 'Mariana Covarrubias', title: 'Especialista en Penthouse', avatar_url: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=256&q=80', phone_e164: '+525512345678', email: 'mariana@viviana.mx', whatsapp_e164: '+525512345678', experience: '10+ Años', specialties: 'Penthouse y Áticos', languages: 'ES, EN, FR', region: 'CDMX' },
  { id: 'a-4', name: 'Diego Montenegro', title: 'Especialista en Inversiones', avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80', phone_e164: '+528181234567', email: 'diego@viviana.mx', whatsapp_e164: '+528181234567', experience: '12+ Años', specialties: 'Desarrollos Residenciales', languages: 'ES, EN, PT', region: 'Monterrey, Nuevo León' },
  { id: 'a-5', name: 'Sofía Hernández', title: 'Especialista en Patrimonio', avatar_url: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=256&q=80', phone_e164: '+524421234567', email: 'sofia@viviana.mx', whatsapp_e164: '+524421234567', experience: '12+ Años', specialties: 'Haciendas Históricas', languages: 'ES, EN', region: 'San Miguel de Allende, Guanajuato' },
  { id: 'a-6', name: 'Ricardo Fuentes', title: 'Corredor de Lujo', avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80', phone_e164: '+529991234567', email: 'ricardo@viviana.mx', whatsapp_e164: '+529991234567', experience: '20+ Años', specialties: 'Haciendas y Ranchos', languages: 'ES, EN', region: 'Mérida, Yucatán' },
];

const DEVELOPMENTS: DevelopmentRow[] = [
  { id: 'd-1', title: 'Reserva Obsidiana', description: 'Una obra maestra arquitectónica esculpida en los acantilados de la costa nayarita.', image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80', location: 'Costa de Nayarit, México', price_range: '$4.2M — $18.5M', units_total: 24, units_left: 7, status: 'in_progress', completion_date: 'Q4 2025', category: 'COSTERO' },
  { id: 'd-2', title: 'Torre Reforma Sky', description: 'Rascacielos futurista con fachada de vidrio y acero, terrazas ajardinadas en espiral.', image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80', location: 'Paseo de la Reforma, CDMX', price_range: '$2.8M — $9.5M', units_total: 42, units_left: 18, status: 'in_progress', completion_date: 'Q2 2026', category: 'URBANO' },
  { id: 'd-3', title: 'Retiro de la Sierra', description: 'Cabañas contemporáneas de madera y piedra enclavadas en el bosque de la Sierra Madre Oriental.', image_url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80', location: 'Sierra de Arteaga, Coahuila', price_range: '$1.8M — $4.2M', units_total: 12, units_left: 6, status: 'in_progress', completion_date: 'Q1 2025', category: 'MONTAÑA' },
  { id: 'd-4', title: 'Pabellones del Desierto', description: 'Pabellones orgánicos de piedra caliza color arena que se fusionan con las dunas costeras de Baja California.', image_url: 'https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=1600&q=80', location: 'Cabo Pulmo, Baja California Sur', price_range: '$3.4M — $8.0M', units_total: 16, units_left: 14, status: 'pre_launch', completion_date: 'Q3 2027', category: 'COSTERO' },
];

async function seed() {
  const db = getDb();

  console.log('[Seed] Insertando agentes…');
  for (const a of AGENTS) {
    await db('agents').insert(a).onConflict('id').merge();
  }

  console.log('[Seed] Insertando propiedades…');
  for (const p of PROPERTIES) {
    await db('properties').insert({ ...p, created_at: new Date().toISOString() }).onConflict('id').merge();
  }

  console.log('[Seed] Insertando imágenes…');
  for (const img of PROPERTY_IMAGES) {
    await db('property_images').insert(img);
  }

  console.log('[Seed] Insertando desarrollos…');
  for (const d of DEVELOPMENTS) {
    await db('developments').insert(d).onConflict('id').merge();
  }

  console.log('[Seed] Insertando usuarios…');
  const pwAdmin = process.env.SEED_PASSWORD_ADMIN || 'Admin123!';
  const pwAgent = process.env.SEED_PASSWORD_AGENT || 'Agent123!';
  const pwClient = process.env.SEED_PASSWORD_CLIENT || 'Client123!';
  const users: Omit<UserRow, 'created_at'>[] = [
    { id: 1, email: 'admin@viviana.mx', password_hash: await bcrypt.hash(pwAdmin, 12), name: 'Admin Viviana', role: 'admin', avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=128&q=80' },
    { id: 2, email: 'agente@viviana.mx', password_hash: await bcrypt.hash(pwAgent, 12), name: 'Camila Reyes', role: 'agent', avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=128&q=80' },
    { id: 3, email: 'cliente@viviana.mx', password_hash: await bcrypt.hash(pwClient, 12), name: 'Cliente Demo', role: 'client', avatar_url: undefined },
  ];
  for (const u of users) {
    await db('users').insert({ ...u, created_at: new Date().toISOString() }).onConflict('id').merge();
  }

  console.log('[Seed] ¡Datos insertados correctamente!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('[Seed] Error:', err);
  process.exit(1);
});
