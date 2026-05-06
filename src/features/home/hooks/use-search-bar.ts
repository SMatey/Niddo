'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { KeyboardEvent } from 'react'
import { HOME_DATA } from '../constants/home.constants'

type SearchType = (typeof HOME_DATA.search_bar.types)[number]['key']

export function useSearchBar() {
  const router = useRouter()
  const { types, placeholder, searchButtonLabel, defaultType, searchRoute, searchParams } =
    HOME_DATA.search_bar
  const [searchType, setSearchType] = useState<SearchType>(defaultType)
  const [location, setLocation] = useState('')

  const handleSearch = useCallback(() => {
    if (!location.trim()) {
      return
    }

    const params = new URLSearchParams({
      [searchParams.type]: searchType,
      [searchParams.location]: location,
    })

    router.push(`${searchRoute}?${params.toString()}`)
  }, [location, router, searchParams.location, searchParams.type, searchRoute, searchType])

  const handleKeyPress = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSearch()
      }
    },
    [handleSearch]
  )

  return {
    types,
    placeholder,
    searchButtonLabel,
    searchType,
    setSearchType,
    location,
    setLocation,
    handleSearch,
    handleKeyPress,
  }
}
