export interface PropertyGalleryProps {
    images: string[]
    title: string
}

export interface PropertyInfoCardProps {
    bedrooms?: number
    bathrooms?: number
    squareMeters?: number
}

export interface PropertyPriceCardProps {
    price: string
}

export interface PropertyHostCardProps {
    hostName: string
    hostImageUrl?: string
    hostVerified?: boolean
    hostId: string
    memberSince: string
    hostConfidence: number
}

export interface PropertyAmenitiesCardProps {
    amenities: string[]
}

export interface PropertyRulesCardProps {
    rules: string[]
}

export interface PropertyTitleProps {
    title: string
    location: string
}