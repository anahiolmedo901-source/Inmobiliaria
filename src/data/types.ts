export type PropertyAgent = {
  id: string;
  name: string;
  title: string;
  avatarUrl: string;
  phoneE164: string;
  email: string;
  whatsappE164: string;
  experience?: string;
  specialties?: string;
  languages?: string;
  region?: string;
};

export type PropertyLocation = {
  label: string;
  addressLine?: string;
  lat: number;
  lng: number;
};

export type PropertyFeatures = {
  bedrooms: number;
  bathrooms: number;
  builtAreaM2: number;
  landAreaM2: number;
  floors: number;
  parkingSpaces: number;
};

export type Property = {
  id: string;
  title: string;
  subtitle?: string;
  images: string[];
  location: PropertyLocation;
  description: string;
  features: PropertyFeatures;
  price: number;
  status: 'active' | 'under_offer' | 'sold' | 'pre_construction';
  type: 'villa' | 'penthouse' | 'estate' | 'chalet' | 'apartment' | 'land';
  operation: 'sale' | 'rent';
  agent: PropertyAgent;
  featured?: boolean;
  createdAt: string;
};

export type Development = {
  id: string;
  title: string;
  description: string;
  images: string[];
  location: string;
  priceRange: string;
  unitsTotal: number;
  unitsLeft: number;
  status: 'pre_launch' | 'in_progress' | 'sold_out';
  completionDate?: string;
  category: string;
};

export type BreadcrumbSegment = {
  label: string;
  onPress?: () => void;
};
