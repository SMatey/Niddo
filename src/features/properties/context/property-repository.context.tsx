import { createContext, useContext } from 'react'
import type { PropertyRepository } from '@/features/properties/types/property-repository.types'

export const PropertyRepositoryContext = createContext<PropertyRepository | null>(null)

export function PropertyRepositoryProvider({
    repository,
    children
}: {
    repository: PropertyRepository
    children: React.ReactNode
}) {
    return (
        <PropertyRepositoryContext.Provider value={repository}>
            {children}
        </PropertyRepositoryContext.Provider>
    )
}

export function usePropertyRepository(): PropertyRepository {
    const repo = useContext(PropertyRepositoryContext)
    if (!repo) throw new Error('PropertyRepository not provided')
    return repo
}