'use client';
s
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Property } from '@/features/properties/types'

export interface UseMyPropertiesResult {
    properties: Property[]
    total: number
    page: number
    pageSize: number
    setPage: (page: number) => void
    totalPages: number
    hasMore: boolean
    isLoading: boolean
    error: Error | null
    refresh: () => void
}

export function useMyProperties(pageSize = 10): UseMyPropertiesResult {
    const [page, setPage] = useState(1)
    const [properties, setProperties] = useState<Property[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [total, setTotal] = useState(0)
    const [refreshCount, setRefreshCount] = useState(0)

    const handleSetPage = useCallback((newPage: number) => {
        setPage(newPage)
    }, [])

    const refresh = useCallback(() => {
        setRefreshCount(c => c + 1)
        setPage(1)
    }, [])

    useEffect(() => {
        const fetchMyProperties = async () => {
            setIsLoading(true)
            setError(null)
            
            try {
                const supabase = createClient()
                const { data: { session } } = await supabase.auth.getSession()
                
                if (!session) {
                    setProperties([])
                    setIsLoading(false)
                    return
                }

                const params = new URLSearchParams({
                    page: String(page),
                    pageSize: String(pageSize)
                })

                const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
                const functionUrl = `${supabaseUrl}/functions/v1/my-properties-list?${params.toString()}`

                const response = await fetch(functionUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`,
                        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                    }
                })

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP Error ${response.status}: ${errorText}`)
                }

                const data = await response.json()

                setProperties(data.items ?? [])
                setTotal(data.total ?? 0)
            } catch (err: any) {
                console.error("Error fetching my properties:", err)
                setError(err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchMyProperties()
    }, [page, pageSize, refreshCount])

    return {
        properties,
        total,
        page,
        pageSize,
        setPage: handleSetPage,
        totalPages: Math.ceil(total / pageSize),
        hasMore: page * pageSize < total,
        isLoading,
        error,
        refresh
    }
}
