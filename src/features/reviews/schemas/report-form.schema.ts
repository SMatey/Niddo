import { z } from 'zod'
import { DEFAULT_REPORT_REASON, REPORT_FORM, REPORT_REASON_OPTIONS } from '@/features/reviews/constants/report-form.constants'
import type { ReportFormValues } from '@/features/reviews/types/report-form.types'

const reportReasonValues = REPORT_REASON_OPTIONS.map((option) => option.value) as [
  (typeof REPORT_REASON_OPTIONS)[number]['value'],
  ...(typeof REPORT_REASON_OPTIONS)[number]['value'][]
]

export const reportFormSchema = z.object({
  reason: z.enum(reportReasonValues, {
    errorMap: () => ({ message: REPORT_FORM.VALIDATION.REASON_REQUIRED }),
  }),
  description: z
    .string()
    .trim()
    .min(REPORT_FORM.DESCRIPTION.MIN_LENGTH, REPORT_FORM.VALIDATION.DESCRIPTION_MIN)
    .max(REPORT_FORM.DESCRIPTION.MAX_LENGTH, REPORT_FORM.VALIDATION.DESCRIPTION_MAX),
})

export type ReportFormSchemaValues = z.infer<typeof reportFormSchema>

export const toReportFormDefaults = (): ReportFormValues => ({
  reason: DEFAULT_REPORT_REASON,
  description: '',
})
