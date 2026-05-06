'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { useUsers } from '@/features/users/hooks/use-users'
import { useAuthModal } from '@/shared/hooks/useAuthModal'
import { HOME_DATA } from '../constants/home.constants'

export function useFeaturedRoomies() {
  const router = useRouter()
  const {
    title,
    description,
    viewAllLabel,
    viewAllHref,
    pageSize,
    itemsToShow,
    publishHref,
    cta,
    loginPrompt,
  } = HOME_DATA.featured_roomies
  const { data: users, isLoading } = useUsers(null, { initialPageSize: pageSize })
  const { user, isInitialized } = useAuth()
  const { onOpenWithTab } = useAuthModal()
  const [isPromptOpen, setIsPromptOpen] = useState(false)

  const handlePublishClick = useCallback(() => {
    if (!isInitialized) {
      return
    }

    if (!user) {
      setIsPromptOpen(true)
      return
    }

    router.push(publishHref)
  }, [isInitialized, publishHref, router, user])

  const closePrompt = useCallback(() => {
    setIsPromptOpen(false)
  }, [])

  const handleLoginPrompt = useCallback(() => {
    closePrompt()
    onOpenWithTab('login')
  }, [closePrompt, onOpenWithTab])

  return {
    title,
    description,
    viewAllLabel,
    viewAllHref,
    itemsToShow,
    cta,
    loginPrompt,
    users: users ?? [],
    isLoading,
    isPromptOpen,
    handlePublishClick,
    closePrompt,
    handleLoginPrompt,
  }
}
