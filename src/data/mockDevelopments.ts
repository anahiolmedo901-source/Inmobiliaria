import type { Development } from './types';

export const MOCK_DEVELOPMENTS: Development[] = [
  {
    id: 'd-1',
    title: 'Reserva Obsidiana',
    description:
      'Una obra maestra arquitectónica esculpida en los acantilados de la costa nayarita. Experimenta un estilo de vida definido por la belleza natural del Pacífico mexicano y el lujo interior sin concesiones.',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    ],
    location: 'Costa de Nayarit, México',
    priceRange: '$4.2M — $18.5M',
    unitsTotal: 24,
    unitsLeft: 7,
    status: 'in_progress',
    completionDate: 'Q4 2025',
    category: 'COSTERO',
  },
  {
    id: 'd-2',
    title: 'Torre Reforma Sky',
    description:
      'Rascacielos futurista con fachada de vidrio y acero, terrazas ajardinadas en espiral. Un oasis verde en el corazón de la CDMX que representa la cima del lujo urbano en Latinoamérica.',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
    ],
    location: 'Paseo de la Reforma, CDMX',
    priceRange: '$2.8M — $9.5M',
    unitsTotal: 42,
    unitsLeft: 18,
    status: 'in_progress',
    completionDate: 'Q2 2026',
    category: 'URBANO',
  },
  {
    id: 'd-3',
    title: 'Retiro de la Sierra',
    description:
      'Cabañas contemporáneas de madera y piedra enclavadas en el bosque de la Sierra Madre Oriental. Muros de vidrio masivos revelan interiores cálidos con chimenea central y vistas a las montañas.',
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80',
    ],
    location: 'Sierra de Arteaga, Coahuila',
    priceRange: '$1.8M — $4.2M',
    unitsTotal: 12,
    unitsLeft: 6,
    status: 'in_progress',
    completionDate: 'Q1 2025',
    category: 'MONTAÑA',
  },
  {
    id: 'd-4',
    title: 'Pabellones del Desierto',
    description:
      'Pabellones orgánicos de piedra caliza color arena que se fusionan con las dunas costeras de Baja California. Albercas infinitas que reflejan el sol del desierto y el azul del Mar de Cortés.',
    images: [
      'https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=1600&q=80',
    ],
    location: 'Cabo Pulmo, Baja California Sur',
    priceRange: '$3.4M — $8.0M',
    unitsTotal: 16,
    unitsLeft: 14,
    status: 'pre_launch',
    completionDate: 'Q3 2027',
    category: 'COSTERO',
  },
];

export const DEVELOPMENT_STATUS_MAP = {
  pre_launch: 'Pre-Lanzamiento',
  in_progress: 'En Progreso',
  sold_out: 'Vendido',
} as const;
