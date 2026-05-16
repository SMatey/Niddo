'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { PropertyRepository } from '@/features/properties/types/property-repository.types'
import type { UserRepository } from '@/features/users/types/user-repository.types'
import { SupabasePropertyRepository } from '@/features/properties/repositories/supabase-property.repository'
import { SupabaseUserRepository } from '@/features/users/repositories/supabase-user.repository'


export interface SearchServiceContextValue {
    propertyRepository: PropertyRepository
    userRepository: UserRepository
}

const SearchServiceContext = createContext<SearchServiceContextValue | null>(null)

export interface SearchServiceProviderProps {
    children: ReactNode
    propertyRepository?: PropertyRepository
    userRepository?: UserRepository
}

export function SearchServiceProvider({
    children,
    propertyRepository,
    userRepository,
}: SearchServiceProviderProps) {
    const value = useMemo<SearchServiceContextValue>(() => {
        const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

        return {
            propertyRepository: propertyRepository ?? new SupabasePropertyRepository(baseUrl, apiKey),
            userRepository: userRepository ?? new SupabaseUserRepository(baseUrl, apiKey),
        }
    }, [propertyRepository, userRepository])

    return (
        <SearchServiceContext.Provider value={value}>
            {children}
        </SearchServiceContext.Provider>
    )
}


export function useSearchServiceRepositories(): SearchServiceContextValue {
    const context = useContext(SearchServiceContext)
    if (!context) {
        throw new Error('useSearchServiceRepositories must be used within SearchServiceProvider')
    }
    return context
}


export { SearchServiceContext }