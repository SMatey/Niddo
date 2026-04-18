export interface TagProps {
    children: React.ReactNode
    selected?: boolean
    onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void
    variant?: 'default' | 'outline'
    className?: string
}

export interface Tab {
    label: string
    value: string
}

export interface TabsProps {
    tabs: readonly Tab[]
    value: string
    onChange: (value: string) => void
    className?: string
}

export interface ToggleProps {
    checked: boolean
    onChange: (checked: boolean) => void
    label?: string
    disabled?: boolean
    id?: string
}

export interface PriceRangeProps {
    minValue: string
    maxValue: string
    onMinChange: (value: string) => void
    onMaxChange: (value: string) => void
    minPlaceholder?: string
    maxPlaceholder?: string
    currency?: string
    className?: string
}

export interface PropertyCardProps {
    id: string
    title: string
    location: string
    price: string
    imageUrl?: string
    bedrooms?: number
    bathrooms?: number
    squareMeters?: number
    lifestyles?: string[]
    isFavorite?: boolean
    onFavoriteToggle?: () => void
    className?: string
}

export interface UserCardProps {
    id: string
    name: string
    age?: number
    bio?: string
    location?: string
    imageUrl?: string
    verified?: boolean
    isFavorite?: boolean
    onFavoriteToggle?: () => void
    minBudget?: string
    maxBudget?: string
    confidenceScore?: number
    lifestyles?: string[]
    className?: string
}
