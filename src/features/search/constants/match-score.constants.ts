export const MATCH_SCORE_LABELS = {
  SCORE_SUFFIX: '%',
  COMPATIBLE: 'Match',
} as const

export const MATCH_SCORE_THRESHOLDS = {
  EXCELLENT: { min: 80, max: 100 },
  GOOD: { min: 60, max: 79 },
  FAIR: { min: 40, max: 59 },
  POOR: { min: 0, max: 39 },
} as const

export const MATCH_SCORE_FALLBACK = 0

export const MATCH_SCORE_CLASSES = {
  excellent: {
    bg: 'bg-state-success/10',
    text: 'text-state-success',
    border: 'border-state-success/20',
  },
  good: {
    bg: 'bg-state-warning/10',
    text: 'text-state-warning',
    border: 'border-state-warning/20',
  },
  fair: {
    bg: 'bg-state-warning/10',
    text: 'text-state-warning',
    border: 'border-state-warning/20',
  },
  poor: {
    bg: 'bg-text-muted/10',
    text: 'text-text-muted',
    border: 'border-border',
  },
} as const
