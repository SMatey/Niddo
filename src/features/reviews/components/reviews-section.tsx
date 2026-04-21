'use client'

import { FormEvent, useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { useReviews } from '@/features/reviews/hooks/use-reviews'
import type { ReviewTargetType } from '@/features/reviews/types/review.types'

interface ReviewsSectionProps {
  targetType: ReviewTargetType
  targetId: string
  linkedProfileId: string
  targetDisplayName: string
}

const MIN_COMMENT_LENGTH = 10

function formatDate(date: string) {
  return new Intl.DateTimeFormat('es-CR', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(date))
}

export function ReviewsSection({
  targetType,
  targetId,
  linkedProfileId,
  targetDisplayName,
}: ReviewsSectionProps) {
  const [rating, setRating] = useState('5')
  const [comment, setComment] = useState('')
  const [isCohabitationConfirmed, setIsCohabitationConfirmed] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const {
    reviews,
    isLoading,
    error,
    isSubmitting,
    submitError,
    submitSuccess,
    submitReview,
  } = useReviews({
    targetType,
    targetId,
    linkedProfileId,
    targetDisplayName,
  })

  const publishedReviewsCount = reviews.length

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setValidationError(null)

    const numericRating = Number(rating)
    const normalizedComment = comment.trim()

    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      setValidationError('Selecciona una calificacion valida entre 1 y 5.')
      return
    }

    if (normalizedComment.length < MIN_COMMENT_LENGTH) {
      setValidationError(`La resena debe tener al menos ${MIN_COMMENT_LENGTH} caracteres.`)
      return
    }

    const wasCreated = await submitReview({
      rating: numericRating,
      comment: normalizedComment,
      isCohabitationConfirmed,
    })

    if (!wasCreated) {
      return
    }

    setComment('')
    setRating('5')
    setIsCohabitationConfirmed(false)
  }

  const targetLabel = targetType === 'user' ? 'perfil' : 'propiedad'

  return (
    <section className="bg-surface rounded-lg border border-border p-4 md:p-6 space-y-5">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold text-text-primary">Resenas de la comunidad</h2>
        <p className="text-sm text-text-muted">
          Escribe una resena sobre este {targetLabel}. La publicacion solo se asocia al perfil tras confirmar convivencia.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="space-y-1">
            <span className="text-sm font-medium text-text-primary">Calificacion</span>
            <select
              value={rating}
              onChange={(event) => setRating(event.target.value)}
              className="w-full h-10 rounded-md border border-border bg-surface px-3 text-sm text-text-primary"
              disabled={isSubmitting}
            >
              <option value="5">5 - Excelente</option>
              <option value="4">4 - Muy bueno</option>
              <option value="3">3 - Bueno</option>
              <option value="2">2 - Regular</option>
              <option value="1">1 - Malo</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-text-primary">Convivencia</span>
            <span className="flex items-center gap-2 h-10 rounded-md border border-border px-3 text-sm text-text-secondary">
              <input
                type="checkbox"
                checked={isCohabitationConfirmed}
                onChange={(event) => setIsCohabitationConfirmed(event.target.checked)}
                disabled={isSubmitting}
              />
              Confirmo que ya convivi en esta experiencia
            </span>
          </label>
        </div>

        <label className="space-y-1 block">
          <span className="text-sm font-medium text-text-primary">Comentario</span>
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            minLength={MIN_COMMENT_LENGTH}
            placeholder="Cuenta tu experiencia para ayudar a la comunidad."
            className="w-full min-h-28 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1"
            disabled={isSubmitting}
          />
        </label>

        {validationError && <p className="text-sm text-state-error">{validationError}</p>}
        {submitError && <p className="text-sm text-state-error">{submitError}</p>}
        {submitSuccess && <p className="text-sm text-state-success">{submitSuccess}</p>}

        <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
          {isSubmitting ? 'Publicando...' : 'Publicar resena'}
        </Button>
      </form>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-text-primary">Resenas publicadas</h3>
          <span className="text-sm text-text-muted">{publishedReviewsCount}</span>
        </div>

        {isLoading && (
          <p className="text-sm text-text-muted">Cargando resenas...</p>
        )}

        {!isLoading && error && (
          <p className="text-sm text-state-error">{error}</p>
        )}

        {!isLoading && !error && reviews.length === 0 && (
          <p className="text-sm text-text-muted">
            Aun no hay resenas para este {targetLabel}. Puedes publicar la primera.
          </p>
        )}

        {!isLoading && !error && reviews.map((review) => (
          <article key={review.id} className="rounded-md border border-border p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-text-primary">{review.reviewerName}</p>
              <p className="text-xs text-text-muted">{formatDate(review.createdAt)}</p>
            </div>
            <p className="text-sm text-text-secondary">Calificacion: {review.rating}/5</p>
            <p className="text-sm text-text-secondary">{review.comment}</p>
            <p className="text-xs text-text-muted">
              Convivencia confirmada y asociada al perfil: {review.linkedProfileId}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
