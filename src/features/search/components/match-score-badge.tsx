import { getMatchScoreLevel, type MatchScoreLevel } from '../types/preference.types'
import { MATCH_SCORE_CLASSES, MATCH_SCORE_LABELS } from '../constants/match-score.constants'
import type { MatchScoreBadgeProps } from '../types/ui.types'

export function MatchScoreBadge({ score, level }: MatchScoreBadgeProps) {
  const actualLevel = level ?? getMatchScoreLevel(score)
  const classes = MATCH_SCORE_CLASSES[actualLevel]

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full border ${classes.bg} ${classes.text} ${classes.border}`}
    >
      {score}
      {MATCH_SCORE_LABELS.SCORE_SUFFIX}{' '}
      {MATCH_SCORE_LABELS.COMPATIBLE}
    </span>
  )
}
