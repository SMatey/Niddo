// Re-export all shared UI types from the central types location
export type {
    PropertyCardProps,
    UserCardProps,
    UserAvatarProps,
    UserInfoProps,
    FavoriteButtonProps,
    ConfidenceBarProps,
    BudgetBadgeProps,
    DetailHeaderProps,
    BadgeVariant,
    BadgeItem,
    PropertyBadgeProps,
    PageButtonType,
    PageButton,
    PaginationProps,
} from '@/shared/components/ui/types'

// Additional shared types
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