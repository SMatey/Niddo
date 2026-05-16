import { useState, useEffect } from 'react'
import type { PropertyDetail } from '@/features/search/types/search.types'
import { SUPABASE_HEADERS, SUPABASE_ENDPOINTS, API_ERROR_MESSAGES } from '@/lib/supabase/constants'

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

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const functionUrl = `${supabaseUrl}${SUPABASE_ENDPOINTS.FUNCTIONS.PROPERTY_DETAIL}`

        async function fetchProperty() {
            setIsLoading(true)
            setError(null)

            const response = await fetch(`${functionUrl}?id=${id}`, {
                headers: {
                    [SUPABASE_HEADERS.API_KEY]: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                    [SUPABASE_HEADERS.AUTHORIZATION]: `${SUPABASE_HEADERS.BEARER} ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
                },
            })

            if (!response.ok) {
                setError(new Error(`${API_ERROR_MESSAGES.HTTP_PREFIX} ${response.status}`))
                setData(null)
                setIsLoading(false)
                return
            }

            const result = await response.json()
            setData(result)
            setIsLoading(false)
        }

        fetchProperty()
    }, [id])

    return { data, isLoading, error }
}