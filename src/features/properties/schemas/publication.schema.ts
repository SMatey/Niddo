import { z } from 'zod'
import { PROPERTY_PUBLICATION_LABELS } from '@/features/properties/constants/publication.constants'
import { PUBLICATION_VALIDATION_MESSAGES } from '@/features/properties/constants/publication-validation.constants'

const parseNullableNumber = z.preprocess((value) => {
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  return null
}, z.number().min(0).nullable())

export const publicationSchema = z
  .object({
    title: z
      .string()
      .min(10, PROPERTY_PUBLICATION_LABELS.validation.titleRequired)
      .max(120),
    description: z.string().max(1000).optional().or(z.literal('')),
    price: z.string().min(2, PROPERTY_PUBLICATION_LABELS.validation.priceRequired),
    location: z.string().min(5, PROPERTY_PUBLICATION_LABELS.validation.locationRequired),
    bedrooms: parseNullableNumber,
    bathrooms: parseNullableNumber,
    squareMeters: parseNullableNumber,
    availableFrom: z.string().min(1, PROPERTY_PUBLICATION_LABELS.validation.availableFromRequired),
    availableTo: z.string().min(1, PROPERTY_PUBLICATION_LABELS.validation.availableToRequired),
    latitude: z
      .preprocess((value) => {
        if (typeof value === 'string') {
          const parsed = Number(value)
          return Number.isFinite(parsed) ? parsed : null
        }

        if (typeof value === 'number') {
          return Number.isFinite(value) ? value : null
        }

        return null
      }, z.number().min(-90).max(90).nullable()),
    longitude: z
      .preprocess((value) => {
        if (typeof value === 'string') {
          const parsed = Number(value)
          return Number.isFinite(parsed) ? parsed : null
        }

        if (typeof value === 'number') {
          return Number.isFinite(value) ? value : null
        }

        return null
      }, z.number().min(-180).max(180).nullable()),
    amenities: z.array(z.string().min(1)).max(15),
    rules: z.array(z.string().min(1)).max(15),
  })
  .refine((values) => values.availableTo >= values.availableFrom, {
    path: ['availableTo'],
    message: PUBLICATION_VALIDATION_MESSAGES.dateRange,
  })
  .refine((values) => values.latitude !== null && values.longitude !== null, {
    path: ['location'],
    message: PROPERTY_PUBLICATION_LABELS.validation.coordinatesRequired,
  })

export type PublicationFormValues = z.infer<typeof publicationSchema>
