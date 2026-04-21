import { useState, useEffect } from 'react'
import type { UserDetail } from '@/features/search/types/search.types'

export interface UseUserResult {
    data: UserDetail | null
    isLoading: boolean
    error: Error | null
}

export function useUser(id: string) {
    const [data, setData] = useState<UserDetail | null>(null)
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
        //   .from('users')
        //   .select('*')
        //   .eq('id', id)
        //   .single()

        const mockData: UserDetail = {
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
        }

        const timer = setTimeout(() => {
            setData(mockData)
            setIsLoading(false)
        }, 300)

        return () => clearTimeout(timer)
    }, [id])

    return { data, isLoading, error }
}