// Database types for Supabase schema

export type Profile = {
    id: string
    name: string
    age: number
    avatar: string | null
    bio: string | null
    is_verified: boolean
    trust_score: number
    location: string | null
    latitude: number | null
    longitude: number | null
    budget_min: number | null
    budget_max: number | null
    joined_date: string
}

export type Property = {
    id: string
    owner_id: string
    title: string
    description: string | null
    images: string[]
    price: number
    location: string
    address: string | null
    latitude: number | null
    longitude: number | null
    bedrooms: number
    bathrooms: number
    area: number
    amenities: string[]
    rules: string[]
    status: string
    available_from: string | null
    created_at: string
    updated_at: string
}

export type LifestyleTag = {
    id: string
    label: string
    category: string
}

export type PropertyCharacteristic = {
    id: string
    label: string
    category: 'furnishing' | 'amenities' | 'building' | 'restrictions' | 'location'
}

export type PropertyLifestyleTag = {
    property_id: string
    tag_id: string
}

export type ProfileLifestyleTag = {
    profile_id: string
    tag_id: string
}

export type PropertyCharacteristicTag = {
    property_id: string
    characteristic_id: string
}