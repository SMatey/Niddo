import { useState, useEffect } from 'react'
import type { UserDetail } from '@/features/search/types/domain.types'
import { getUserDetail } from '@/features/users/lib/supabase-users'

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

        async function fetchUser() {
            setIsLoading(true)
            setError(null)

            try {
                const result = await getUserDetail(id)

                if (!result) {
                    setError(new Error('Usuario no encontrado'))
                    setData(null)
                } else {
                    setData(result)
                }
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Error al cargar el usuario'))
                setData(null)
            } finally {
                setIsLoading(false)
            }
        }

        fetchUser()
    }, [id])

    return { data, isLoading, error }
}