import { z } from 'zod'

// Comentario: exigimos una reseña mínimamente descriptiva para que la comunidad reciba contexto útil.
export const createReviewSchema = z.object({
  confirmationId: z.string().min(1, 'Selecciona la convivencia confirmada que respalda tu reseña.'),
  rating: z
    .number({
      invalid_type_error: 'Selecciona una calificación entre 1 y 5 estrellas.',
      required_error: 'Selecciona una calificación entre 1 y 5 estrellas.',
    })
    .min(1, 'Selecciona una calificación entre 1 y 5 estrellas.')
    .max(5, 'Selecciona una calificación entre 1 y 5 estrellas.'),
  comment: z
    .string()
    .trim()
    .min(20, 'Cuéntale a la comunidad al menos un poco más de tu experiencia.')
    .max(500, 'La reseña debe tener como máximo 500 caracteres.'),
})

export type CreateReviewValues = z.infer<typeof createReviewSchema>
