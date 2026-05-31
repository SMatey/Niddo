'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { PropertiesService } from '@/features/properties/lib/supabase-properties'
import { UsersService } from '@/features/users/lib/supabase-users'
import { SupabasePropertyRepository } from '@/features/properties/repositories/supabase-property.repository'
import { SupabaseUserRepository } from '@/features/users/repositories/supabase-user.repository'
import type { PropertyRepository } from '@/features/properties/types/property-repository.types'
import type { UserRepository } from '@/features/users/types/user-repository.types'
import type { SearchServiceProviderProps } from '../types/context.types'

function createDefaultPropertyRepository(): PropertyRepository {
    return new SupabasePropertyRepository(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

function createDefaultUserRepository(): UserRepository {
    return new SupabaseUserRepository(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

export interface SearchServiceContextValue {
    propertiesService: PropertiesService
    usersService: UsersService
    // Expose repositories for consumers that need them directly (e.g. detail pages)
    propertyRepository?: PropertyRepository
    userRepository?: UserRepository
}

const SearchServiceContext = createContext<SearchServiceContextValue | null>(null)

export function SearchServiceProvider({
    children,
    propertyRepository,
    userRepository,
}: SearchServiceProviderProps) {
    const value = useMemo<SearchServiceContextValue>(() => {
        const resolvedPropertyRepo = propertyRepository ?? createDefaultPropertyRepository()
        const resolvedUserRepo = userRepository ?? createDefaultUserRepository()
        return {
            propertyRepository: resolvedPropertyRepo,
            userRepository: resolvedUserRepo,
            propertiesService: new PropertiesService(resolvedPropertyRepo),
            usersService: new UsersService(resolvedUserRepo),
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