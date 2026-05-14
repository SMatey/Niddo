'use client'

import { createClient } from '@/lib/supabase/client'
import { REPORT_FORM } from '@/features/reviews/constants/report-form.constants'
import {
  buildReviewReportDuplicateFilter,
  buildReviewReportInsertPayload,
  createReviewReportModerationStatus,
} from '@/features/reviews/lib/report-domain'
import type {
  CreateReviewReportInput,
  CreateReviewReportResult,
  GetReviewReportModerationInput,
  ReviewReportModerationResult,
} from '@/features/reviews/types/report-form.types'

type ReviewReportRow = {
  id: string
}

type ReviewReportModerationRow = {
  report_count: number | string | null
  auto_hide_threshold: number | string | null
  is_hidden: boolean | null
}

const createReportId = () => `${REPORT_FORM.IDENTIFIERS.REPORT_PREFIX}-${crypto.randomUUID()}`

const isDuplicateConstraintError = (errorMessage?: string | null, errorCode?: string | null) => {
  if (errorCode === '23505') {
    return true
  }

  const normalizedMessage = errorMessage?.toLowerCase()
  return Boolean(normalizedMessage?.includes('duplicate') || normalizedMessage?.includes('unique'))
}

const mapCreateReviewReportError = (errorMessage?: string | null, errorCode?: string | null) =>
  isDuplicateConstraintError(errorMessage, errorCode)
    ? REPORT_FORM.UI.DUPLICATE
    : REPORT_FORM.UI.ERROR

async function hasDuplicateReport(input: CreateReviewReportInput) {
  const supabase = createClient()
  const duplicateFilter = buildReviewReportDuplicateFilter({
    reporterId: input.reporterId,
    subject: input.subject,
    reason: input.reason,
  })

  let query = supabase
    .from('review_reports')
    .select('id')
    .eq('reporter_id', duplicateFilter.reporterId)
    .eq('report_target_type', duplicateFilter.reportTargetType)
    .eq('report_reason_type', duplicateFilter.reportReasonType)
    .eq('reported_profile_id', duplicateFilter.reportedProfileId)

  if (duplicateFilter.reportedPropertyId) {
    query = query.eq('reported_property_id', duplicateFilter.reportedPropertyId)
  } else {
    query = query.is('reported_property_id', null)
  }

  if (duplicateFilter.relatedReviewId) {
    query = query.eq('related_review_id', duplicateFilter.relatedReviewId)
  } else {
    query = query.is('related_review_id', null)
  }

  const { data, error } = await query.limit(1).maybeSingle<ReviewReportRow>()

  if (error) {
    return { data: false, error: error.message }
  }

  return { data: Boolean(data), error: null }
}

export async function getReviewReportModerationStatus(
  input: GetReviewReportModerationInput
): Promise<ReviewReportModerationResult> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('get_review_report_moderation_status', {
    target_type: input.targetType,
    target_id: input.targetId,
  })

  if (error) {
    return { data: null, error: REPORT_FORM.UI.MODERATION_ERROR }
  }

  const moderationRow = Array.isArray(data) ? data[0] : data

  return {
    data: createReviewReportModerationStatus((moderationRow ?? null) as ReviewReportModerationRow | null),
    error: null,
  }
}

export async function createReviewReport(
  input: CreateReviewReportInput
): Promise<CreateReviewReportResult> {
  const duplicateResult = await hasDuplicateReport(input)

  if (duplicateResult.error) {
    return { error: REPORT_FORM.UI.ERROR, moderationStatus: null }
  }

  if (duplicateResult.data) {
    return { error: REPORT_FORM.UI.DUPLICATE, moderationStatus: null }
  }

  const supabase = createClient()
  const payload = buildReviewReportInsertPayload({
    reportId: createReportId(),
    reporterId: input.reporterId,
    subject: input.subject,
    reason: input.reason,
    description: input.description,
  })

  const { error } = await supabase.from('review_reports').insert(payload)

  if (error) {
    return {
      error: mapCreateReviewReportError(error.message, error.code),
      moderationStatus: null,
    }
  }

  const moderationStatusResult = await getReviewReportModerationStatus({
    targetType: input.subject.targetType,
    targetId: input.subject.targetId,
  })

  return {
    error: null,
    moderationStatus: moderationStatusResult.data,
  }
}
