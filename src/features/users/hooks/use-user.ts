import { useEffect, useState } from 'react'
import type { UserDetail } from '@/features/search/types/search.types'
import { usersService } from '@/features/users/lib/supabase-users'

export interface UseUserResult {
    data: UserDetail | null
    isLoading: boolean
    error: Error | null
    refresh: () => void
}

export function useUser(id: string, viewerId?: string | null): UseUserResult {
    const [data, setData] = useState<UserDetail | null>(null)
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
        //   .from('users')
        //   .select('*')
        //   .eq('id', id)
        //   .single()

        const legacyMockData: UserDetail = {
            id,
            name: 'María García',
            age: 24,
            bio: 'Estudiante de medicina buscando compañero de cuarto tranquilo y responsable. No fumo, tengo una gatita llamada Luna.',
            location: 'San José, Costa Rica',
            imageUrl: undefined,
            verified: true,
            isFavorite: false,
            minBudget: '$400',
            maxBudget: '$600',
            confidenceScore: 85,
            lat: 9.9281,
            lng: -84.0907,
            lifestyles: ['Limpieza', 'Calefacción', 'Internet fiber'],
            memberSince: '2023',
            description: 'Busco un lugar tranquilo para estudiar y descansar.',
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
                setData(usersService.getUserById(id, viewerId) ?? legacyMockData)
                setIsLoading(false)
            } catch (serviceError) {
                // Comentario: el mock local evita romper la pantalla mientras el origen real de datos sigue en transición.
                setData(legacyMockData)
                setError(serviceError instanceof Error ? serviceError : new Error('No se pudo cargar el usuario.'))
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
