'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { SupabasePropertyRepository } from '@/features/properties/repositories/supabase-property.repository'
import { SupabaseUserRepository } from '@/features/users/repositories/supabase-user.repository'
import { PropertiesService } from '@/features/properties/lib/supabase-properties'
import { UsersService } from '@/features/users/lib/supabase-users'
import type { PropertyRepository } from '@/features/properties/types/property-repository.types'
import type { UserRepository } from '@/features/users/types/user-repository.types'
import type { SearchServiceProviderProps } from '../types/search.types'

export interface SearchServiceContextValue {
    propertiesService: PropertiesService
    usersService: UsersService
    // Expose repositories for consumers that need them directly (e.g. detail pages)
    propertyRepository: PropertyRepository
    userRepository: UserRepository
}

const SearchServiceContext = createContext<SearchServiceContextValue | null>(null)

export function SearchServiceProvider({
    children,
    propertyRepository: injectedPropertyRepo,
    userRepository: injectedUserRepo,
}: SearchServiceProviderProps) {
    const value = useMemo<SearchServiceContextValue>(() => {
        const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

        const propertyRepository = injectedPropertyRepo ?? new SupabasePropertyRepository(baseUrl, apiKey)
        const userRepository = injectedUserRepo ?? new SupabaseUserRepository(baseUrl, apiKey)

        return {
            propertyRepository,
            userRepository,
            propertiesService: new PropertiesService(propertyRepository),
            usersService: new UsersService(userRepository),
        }
    }, [injectedPropertyRepo, injectedUserRepo])

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

export function useSearchServices(): Pick<SearchServiceContextValue, 'propertiesService' | 'usersService'> {
    const context = useContext(SearchServiceContext)
    if (!context) {
        throw new Error('useSearchServices must be used within SearchServiceProvider')
    }
    return {
        propertiesService: context.propertiesService,
        usersService: context.usersService,
    }
}

export { SearchServiceContext }