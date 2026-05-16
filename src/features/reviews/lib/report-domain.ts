import { REPORT_FORM } from '../constants/report-form.constants.ts'
import type {
  CreateReviewReportInput,
  ReviewReportModerationStatus,
  ReviewReportSubject,
  ReviewReportTargetContext,
} from '../types/report-form.types.ts'

export interface ReviewReportInsertPayload {
  id: string
  reporter_id: string
  report_target_type: ReviewReportSubject['targetType']
  report_reason_type: CreateReviewReportInput['reason']
  reported_profile_id: string
  reported_property_id: string | null
  related_review_id: string | null
  description: string
}

export interface ReviewReportModerationSource {
  report_count: number | string | null
  auto_hide_threshold: number | string | null
  is_hidden: boolean | null
}

const normalizeReportDescription = (description: string) => description.trim()

const normalizeReportMetric = (value: number | string | null, fallbackValue: number) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsedValue = Number(value)

    if (Number.isFinite(parsedValue)) {
      return parsedValue
    }
  }

  return fallbackValue
}

export const hasReachedReportAutoHideThreshold = (reportCount: number, autoHideThreshold: number) =>
  reportCount >= autoHideThreshold

export const buildReviewReportSubject = ({
  target,
}: ReviewReportTargetContext): ReviewReportSubject => ({
  targetType: target.type,
  targetId: target.id,
  targetLabel: target.title,
  reportedProfileId: target.publicationProfile.id,
  reportedPropertyId: target.type === 'property' ? target.id : null,
  relatedReviewId: null,
})

export const buildReviewReportInsertPayload = (input: {
  reportId: string
  reporterId: string
  subject: ReviewReportSubject
  reason: CreateReviewReportInput['reason']
  description: string
}): ReviewReportInsertPayload => ({
  id: input.reportId,
  reporter_id: input.reporterId,
  report_target_type: input.subject.targetType,
  report_reason_type: input.reason,
  reported_profile_id: input.subject.reportedProfileId,
  reported_property_id: input.subject.reportedPropertyId,
  related_review_id: input.subject.relatedReviewId,
  description: normalizeReportDescription(input.description),
})

export const buildReviewReportDuplicateFilter = (input: {
  reporterId: string
  subject: ReviewReportSubject
  reason: CreateReviewReportInput['reason']
}) => ({
  reporterId: input.reporterId,
  reportTargetType: input.subject.targetType,
  reportReasonType: input.reason,
  reportedProfileId: input.subject.reportedProfileId,
  reportedPropertyId: input.subject.reportedPropertyId,
  relatedReviewId: input.subject.relatedReviewId,
})

export const createReviewReportModerationStatus = (
  source: ReviewReportModerationSource | null | undefined
): ReviewReportModerationStatus => {
  const autoHideThreshold = normalizeReportMetric(
    source?.auto_hide_threshold ?? null,
    REPORT_FORM.MODERATION.FALLBACK_AUTO_HIDE_THRESHOLD
  )
  const reportCount = normalizeReportMetric(source?.report_count ?? null, 0)

  return {
    reportCount,
    autoHideThreshold,
    isHidden:
      typeof source?.is_hidden === 'boolean'
        ? source.is_hidden
        : hasReachedReportAutoHideThreshold(reportCount, autoHideThreshold),
  }
}
