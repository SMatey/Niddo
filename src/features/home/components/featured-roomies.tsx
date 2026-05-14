'use client'

import Link from 'next/link'
import { Building2 } from 'lucide-react'
import { Tag } from '@/shared/components/ui/tag'
import { Button } from '@/shared/components/ui/button'
import { UserAvatar, UserInfo } from '@/shared/components/ui/user-avatar'
import { BudgetBadge } from '@/shared/components/ui/budget-badge'
import { useFeaturedRoomies } from '../hooks/use-featured-roomies'
import type { UserItem } from '@/features/search/types/search.types'

export function FeaturedRoomies() {
  const {
    title,
    description,
    viewAllLabel,
    viewAllHref,
    itemsToShow,
    cta,
    loginPrompt,
    users,
    isLoading,
    isPromptOpen,
    handlePublishClick,
    closePrompt,
    handleLoginPrompt,
  } = useFeaturedRoomies()

  return (
    <section className="space-y-6 pt-6 pb-10">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="text-text-muted">{description}</p>
        </div>
        <Link href={viewAllHref} className="text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
          {viewAllLabel} <span>→</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: itemsToShow }).map((_, i) => (
              <div key={i} className="bg-surface rounded-lg border border-border h-80 animate-pulse" />
            ))
          : users.slice(0, itemsToShow).map((currentUser: UserItem) => (
              <Link key={currentUser.id} href={`/usuario/${currentUser.id}`} className="block">
                <div className="bg-surface rounded-lg border border-border overflow-hidden hover:border-brand-600 transition-colors h-full">
                  <div className="p-4 space-y-4">
                    {/* Header: Avatar + Info */}
                    <div className="flex items-start gap-3">
                      <UserAvatar
                        name={currentUser.name}
                        imageUrl={currentUser.imageUrl}
                        verified={currentUser.verified}
                        age={currentUser.age}
                      />
                      <UserInfo
                        name={currentUser.name}
                        verified={currentUser.verified}
                        age={currentUser.age}
                        location={currentUser.location}
                      />
                    </div>

                    {/* Bio */}
                    {currentUser.bio && (
                      <p className="text-sm text-text-secondary line-clamp-2">{currentUser.bio}</p>
                    )}

                    {/* Budget */}
                    <BudgetBadge minBudget={currentUser.minBudget} maxBudget={currentUser.maxBudget} />

                    {/* Lifestyles */}
                    {currentUser.lifestyles && currentUser.lifestyles.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {currentUser.lifestyles.slice(0, 4).map((l) => (
                          <Tag key={l} variant="outline" className="text-xs">
                            {l}
                          </Tag>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
      </div>
      <div className="mt-10 rounded-3xl border border-border bg-surface-muted px-6 py-10 text-center sm:px-10">
        <h3 className="text-2xl sm:text-3xl font-semibold">{cta.title}</h3>
        <p className="mt-2 text-text-muted">{cta.subtitle}</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-brand-600 hover:bg-brand-700 text-white">
            <Link href={cta.searchHref}>{cta.searchButtonLabel}</Link>
          </Button>
          <Button variant="outline" onClick={handlePublishClick}>
            {cta.publishButtonLabel}
          </Button>
        </div>
      </div>
      {isPromptOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={closePrompt}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted">
              <Building2 className="h-8 w-8 text-text-muted" />
            </div>
            <h3 className="text-2xl font-bold">{loginPrompt.title}</h3>
            <p className="mt-2 text-text-muted">{loginPrompt.description}</p>
            <Button
              className="mt-6 w-full sm:w-auto"
              onClick={handleLoginPrompt}
            >
              {loginPrompt.loginButtonLabel}
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}
