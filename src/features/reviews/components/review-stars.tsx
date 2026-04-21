'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReviewStarsProps {
  value: number
  onChange?: (value: number) => void
  size?: 'sm' | 'md'
}

export function ReviewStars({ value, onChange, size = 'md' }: ReviewStarsProps) {
  const iconClassName = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const ratingValue = index + 1
        const isActive = ratingValue <= value

        if (!onChange) {
          return (
            <Star
              key={ratingValue}
              className={cn(iconClassName, isActive ? 'fill-yellow-400 text-yellow-400' : 'text-border')}
            />
          )
        }

        return (
          <button
            key={ratingValue}
            type="button"
            onClick={() => onChange(ratingValue)}
            className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label={`Seleccionar ${ratingValue} estrellas`}
          >
            <Star
              className={cn(iconClassName, isActive ? 'fill-yellow-400 text-yellow-400' : 'text-border')}
            />
          </button>
        )
      })}
    </div>
  )
}
