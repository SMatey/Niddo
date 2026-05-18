import { createContext, useContext } from 'react'
import type { UserRepository } from '@/features/users/types/user-repository.types'

const UserRepositoryContext = createContext<UserRepository | null>(null)

export function UserRepositoryProvider({
    repository,
    children
}: {
    repository: UserRepository
    children: React.ReactNode
}) {
    return (
        <UserRepositoryContext.Provider value={repository}>
            {children}
        </UserRepositoryContext.Provider>
    )
}

export function useUserRepository(): UserRepository {
    const repo = useContext(UserRepositoryContext)
    if (!repo) throw new Error('UserRepository not provided')
    return repo
}
