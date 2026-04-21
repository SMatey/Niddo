import type { PropertyDetail, PropertyItem, UserDetail, UserItem } from '@/features/search/types/search.types'

type UserDetailBase = Omit<UserDetail, 'reviews' | 'reviewSummary' | 'reviewComposer'>
type PropertyDetailBase = Omit<PropertyDetail, 'reviews' | 'reviewSummary' | 'reviewComposer'>

export interface MockProfileRecord {
  id: string
  name: string
  age: number
  bio: string
  location: string
  imageUrl?: string
  verified: boolean
  minBudget: string
  maxBudget: string
  confidenceScore: number
  lat: number
  lng: number
  lifestyles: string[]
  memberSince: string
  description: string
}

export interface MockPropertyRecord {
  id: string
  title: string
  location: string
  price: string
  imageUrl?: string
  bedrooms: number
  bathrooms: number
  squareMeters: number
  lat: number
  lng: number
  lifestyles: string[]
  images: string[]
  description: string
  hostId: string
  rules: string[]
}

export interface MockCohabitationConfirmation {
  id: string
  reviewerId: string
  propertyId: string
  associatedProfileId: string
  relationshipLabel: string
  periodLabel: string
  confirmedAt: string
}

export interface MockReviewRecord {
  id: string
  authorId: string
  targetType: 'user' | 'property'
  targetId: string
  rating: number
  comment: string
  confirmationId: string
  propertyId?: string
  associatedProfileId?: string
  isCohabitationConfirmed: boolean
  createdAt: string
}

// Comentario: centralizamos el catálogo mock para que exploración, detalle y reseñas compartan la misma fuente.
export const DEMO_REVIEWER_ID = 'user-1'

export const mockProfiles: MockProfileRecord[] = [
  {
    id: 'user-1',
    name: 'María García',
    age: 24,
    bio: 'Estudiante de medicina buscando un espacio tranquilo y responsable para compartir.',
    location: 'Tibás, Costa Rica',
    verified: true,
    minBudget: '$400',
    maxBudget: '$600',
    confidenceScore: 85,
    lat: 10.018,
    lng: -84.085,
    lifestyles: ['Limpieza', 'Internet fibra', 'Silencio nocturno'],
    memberSince: '2023',
    description: 'Le gusta mantener acuerdos claros de convivencia y una comunicación respetuosa.',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  },
  {
    id: 'user-2',
    name: 'Carlos Rodríguez',
    age: 31,
    bio: 'Trabajo remoto y valoro muchísimo el orden, los horarios estables y la buena comunicación.',
    location: 'Curridabat, Costa Rica',
    verified: true,
    minBudget: '$700',
    maxBudget: '$1,000',
    confidenceScore: 92,
    lat: 9.915,
    lng: -84.055,
    lifestyles: ['Trabajo remoto', 'Orden', 'Terraza', 'No fumador'],
    memberSince: '2022',
    description: 'Suele hospedar roomies por temporadas largas y documenta bien las reglas del hogar.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  },
  {
    id: 'user-3',
    name: 'Ana Morales',
    age: 27,
    bio: 'Diseñadora gráfica; busca convivencias calmadas, con espacios limpios y flexibilidad para trabajo creativo.',
    location: 'San José Centro, Costa Rica',
    verified: false,
    minBudget: '$350',
    maxBudget: '$500',
    confidenceScore: 68,
    lat: 9.932,
    lng: -84.075,
    lifestyles: ['Amueblado', 'Creatividad', 'Cocina compartida'],
    memberSince: '2024',
    description: 'Prefiere comunidades pequeñas y valora mucho la empatía entre roomies.',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
  },
  {
    id: 'user-4',
    name: 'Pedro Jiménez',
    age: 29,
    bio: 'Ingeniero de software, con horarios híbridos y preferencia por espacios silenciosos para concentrarse.',
    location: 'Santa Ana, Costa Rica',
    verified: true,
    minBudget: '$800',
    maxBudget: '$1,200',
    confidenceScore: 77,
    lat: 9.862,
    lng: -84.195,
    lifestyles: ['Gimnasio', 'Internet fibra', 'Estacionamiento'],
    memberSince: '2021',
    description: 'Publica propiedades completas y procura dejar expectativas muy claras antes de cerrar una convivencia.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
  },
]

export const mockProperties: MockPropertyRecord[] = [
  {
    id: 'prop-1',
    title: 'Apartamento céntrico',
    location: 'San José, Costa Rica',
    price: '$850/mes',
    bedrooms: 2,
    bathrooms: 1,
    squareMeters: 65,
    lat: 9.9281,
    lng: -84.0907,
    lifestyles: ['Piscina', 'Gimnasio', 'Estacionamiento', 'Seguridad 24h'],
    description: 'Apartamento con buena luz natural, reglas de convivencia claras y espacios comunes bien cuidados.',
    hostId: 'user-2',
    rules: [
      'No fumar dentro del apartamento',
      'No hacer ruido después de las 10pm',
      'Mantener la cocina limpia después de usarla',
    ],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&h=700&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1000&h=700&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&h=700&fit=crop',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&h=700&fit=crop',
  },
  {
    id: 'prop-2',
    title: 'Casa amueblada en Escazú',
    location: 'Escazú, Costa Rica',
    price: '$1,200/mes',
    bedrooms: 3,
    bathrooms: 2,
    squareMeters: 120,
    lat: 9.935,
    lng: -84.145,
    lifestyles: ['Amueblado', 'Internet fibra', 'Aire acondicionado', 'Terraza'],
    description: 'Casa completa con áreas amplias, ideal para convivencias largas y perfiles profesionales.',
    hostId: 'user-4',
    rules: [
      'Respetar horarios de visitas',
      'Cuidar muebles y electrodomésticos',
      'Reportar cualquier daño en el momento',
    ],
    images: [
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1000&h=700&fit=crop',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1000&h=700&fit=crop',
      'https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?w=1000&h=700&fit=crop',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1000&h=700&fit=crop',
  },
  {
    id: 'prop-3',
    title: 'Habitación en Heredia',
    location: 'Heredia, Costa Rica',
    price: '$350/mes',
    bedrooms: 1,
    bathrooms: 1,
    squareMeters: 30,
    lat: 9.987,
    lng: -84.105,
    lifestyles: ['Limpieza', 'Lavadora', 'Zona universitaria'],
    description: 'Habitación pensada para estudiantes o profesionales que priorizan un ambiente tranquilo.',
    hostId: 'user-1',
    rules: [
      'Silencio después de las 11pm',
      'No fiestas entre semana',
      'Cuidar las áreas comunes',
    ],
    images: [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1000&h=700&fit=crop',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1000&h=700&fit=crop',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1000&h=700&fit=crop',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1000&h=700&fit=crop',
  },
  {
    id: 'prop-4',
    title: 'Penthouse en Santa Ana',
    location: 'Santa Ana, Costa Rica',
    price: '$2,100/mes',
    bedrooms: 4,
    bathrooms: 3,
    squareMeters: 180,
    lat: 9.856,
    lng: -84.182,
    lifestyles: ['Piscina', 'Terraza', 'Seguridad 24h', 'Aire acondicionado'],
    description: 'Penthouse amplio para quienes necesitan un espacio premium con reglas bien definidas.',
    hostId: 'user-4',
    rules: [
      'No eventos masivos',
      'Respetar la tranquilidad del edificio',
      'Uso responsable de amenidades',
    ],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&h=700&fit=crop',
      'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1000&h=700&fit=crop',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1000&h=700&fit=crop',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&h=700&fit=crop',
  },
]

export const mockCohabitationConfirmations: MockCohabitationConfirmation[] = [
  {
    id: 'stay-1',
    reviewerId: 'user-1',
    propertyId: 'prop-1',
    associatedProfileId: 'user-2',
    relationshipLabel: 'Convivencia confirmada en Apartamento céntrico',
    periodLabel: 'Enero 2026 - Marzo 2026',
    confirmedAt: '2026-03-10',
  },
  {
    id: 'stay-2',
    reviewerId: 'user-3',
    propertyId: 'prop-2',
    associatedProfileId: 'user-4',
    relationshipLabel: 'Estancia validada en Casa amueblada en Escazú',
    periodLabel: 'Noviembre 2025 - Enero 2026',
    confirmedAt: '2026-01-28',
  },
  {
    id: 'stay-3',
    reviewerId: 'user-2',
    propertyId: 'prop-3',
    associatedProfileId: 'user-1',
    relationshipLabel: 'Convivencia validada en Habitación en Heredia',
    periodLabel: 'Agosto 2025 - Octubre 2025',
    confirmedAt: '2025-10-29',
  },
]

export const mockSeedReviews: MockReviewRecord[] = [
  {
    id: 'review-1',
    authorId: 'user-2',
    targetType: 'user',
    targetId: 'user-1',
    rating: 4,
    comment: 'María fue muy clara con los acuerdos y siempre mantuvo una comunicación respetuosa durante la convivencia.',
    confirmationId: 'stay-3',
    propertyId: 'prop-3',
    associatedProfileId: 'user-1',
    isCohabitationConfirmed: true,
    createdAt: '2025-11-03',
  },
  {
    id: 'review-2',
    authorId: 'user-3',
    targetType: 'property',
    targetId: 'prop-2',
    rating: 5,
    comment: 'La propiedad estaba exactamente como se ofrecía y el proceso de convivencia fue muy ordenado de principio a fin.',
    confirmationId: 'stay-2',
    propertyId: 'prop-2',
    associatedProfileId: 'user-4',
    isCohabitationConfirmed: true,
    createdAt: '2026-02-03',
  },
  {
    id: 'review-3',
    authorId: 'user-3',
    targetType: 'user',
    targetId: 'user-4',
    rating: 5,
    comment: 'Pedro fue transparente con las reglas, respondió rápido y generó una convivencia muy tranquila.',
    confirmationId: 'stay-2',
    propertyId: 'prop-2',
    associatedProfileId: 'user-4',
    isCohabitationConfirmed: true,
    createdAt: '2026-02-05',
  },
]

export function toUserItem(profile: MockProfileRecord): UserItem {
  return {
    id: profile.id,
    name: profile.name,
    age: profile.age,
    bio: profile.bio,
    location: profile.location,
    imageUrl: profile.imageUrl,
    verified: profile.verified,
    isFavorite: false,
    minBudget: profile.minBudget,
    maxBudget: profile.maxBudget,
    confidenceScore: profile.confidenceScore,
    lat: profile.lat,
    lng: profile.lng,
    lifestyles: profile.lifestyles,
  }
}

export function toUserDetail(profile: MockProfileRecord): UserDetailBase {
  return {
    ...toUserItem(profile),
    description: profile.description,
    memberSince: profile.memberSince,
  }
}

export function toPropertyItem(property: MockPropertyRecord): PropertyItem {
  return {
    id: property.id,
    title: property.title,
    location: property.location,
    price: property.price,
    imageUrl: property.imageUrl,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    squareMeters: property.squareMeters,
    lat: property.lat,
    lng: property.lng,
    lifestyles: property.lifestyles,
    isFavorite: false,
  }
}

export function toPropertyDetail(
  property: MockPropertyRecord,
  host: MockProfileRecord
): PropertyDetailBase {
  return {
    ...toPropertyItem(property),
    images: property.images,
    description: property.description,
    hostId: host.id,
    hostName: host.name,
    hostImageUrl: host.imageUrl,
    hostVerified: host.verified,
    hostConfidence: host.confidenceScore,
    memberSince: host.memberSince,
    rules: property.rules,
  }
}
