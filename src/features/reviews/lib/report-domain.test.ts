import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildReviewReportDuplicateFilter,
  buildReviewReportInsertPayload,
  createReviewReportModerationStatus,
  hasReachedReportAutoHideThreshold,
  buildReviewReportSubject,
} from './report-domain.ts'

const reviewTarget = {
  id: 'property-1',
  type: 'property' as const,
  title: 'Apartamento luminoso',
  subtitle: 'San Jose',
  imageUrl: null,
  verified: false,
  redirectPath: '/propiedad/property-1',
  publicationProfile: {
    id: 'profile-10',
    name: 'Carla',
    imageUrl: null,
    verified: true,
    trustScore: 84,
    redirectPath: '/usuario/profile-10',
  },
}

test('construye el sujeto del reporte enlazando propiedad y perfil responsable', () => {
  const subject = buildReviewReportSubject({
    target: reviewTarget,
  })

  assert.deepEqual(subject, {
    targetType: 'property',
    targetId: 'property-1',
    targetLabel: 'Apartamento luminoso',
    reportedProfileId: 'profile-10',
    reportedPropertyId: 'property-1',
    relatedReviewId: null,
  })
})

test('construye el payload del reporte con descripcion normalizada', () => {
  const subject = buildReviewReportSubject({
    target: reviewTarget,
  })

  const payload = buildReviewReportInsertPayload({
    reportId: 'report-1',
    reporterId: 'reporter-8',
    subject,
    reason: 'fake_review',
    description: '  Esta resena parece inventada y contradictoria.  ',
  })

  assert.deepEqual(payload, {
    id: 'report-1',
    reporter_id: 'reporter-8',
    report_target_type: 'property',
    report_reason_type: 'fake_review',
    reported_profile_id: 'profile-10',
    reported_property_id: 'property-1',
    related_review_id: null,
    description: 'Esta resena parece inventada y contradictoria.',
  })
})

test('construye el filtro para evitar reportes duplicados del mismo caso', () => {
  const subject = buildReviewReportSubject({
    target: reviewTarget,
  })

  const filter = buildReviewReportDuplicateFilter({
    reporterId: 'reporter-8',
    subject,
    reason: 'suspicious_behavior',
  })

  assert.deepEqual(filter, {
    reporterId: 'reporter-8',
    reportTargetType: 'property',
    reportReasonType: 'suspicious_behavior',
    reportedProfileId: 'profile-10',
    reportedPropertyId: 'property-1',
    relatedReviewId: null,
  })
})

test('oculta automaticamente el contenido cuando alcanza el umbral configurado', () => {
  assert.equal(hasReachedReportAutoHideThreshold(3, 3), true)
  assert.equal(hasReachedReportAutoHideThreshold(2, 3), false)
})

test('normaliza el estado de moderacion devuelto por la base de datos', () => {
  const moderationStatus = createReviewReportModerationStatus({
    report_count: '4',
    auto_hide_threshold: '3',
    is_hidden: true,
  })

  assert.deepEqual(moderationStatus, {
    reportCount: 4,
    autoHideThreshold: 3,
    isHidden: true,
  })
})

test('usa el umbral de respaldo cuando la consulta no devuelve valores numericos', () => {
  const moderationStatus = createReviewReportModerationStatus({
    report_count: null,
    auto_hide_threshold: null,
    is_hidden: null,
  })

  assert.deepEqual(moderationStatus, {
    reportCount: 0,
    autoHideThreshold: 3,
    isHidden: false,
  })
})
