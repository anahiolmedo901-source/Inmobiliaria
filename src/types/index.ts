export interface PropertyImage {
  id?: number;
  property_id: string;
  url: string;
  sort_order: number;
}

export interface PropertyFeature {
  bedrooms: number;
  bathrooms: number;
  builtAreaM2: number;
  landAreaM2: number;
  floors: number;
  parkingSpaces: number;
}

export interface PropertyLocation {
  label: string;
  address_line?: string;
  lat: number;
  lng: number;
}

export interface PropertyRow {
  id: string;
  title: string;
  subtitle?: string;
  location_label: string;
  location_address_line?: string;
  location_lat: number;
  location_lng: number;
  description: string;
  bedrooms: number;
  bathrooms: number;
  built_area_m2: number;
  land_area_m2: number;
  floors: number;
  parking_spaces: number;
  price: number;
  status: 'active' | 'under_offer' | 'sold' | 'pre_construction';
  type: 'villa' | 'penthouse' | 'estate' | 'chalet' | 'apartment' | 'land';
  operation: 'sale' | 'rent';
  agent_id: string;
  featured: boolean;
  created_at: string;
}

export interface AgentRow {
  id: string;
  name: string;
  title: string;
  avatar_url: string;
  phone_e164: string;
  email: string;
  whatsapp_e164: string;
  experience?: string;
  specialties?: string;
  languages?: string;
  region?: string;
}

export interface DevelopmentRow {
  id: string;
  title: string;
  description: string;
  image_url: string;
  location: string;
  price_range: string;
  units_total: number;
  units_left: number;
  status: 'pre_launch' | 'in_progress' | 'sold_out';
  completion_date?: string;
  category: string;
}

export interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  role: 'admin' | 'agent' | 'client';
  avatar_url?: string;
  created_at: string;
}

export interface AuthPayload {
  userId: number;
  email: string;
  role: 'admin' | 'agent' | 'client';
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface PropertyResponse {
  id: string;
  title: string;
  subtitle?: string;
  images: string[];
  location: PropertyLocation;
  description: string;
  features: PropertyFeature;
  price: number;
  status: PropertyRow['status'];
  type: PropertyRow['type'];
  operation: PropertyRow['operation'];
  agent: AgentResponse;
  featured: boolean;
  created_at: string;
}

export interface AgentResponse {
  id: string;
  name: string;
  title: string;
  avatar_url: string;
  phone_e164: string;
  email: string;
  whatsapp_e164: string;
  experience?: string;
  specialties?: string;
  languages?: string;
  region?: string;
}

export interface DevelopmentResponse {
  id: string;
  title: string;
  description: string;
  images: string[];
  location: string;
  price_range: string;
  units_total: number;
  units_left: number;
  status: DevelopmentRow['status'];
  completion_date?: string;
  category: string;
}
