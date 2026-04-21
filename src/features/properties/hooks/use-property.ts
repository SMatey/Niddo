import { useEffect, useState } from 'react'
import type { PropertyDetail } from '@/features/search/types/search.types'
import { propertiesService } from '@/features/properties/lib/supabase-properties'

export interface UsePropertyResult {
    data: PropertyDetail | null
    isLoading: boolean
    error: Error | null
    refresh: () => void
}

export function useProperty(id: string, viewerId?: string | null): UsePropertyResult {
    const [data, setData] = useState<PropertyDetail | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [refreshToken, setRefreshToken] = useState(0)

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

        const legacyMockData: PropertyDetail = {
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
            reviews: [],
            reviewSummary: {
                averageRating: 0,
                totalReviews: 0,
                confirmedReviews: 0,
            },
            reviewComposer: null,
        }

        const timer = setTimeout(() => {
            try {
                // Comentario: priorizamos el detalle enriquecido del servicio y usamos un mock local si aún no hay datos resueltos.
                setData(propertiesService.getPropertyById(id, viewerId) ?? legacyMockData)
                setIsLoading(false)
            } catch (serviceError) {
                // Comentario: el mock local evita romper la pantalla mientras el origen real de datos sigue en transición.
                setData(legacyMockData)
                setError(serviceError instanceof Error ? serviceError : new Error('No se pudo cargar la propiedad.'))
                setIsLoading(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [id, refreshToken, viewerId])

    return {
        data,
        isLoading,
        error,
        refresh: () => setRefreshToken((currentToken) => currentToken + 1),
    }
}
