import { useState, useEffect } from 'react'
import type { PropertyItem, FilterState } from '@/features/search/types/search.types'
import { parsePrice } from '@/shared/utils/parse-price'

export interface UsePropertiesOptions {
    page?: number
    pageSize?: number
}

export interface UsePropertiesResult {
    data: PropertyItem[]
    total: number
    page: number
    totalPages: number
    hasMore: boolean
    isLoading: boolean
    error: Error | null
}

// TODO(backend): Replace mock implementation with Supabase query
// The interface and return type must remain unchanged
export function useProperties(
    filters: FilterState | null,
    options: UsePropertiesOptions = {}
) {
    const { page = 1, pageSize = 20 } = options

    const [data, setData] = useState<PropertyItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        // TODO(backend): Replace this mock with Supabase query
        // Example:
        // const { data, count } = await supabase
        //   .from('properties')
        //   .select('*', { count: 'exact' })
        //   .ilike('location', `%${filters?.location ?? ''}%`)
        //   .range((page - 1) * pageSize, page * pageSize - 1)

        setIsLoading(true)
        setError(null)

        // Mock data - replace with Supabase call
        const mockData: PropertyItem[] = [
            {
                id: '1',
                title: 'Apartamento céntrico',
                location: 'San José, Costa Rica',
                price: '$850/mes',
                bedrooms: 2,
                bathrooms: 1,
                squareMeters: 65,
                lat: 9.9281,
                lng: -84.0907,
                lifestyles: ['Piscina', 'Gimnasio', 'Estacionamiento', 'Seguridad 24h'],
                isFavorite: false,
            },
            {
                id: '2',
                title: 'Casa amueblada en Escazú',
                location: 'Escazú, Costa Rica',
                price: '$1,200/mes',
                bedrooms: 3,
                bathrooms: 2,
                squareMeters: 120,
                lat: 9.9350,
                lng: -84.1450,
                lifestyles: ['Amueblado', 'Internet fiber', 'Aire acondicionado', 'Terraza'],
                isFavorite: true,
            },
            {
                id: '3',
                title: 'Habitación en出租',
                location: 'Heredia, Costa Rica',
                price: '$350/mes',
                bedrooms: 1,
                bathrooms: 1,
                squareMeters: 30,
                lat: 9.9870,
                lng: -84.1050,
                lifestyles: ['Limpieza', 'Lavadora'],
                isFavorite: false,
            },
            {
                id: '4',
                title: 'Penthouse en Santa Ana',
                location: 'Santa Ana, Costa Rica',
                price: '$2,100/mes',
                bedrooms: 4,
                bathrooms: 3,
                squareMeters: 180,
                lat: 9.8560,
                lng: -84.1820,
                lifestyles: ['Piscina', 'Terraza', 'Seguridad 24h', 'Aire acondicionado'],
                isFavorite: false,
            },
        ]

        // Apply local filtering (move to Supabase query when backend is ready)
        let filtered = mockData
        if (filters) {
            if (filters.location) {
                filtered = filtered.filter(p =>
                    p.location.toLowerCase().includes(filters.location.toLowerCase())
                )
            }
            if (filters.minPrice) {
                const minNum = parsePrice(filters.minPrice)
                filtered = filtered.filter(p => {
                    const priceNum = parsePrice(p.price)
                    return !isNaN(priceNum) && priceNum >= minNum
                })
            }
            if (filters.maxPrice) {
                const maxNum = parsePrice(filters.maxPrice)
                filtered = filtered.filter(p => {
                    const priceNum = parsePrice(p.price)
                    return !isNaN(priceNum) && priceNum <= maxNum
                })
            }
            if (filters.petFriendly) {
                filtered = filtered.filter(p => p.petFriendly)
            }
            if (filters.smoker) {
                filtered = filtered.filter(p => p.smoker)
            }
            if (filters.lifestyles.length > 0) {
                filtered = filtered.filter(p =>
                    filters.lifestyles.every(l => p.lifestyles?.includes(l))
                )
            }
        }

        // Simulate network delay
        const timer = setTimeout(() => {
            setData(filtered)
            setTotal(filtered.length)
            setIsLoading(false)
        }, 300)

        return () => clearTimeout(timer)
    }, [filters, page, pageSize])

    return {
        data,
        total,
        page,
        totalPages: Math.ceil(total / pageSize),
        hasMore: page * pageSize < total,
        isLoading,
        error,
    }
}