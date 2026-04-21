import { useEffect, useState } from 'react'
import type { UserItem, FilterState } from '@/features/search/types/search.types'
import { usersService } from '@/features/users/lib/supabase-users'

export interface UseUsersOptions {
    page?: number
    pageSize?: number
}

export interface UseUsersResult {
    data: UserItem[]
    total: number
    page: number
    totalPages: number
    hasMore: boolean
    isLoading: boolean
    error: Error | null
}

// TODO(backend): Replace mock implementation with Supabase query
// The interface and return type must remain unchanged
export function useUsers(
    filters: FilterState | null,
    options: UseUsersOptions = {}
) {
    const { page = 1, pageSize = 20 } = options

    const [data, setData] = useState<UserItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        // TODO(backend): Replace this mock with Supabase query
        // Example:
        // const { data, count } = await supabase
        //   .from('users')
        //   .select('*', { count: 'exact' })
        //   .ilike('location', `%${filters?.location ?? ''}%`)
        //   .range((page - 1) * pageSize, page * pageSize - 1)

        setIsLoading(true)
        setError(null)

        const legacyMockData: UserItem[] = [
            {
                id: '1',
                name: 'María García',
                age: 24,
                bio: 'Estudiante de medicina buscando compañero de cuarto tranquilo y responsable. No fumo, tengo una gatita llamada Luna.',
                location: 'Tibás, Costa Rica',
                verified: true,
                isFavorite: false,
                minBudget: '$400',
                maxBudget: '$600',
                confidenceScore: 85,
                lat: 10.0180,
                lng: -84.0850,
                lifestyles: ['Limpieza', 'Calefacción', 'Internet fiber'],
            },
            {
                id: '2',
                name: 'Carlos Rodríguez',
                age: 31,
                bio: 'Trabajo remoto, necesito espacio tranquilo para video calls. Me gusta el orden y la limpieza.',
                location: 'Curridabat, Costa Rica',
                verified: true,
                isFavorite: true,
                minBudget: '$700',
                maxBudget: '$1,000',
                confidenceScore: 92,
                lat: 9.9150,
                lng: -84.0550,
                lifestyles: ['Internet fiber', 'Aire acondicionado', 'Terraza', 'Balcón'],
            },
            {
                id: '3',
                name: 'Ana Morales',
                age: 27,
                bio: 'Diseñadora gráfica, busco lugar cerca de la oficina en Sabana. Prefiero compartir con profesionales.',
                location: 'San José Centro, Costa Rica',
                verified: false,
                minBudget: '$350',
                maxBudget: '$500',
                confidenceScore: 68,
                lat: 9.9320,
                lng: -84.0750,
                lifestyles: ['Amueblado', 'Estacionamiento'],
            },
            {
                id: '4',
                name: 'Pedro Jiménez',
                age: 29,
                bio: 'Ingeniero de software, busco apartamento cerca de la oficina en Santa Ana.',
                location: 'Santa Ana, Costa Rica',
                verified: true,
                minBudget: '$800',
                maxBudget: '$1,200',
                confidenceScore: 77,
                lat: 9.8620,
                lng: -84.1950,
                lifestyles: ['Gimnasio', 'Internet fiber', 'Estacionamiento'],
            },
        ]

        const serviceUsers = usersService.getUsers()
        // Comentario: usamos el catálogo del servicio para alinear listados y detalles, con respaldo local para evitar estados vacíos.
        const mockData: UserItem[] = serviceUsers.length > 0 ? serviceUsers : legacyMockData

        let filtered = mockData
        if (filters) {
            if (filters.location) {
                filtered = filtered.filter((user) =>
                    user.location?.toLowerCase().includes(filters.location.toLowerCase())
                )
            }
            if (filters.lifestyles.length > 0) {
                filtered = filtered.filter((user) =>
                    filters.lifestyles.every((lifestyle) => user.lifestyles?.includes(lifestyle))
                )
            }
        }

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
