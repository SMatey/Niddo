export type PropertyStatus = 'active' | 'draft' | 'paused';

export interface Property {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  location: string;
  status: PropertyStatus;
  created_at: string;
}

export * from './property-detail.types';