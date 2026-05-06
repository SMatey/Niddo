import { z } from 'zod'
import { PROFILE_FORM } from '@/features/users/constants/profile-form.constants'
import type { ProfileFormValues } from '@/features/users/types/profile-form.types'

const toNumberFromInput = (value: unknown) => {
  if (value === '' || value === null || value === undefined) {
    return undefined
  }

  if (typeof value === 'number' && Number.isNaN(value)) {
    return undefined
  }

  return Number(value)
}

const avatarField = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => {
      if (!value) {
        return true
      }

      return value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:image/')
    },
    { message: PROFILE_FORM.VALIDATION.AVATAR_INVALID }
  )

export const profileFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, PROFILE_FORM.VALIDATION.NAME_MIN)
      .max(80, PROFILE_FORM.VALIDATION.NAME_MAX),
    age: z.preprocess(
      toNumberFromInput,
      z
        .number()
        .int()
        .min(PROFILE_FORM.AGE.MIN, PROFILE_FORM.VALIDATION.AGE_MIN)
        .max(PROFILE_FORM.AGE.MAX, PROFILE_FORM.VALIDATION.AGE_MAX)
    ),
    avatar: avatarField,
    bio: z
      .string()
      .trim()
      .max(PROFILE_FORM.BIO.MAX_LENGTH, PROFILE_FORM.VALIDATION.BIO_MAX)
      .optional(),
    location: z
      .string()
      .trim()
      .max(120, PROFILE_FORM.VALIDATION.LOCATION_MAX)
      .optional(),
    budget_min: z.preprocess(
      toNumberFromInput,
      z
        .number()
        .int()
        .min(PROFILE_FORM.BUDGET.MIN, PROFILE_FORM.VALIDATION.BUDGET_MIN)
        .optional()
    ),
    budget_max: z.preprocess(
      toNumberFromInput,
      z
        .number()
        .int()
        .min(PROFILE_FORM.BUDGET.MIN, PROFILE_FORM.VALIDATION.BUDGET_MAX)
        .optional()
    ),
  })
  .refine(
    (values) => {
      if (values.budget_min == null || values.budget_max == null) {
        return true
      }

      return values.budget_min <= values.budget_max
    },
    {
      message: PROFILE_FORM.VALIDATION.BUDGET_RANGE,
      path: ['budget_max'],
    }
  )

export type ProfileFormSchemaValues = z.infer<typeof profileFormSchema>

export const toProfileFormDefaults = (data?: Partial<ProfileFormValues> | null): ProfileFormValues => ({
  name: data?.name ?? '',
  age: data?.age ?? PROFILE_FORM.AGE.MIN,
  avatar: data?.avatar ?? '',
  bio: data?.bio ?? '',
  location: data?.location ?? '',
  budget_min: data?.budget_min,
  budget_max: data?.budget_max,
})
