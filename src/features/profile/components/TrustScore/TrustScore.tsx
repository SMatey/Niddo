import { PROFILE } from '../../constants/profile.constants'
import { COMMON_UI } from '@/shared/constants/ui.constants'

export function TrustScore({ score }: { score: number }) {
  return <div>{PROFILE.UI.TRUST_SCORE_LABEL} {score}</div>
}
