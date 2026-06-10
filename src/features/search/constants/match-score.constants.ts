export const MATCH_SCORE_LABELS = {
  SCORE_SUFFIX: '%',
  COMPATIBLE: 'compatible',
} as const

export const MATCH_SCORE_CLASSES = {
  excellent: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-200',
  },
  good: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  fair: {
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    border: 'border-orange-200',
  },
  poor: {
    bg: 'bg-gray-100',
    text: 'text-gray-500',
    border: 'border-gray-200',
  },
} as const