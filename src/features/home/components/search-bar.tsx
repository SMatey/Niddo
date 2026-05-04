'use client'

import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Search, Home, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HOME_DATA } from '../home.data'

type SearchType = 'vivienda' | 'roomie'

export function SearchBar() {
  const { typeOptions, placeholder, searchButtonLabel } = HOME_DATA.search_bar
  const [searchType, setSearchType] = useState<SearchType>('vivienda')
  const [location, setLocation] = useState('')

  const handleSearch = () => {
    if (location.trim()) {
      const params = new URLSearchParams({
        tipo: searchType,
        ubicacion: location,
      })
      window.location.href = `/explorar?${params.toString()}`
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex gap-4 bg-background rounded-lg p-1 border border-border">
        <button
          onClick={() => setSearchType('vivienda')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all font-medium',
            searchType === 'vivienda'
              ? 'bg-white text-text-primary shadow-sm'
              : 'text-text-muted hover:text-text-primary'
          )}
        >
          <Home className="w-4 h-4" />
          {typeOptions.vivienda}
        </button>
        <button
          onClick={() => setSearchType('roomie')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all font-medium',
            searchType === 'roomie'
              ? 'bg-white text-text-primary shadow-sm'
              : 'text-text-muted hover:text-text-primary'
          )}
        >
          <Users className="w-4 h-4" />
          {typeOptions.roomie}
        </button>
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
