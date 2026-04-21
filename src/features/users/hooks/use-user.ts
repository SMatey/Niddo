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

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const functionUrl = `${supabaseUrl}/functions/v1/user-detail`

        async function fetchUser() {
            setIsLoading(true)
            setError(null)

            const response = await fetch(`${functionUrl}?id=${id}`, {
                headers: {
                    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
                },
            })

            if (!response.ok) {
                setError(new Error(`HTTP ${response.status}`))
                setData(null)
                setIsLoading(false)
                return
            }

            const result = await response.json()
            setData(result)
            setIsLoading(false)
        }

        fetchUser()
    }, [id])

    return { data, isLoading, error }
}