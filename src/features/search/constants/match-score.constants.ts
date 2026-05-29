export const MATCH_SCORE_LABELS = {
  SCORE_SUFFIX: '%',
  COMPATIBLE: 'Match',
} as const

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
