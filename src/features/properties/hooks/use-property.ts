import { useState, useEffect } from 'react'
import type { PropertyDetail } from '@/features/search/types/search.types'

export interface UsePropertyResult {
    data: PropertyDetail | null
    isLoading: boolean
    error: Error | null
}

export function useProperty(id: string) {
    const [data, setData] = useState<PropertyDetail | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        if (!id) {
            setData(null)
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        setError(null)

        // TODO(backend): Replace with Supabase query
        // Example:
        // const { data, error } = await supabase
        //   .from('properties')
        //   .select('*')
        //   .eq('id', id)
        //   .single()

        const mockData: PropertyDetail = {
            id,
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
            images: [],
            description: 'Hermoso apartamento en el corazón de San José, cerca de tiendas y transporte público.',
            hostId: 'host-1',
            hostName: 'María García',
            hostVerified: true,
            hostConfidence: 92,
            memberSince: '2022',
            rules: [
                'No fumar dentro del apartamento',
                'No mascotas sin previa aprobación',
                'No hacer ruido después de las 10pm',
                'Respetar las áreas comunes',
            ],
        }

        const timer = setTimeout(() => {
            setData(mockData)
            setIsLoading(false)
        }, 300)

        return () => clearTimeout(timer)
    }, [id])

    return { data, isLoading, error }
}