export interface PublicationFilePreview {
  id: string
  file: File
  previewUrl: string
}

export interface PublicationLocation {
  lat: number
  lng: number
}

export interface PublicationFormValues {
  title: string
  description: string
  price: string
  location: string
  bedrooms: number | null
  bathrooms: number | null
  squareMeters: number | null
  availableFrom: string
  latitude: number | null
  longitude: number | null
  amenities: string[]
  rules: string[]
}
