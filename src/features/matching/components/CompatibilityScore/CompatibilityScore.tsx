import { MATCHING } from '../../constants/matching.constants'
import { COMMON_UI } from '@/shared/constants/ui.constants'

export function CompatibilityScore({ score }: { score: number }) {
  return <div>{MATCHING.UI.COMPATIBILITY_LABEL} {score}{COMMON_UI.UNIT.PERCENT}</div>
}
