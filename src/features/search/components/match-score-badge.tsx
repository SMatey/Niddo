import { getMatchScoreLevel, type MatchScoreLevel } from '../types/preference.types'
import { MATCH_SCORE_CLASSES, MATCH_SCORE_LABELS } from '../constants/match-score.constants'

interface MatchScoreBadgeProps {
  score: number
  level?: MatchScoreLevel
}

export function MatchScoreBadge({ score, level }: MatchScoreBadgeProps) {
  const actualLevel = level ?? getMatchScoreLevel(score)
  const classes = MATCH_SCORE_CLASSES[actualLevel]

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border transition-all duration-200 ${classes.bg} ${classes.text} ${classes.border}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-3.5 h-3.5 shrink-0"
      >
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <span>
        {score}
        {MATCH_SCORE_LABELS.SCORE_SUFFIX} {MATCH_SCORE_LABELS.COMPATIBLE}
      </span>
    </span>
  )
}

