'use client'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Search, Home, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSearchBar } from '../hooks/use-search-bar'

export function SearchBar() {
  const {
    types,
    placeholder,
    searchButtonLabel,
    searchType,
    setSearchType,
    location,
    setLocation,
    handleSearch,
    handleKeyPress,
  } = useSearchBar()
  const iconMap = {
    home: Home,
    users: Users,
  } as const

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex gap-4 bg-background rounded-lg p-1 border border-border">
        {types.map((type) => {
          const Icon = iconMap[type.icon as keyof typeof iconMap]
          const isSelected = searchType === type.key

          return (
            <button
              key={type.key}
              onClick={() => setSearchType(type.key)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all font-medium',
                isSelected ? 'bg-white text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'
              )}
            >
              <Icon className="w-4 h-4" />
              {type.label}
            </button>
          )
        })}
      </div>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            <Search className="w-4 h-4" />
          </div>
          <Input
            type="text"
            placeholder={placeholder}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        <Button
          onClick={handleSearch}
          size="lg"
          className="bg-brand-600 hover:bg-brand-700 text-white gap-2"
        >
          <Search className="w-4 h-4" />
          {searchButtonLabel}
        </Button>
      </div>
    </div>
  )
}
