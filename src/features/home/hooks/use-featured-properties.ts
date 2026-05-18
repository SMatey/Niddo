'use client'

import { useProperties } from '@/features/properties/hooks/use-properties'
import { HOME_DATA, EMPTY_FILTERS } from '../constants/home.constants'

export function useFeaturedProperties() {
  const { pageSize, itemsToShow, title, description, viewAllLabel, viewAllHref } =
    HOME_DATA.featured_properties
  const { data: properties, isLoading } = useProperties(EMPTY_FILTERS, null, { initialPageSize: pageSize })

  return {
    title,
    description,
    viewAllLabel,
    viewAllHref,
    itemsToShow,
    properties: properties ?? [],
    isLoading,
  }
}
