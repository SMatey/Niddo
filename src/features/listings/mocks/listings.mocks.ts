import type { Listing } from '@/types'

export const mockListings: Listing[] = [
  {
    id: '1',
    ownerId: 'user-1',
    title: 'Habitación en Condesa',
    description: 'Habitación amueblada en zona céntrica',
    address: 'Av. Ámsterdam 100',
    city: 'Ciudad de México',
    pricePerMonth: 8000,
    availableFrom: '2026-04-01',
    roomsTotal: 3,
    bathroomsTotal: 2,
    category: 'apartment',
    isActive: true,
    photos: [],
    createdAt: '2026-03-01T00:00:00Z',
  },
]
