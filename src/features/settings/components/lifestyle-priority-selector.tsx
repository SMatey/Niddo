import {
  LIFESTYLES_BY_CATEGORY,
  CATEGORY_LABELS,
} from '@/features/search/constants/search.constants'
import type {
  LifestyleTag,
  ImportanceLevel,
} from '@/features/search/types/preference.types'
import { IMPORTANCE_LEVELS } from '@/features/search/types/preference.types'
import { IMPORTANCE_OPTION_LABELS } from './lifestyle-priority-selector.constants'
import type { LifestylePrioritySelectorProps } from './lifestyle-priority-selector.types'

function getImportance(
  tagId: string,
  values: { tagId: string; importance: ImportanceLevel }[]
): ImportanceLevel {
  return values.find((v) => v.tagId === tagId)?.importance ?? 'important'
}

export function LifestylePrioritySelector({
  values,
  onChange,
}: LifestylePrioritySelectorProps) {
  const categories = Object.keys(LIFESTYLES_BY_CATEGORY) as Array<
    keyof typeof LIFESTYLES_BY_CATEGORY
  >

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category} className="space-y-3">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
            {CATEGORY_LABELS[category]}
          </h3>
          <div className="space-y-2">
            {LIFESTYLES_BY_CATEGORY[category].map((tag: LifestyleTag) => (
              <PriorityRow
                key={tag.id}
                tag={tag}
                importance={getImportance(tag.id, values)}
                onImportanceChange={(imp) => onChange(tag.id, imp)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

interface PriorityRowProps {
  tag: LifestyleTag
  importance: ImportanceLevel
  onImportanceChange: (importance: ImportanceLevel) => void
}

function PriorityRow({
  tag,
  importance,
  onImportanceChange,
}: PriorityRowProps) {
  const options = Object.values(IMPORTANCE_LEVELS)

  return (
    <div className="flex items-center justify-between py-2 px-3 bg-surface-muted rounded-lg">
      <span className="text-sm font-medium text-text-primary">{tag.label}</span>
      <div className="flex gap-1">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onImportanceChange(option)}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              importance === option
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-surface text-text-secondary border-border hover:border-brand-300'
            }`}
          >
            {IMPORTANCE_OPTION_LABELS[option]}
          </button>
        ))}
      </div>
    </div>
  )
}
