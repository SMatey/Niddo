import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildProfileDetailPath,
  buildProfileTrustScoreUpdate,
  buildPropertyDetailPath,
  buildReviewInsertPayload,
  calculateTrustScoreFromReviews,
  createTrustIndicator,
  createProfileReviewList,
  createProfileReviewTarget,
  createPropertyReviewTarget,
  createPublicationProfile,
  normalizeTrustScore,
} from './review-domain.ts'

test('publica la resena contra el perfil asociado despues de confirmar convivencia', () => {
  const result = buildReviewInsertPayload({
    reviewId: 'review-1',
    authorId: 'author-1',
    reviewedProfileId: 'profile-9',
    rating: 5,
    content: '  Excelente convivencia y comunicacion.  ',
    isVerifiedStay: true,
  })

  assert.equal(result.kind, 'success')

  if (result.kind === 'success') {
    assert.deepEqual(result.payload, {
      id: 'review-1',
      author_id: 'author-1',
      target_id: 'profile-9',
      rating: 5,
      content: 'Excelente convivencia y comunicacion.',
      is_verified_stay: true,
    })
  }
})

test('bloquea la publicacion si no se confirma la convivencia', () => {
  const result = buildReviewInsertPayload({
    reviewId: 'review-1',
    authorId: 'author-1',
    reviewedProfileId: 'profile-9',
    rating: 4,
    content: 'Buena experiencia.',
    isVerifiedStay: false,
  })

  assert.deepEqual(result, {
    kind: 'error',
    reason: 'verification_required',
  })
})

test('asocia una resena de propiedad al perfil responsable correcto', () => {
  const publicationProfile = createPublicationProfile({
    id: 'profile-owner',
    name: 'Ana',
    avatar: 'https://example.com/ana.jpg',
    location: 'San Jose',
    is_verified: true,
    trust_score: 91,
  })

  const target = createPropertyReviewTarget(
    {
      id: 'property-7',
      title: 'Loft centrico',
      location: 'San Jose',
      owner_id: 'profile-owner',
      images: ['https://example.com/loft.jpg'],
    },
    publicationProfile
  )

  assert.equal(target.redirectPath, buildPropertyDetailPath('property-7'))
  assert.equal(target.publicationProfile.id, 'profile-owner')
  assert.equal(target.publicationProfile.redirectPath, buildProfileDetailPath('profile-owner'))
  assert.equal(target.publicationProfile.trustScore, 91)
})

test('mantiene la asociacion directa cuando la resena es para un perfil', () => {
  const target = createProfileReviewTarget({
    id: 'profile-2',
    name: 'Luis',
    avatar: null,
    location: null,
    is_verified: false,
    trust_score: 35,
  })

  assert.equal(target.id, 'profile-2')
  assert.equal(target.publicationProfile.id, 'profile-2')
  assert.equal(target.subtitle, 'Ubicacion no especificada')
  assert.equal(target.publicationProfile.trustScore, 35)
})

test('al leer reseñas solo devuelve comentarios del perfil solicitado', () => {
  const reviews = createProfileReviewList('profile-2', [
    {
      id: 'review-1',
      target_id: 'profile-2',
      rating: 5,
      content: 'Muy responsable.',
      is_verified_stay: true,
      created_at: '2026-05-04T19:00:00.000Z',
      author: {
        id: 'author-1',
        name: 'Maria',
        avatar: null,
        is_verified: true,
      },
    },
    {
      id: 'review-2',
      target_id: 'profile-3',
      rating: 2,
      content: 'No corresponde a este perfil.',
      is_verified_stay: true,
      created_at: '2026-05-04T20:00:00.000Z',
      author: {
        id: 'author-2',
        name: 'Carlos',
        avatar: null,
        is_verified: false,
      },
    },
  ])

  assert.equal(reviews.length, 1)
  assert.equal(reviews[0]?.profileId, 'profile-2')
  assert.equal(reviews[0]?.author.name, 'Maria')
  assert.equal(reviews[0]?.content, 'Muy responsable.')
})

test('normaliza el puntaje de confianza dentro del rango permitido', () => {
  assert.equal(normalizeTrustScore(-5), 0)
  assert.equal(normalizeTrustScore(55), 55)
  assert.equal(normalizeTrustScore(140), 100)
})

test('marca como destacado a un perfil con alta confianza', () => {
  const trustIndicator = createTrustIndicator(88)

  assert.equal(trustIndicator.score, 88)
  assert.equal(trustIndicator.label, 'Perfil destacado')
  assert.equal(trustIndicator.isHighlighted, true)
})

test('calcula un puntaje base neutral cuando aun no hay reseñas', () => {
  assert.equal(calculateTrustScoreFromReviews([]), 63)
})

test('evita extremos injustos cuando existe una sola reseña', () => {
  const topScore = calculateTrustScoreFromReviews([
    {
      rating: 5,
      is_verified_stay: true,
    },
  ])

  const lowScore = calculateTrustScoreFromReviews([
    {
      rating: 1,
      is_verified_stay: true,
    },
  ])

  assert.equal(topScore, 70)
  assert.equal(lowScore, 49)
})

test('da mas peso a una reseña verificada que a una no verificada', () => {
  const verifiedScore = calculateTrustScoreFromReviews([
    {
      rating: 5,
      is_verified_stay: true,
    },
  ])

  const unverifiedScore = calculateTrustScoreFromReviews([
    {
      rating: 5,
      is_verified_stay: false,
    },
  ])

  assert.equal(verifiedScore, 70)
  assert.equal(unverifiedScore, 69)
  assert.ok(verifiedScore > unverifiedScore)
})

test('actualiza el puntaje al agregar una nueva reseña positiva', () => {
  const currentReviews = [
    {
      rating: 4,
      is_verified_stay: true,
    },
    {
      rating: 4,
      is_verified_stay: false,
    },
  ]

  const updatedReviews = [
    ...currentReviews,
    {
      rating: 5,
      is_verified_stay: true,
    },
  ]

  const currentScore = calculateTrustScoreFromReviews(currentReviews)
  const updatedScore = calculateTrustScoreFromReviews(updatedReviews)

  assert.ok(updatedScore > currentScore)
})

test('actualiza el puntaje del perfil con el valor recalculado', () => {
  const trustScoreUpdate = buildProfileTrustScoreUpdate('profile-8', [
    {
      rating: 5,
      is_verified_stay: true,
    },
    {
      rating: 5,
      is_verified_stay: false,
    },
    {
      rating: 4,
      is_verified_stay: true,
    },
  ])

  assert.deepEqual(trustScoreUpdate, {
    profileId: 'profile-8',
    trustScore: 79,
  })
})
