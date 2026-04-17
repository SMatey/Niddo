'use client'

import { cn } from '@/lib/utils'
import { Input } from './input'
import { UI_LABELS } from '@/shared/constants/ui.constants'
import type { PriceRangeProps } from './types'

export function PriceRange({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  minPlaceholder = UI_LABELS.priceRangeMin,
  maxPlaceholder = UI_LABELS.priceRangeMax,
  currency = '$',
  className,
}: PriceRangeProps) {
  return (
    <div className={cn('flex flex-nowrap items-center gap-2', className)}>
      <div className="relative flex-1 min-w-0">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">
          {currency}
        </span>
        <Input
          type="number"
          value={minValue}
          onChange={(e) => onMinChange(e.target.value)}
          placeholder={minPlaceholder}
          className="pl-7"
          min="0"
        />
      </div>
      <span className="text-text-muted shrink-0">{UI_LABELS.priceRangeSeparator}</span>
      <div className="relative flex-1 min-w-0">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">
          {currency}
        </span>
        <Input
          type="number"
          value={maxValue}
          onChange={(e) => onMaxChange(e.target.value)}
          placeholder={maxPlaceholder}
          className="pl-7"
          min="0"
        />
      </div>
    </div>
  )
}
