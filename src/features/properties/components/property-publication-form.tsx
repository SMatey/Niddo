'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { cn } from '@/lib/utils'
import { PROPERTY_PUBLICATION_CONFIG, PROPERTY_PUBLICATION_LABELS, PROPERTY_PUBLICATION_SUGGESTIONS } from '@/features/properties/constants/publication.constants'
import { publicationSchema, type PublicationFormValues } from '@/features/properties/schemas/publication.schema'
import { usePropertyPublication } from '@/features/properties/hooks/use-property-publication'
import { PropertyImageUploader } from '@/features/properties/components/property-image-uploader'
import { PropertyLocationPicker } from '@/features/properties/components/property-location-picker'

export function PropertyPublicationForm() {
  const {
    selectedImages,
    imageError,
    addImages,
    removeImage,
    reorderImages,
    clearImages,
    location,
    updateLocation,
    amenities,
    rules,
    amenityInput,
    ruleInput,
    setAmenityInput,
    setRuleInput,
    addAmenity,
    removeAmenity,
    addRule,
    removeRule,
  } = usePropertyPublication()

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PublicationFormValues>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      title: '',
      description: '',
      price: '',
      location: '',
      bedrooms: null,
      bathrooms: null,
      squareMeters: null,
      availableFrom: '',
      availableTo: '',
      latitude: null,
      longitude: null,
      amenities: [],
      rules: [],
    },
  })

  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const availableFrom = watch('availableFrom')
  const availableTo = watch('availableTo')

  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const isExpired = Boolean(availableTo && availableTo < today)

  useEffect(() => {
    if (location) {
      setValue('latitude', location.lat)
      setValue('longitude', location.lng)
    }
  }, [location, setValue])

  useEffect(() => {
    setValue('amenities', amenities)
  }, [amenities, setValue])

  useEffect(() => {
    setValue('rules', rules)
  }, [rules, setValue])

  const handleAddAmenity = () => {
    addAmenity(amenityInput)
  }

  const handleAddRule = () => {
    addRule(ruleInput)
  }

  const handleSubmitForm = (values: PublicationFormValues) => {
    if (selectedImages.length === 0) {
      setFormError('Sube al menos una foto del inmueble antes de publicar.')
      return
    }

    if (isExpired) {
      setError('availableTo', {
        type: 'manual',
        message: PROPERTY_PUBLICATION_LABELS.helpers.expiredAvailability,
      })
      return
    }

    if (!location) {
      setFormError(PROPERTY_PUBLICATION_LABELS.helpers.coordinatesMissing)
      return
    }

    const payload = {
      ...values,
      latitude: location.lat,
      longitude: location.lng,
      images: selectedImages.map((image) => image.file),
      navigationUrl: `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`,
    }

    console.log('Publicación completa:', payload)
    setSubmitSuccess(true)
    setFormError(null)
    reset()
    clearImages()
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-text-primary">{PROPERTY_PUBLICATION_LABELS.pageTitle}</h1>
          <p className="text-sm text-text-secondary">{PROPERTY_PUBLICATION_LABELS.pageSubtitle}</p>
        </div>
      </section>

      <form onSubmit={handleSubmit(handleSubmitForm)} noValidate className="space-y-8">
        <section className="grid gap-6 rounded-3xl border border-border bg-surface p-6 shadow-sm lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-text-primary">
                  {PROPERTY_PUBLICATION_LABELS.labels.title}
                </label>
                <Input
                  id="title"
                  placeholder={PROPERTY_PUBLICATION_LABELS.placeholders.title}
                  error={Boolean(errors.title)}
                  {...register('title')}
                />
                {errors.title ? (
                  <p className="text-sm text-state-error">{errors.title.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium text-text-primary">
                  {PROPERTY_PUBLICATION_LABELS.labels.price}
                </label>
                <Input
                  id="price"
                  placeholder={PROPERTY_PUBLICATION_LABELS.placeholders.price}
                  error={Boolean(errors.price)}
                  {...register('price')}
                />
                {errors.price ? (
                  <p className="text-sm text-state-error">{errors.price.message}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium text-text-primary">
                {PROPERTY_PUBLICATION_LABELS.labels.location}
              </label>
              <Input
                id="location"
                placeholder={PROPERTY_PUBLICATION_LABELS.placeholders.location}
                error={Boolean(errors.location)}
                {...register('location')}
              />
              {errors.location ? (
                <p className="text-sm text-state-error">{errors.location.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-text-primary">
                {PROPERTY_PUBLICATION_LABELS.labels.description}
              </label>
              <textarea
                id="description"
                rows={5}
                className={cn(
                  'w-full rounded-md border bg-surface px-3 py-3 text-sm text-text-primary',
                  'placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  'transition-colors duration-200',
                  errors.description ? 'border-state-error focus-visible:ring-state-error' : 'border-border hover:border-border-focus'
                )}
                placeholder={PROPERTY_PUBLICATION_LABELS.placeholders.description}
                {...register('description')}
              />
              {errors.description ? (
                <p className="text-sm text-state-error">{errors.description.message}</p>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <label htmlFor="bedrooms" className="text-sm font-medium text-text-primary">
                  {PROPERTY_PUBLICATION_LABELS.labels.bedrooms}
                </label>
                <Input
                  id="bedrooms"
                  type="number"
                  min={0}
                  placeholder="2"
                  {...register('bedrooms', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="bathrooms" className="text-sm font-medium text-text-primary">
                  {PROPERTY_PUBLICATION_LABELS.labels.bathrooms}
                </label>
                <Input
                  id="bathrooms"
                  type="number"
                  min={0}
                  placeholder="1"
                  {...register('bathrooms', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="squareMeters" className="text-sm font-medium text-text-primary">
                  {PROPERTY_PUBLICATION_LABELS.labels.squareMeters}
                </label>
                <Input
                  id="squareMeters"
                  type="number"
                  min={0}
                  placeholder="65"
                  {...register('squareMeters', { valueAsNumber: true })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <PropertyLocationPicker
              lat={location?.lat ?? null}
              lng={location?.lng ?? null}
              onLocationChange={updateLocation}
            />

            <div className="rounded-3xl border border-border bg-background p-4">
              <p className="text-sm font-medium text-text-primary">{PROPERTY_PUBLICATION_LABELS.sectionTitles.availability}</p>
              <p className="mt-2 text-sm text-text-secondary">{PROPERTY_PUBLICATION_LABELS.helpers.dateHint}</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="availableFrom" className="text-sm font-medium text-text-primary">
                    {PROPERTY_PUBLICATION_LABELS.labels.availableFrom}
                  </label>
                  <Input
                    id="availableFrom"
                    type="date"
                    min={today}
                    error={Boolean(errors.availableFrom)}
                    {...register('availableFrom')}
                  />
                  {errors.availableFrom ? (
                    <p className="text-sm text-state-error">{errors.availableFrom.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <label htmlFor="availableTo" className="text-sm font-medium text-text-primary">
                    {PROPERTY_PUBLICATION_LABELS.labels.availableTo}
                  </label>
                  <Input
                    id="availableTo"
                    type="date"
                    min={availableFrom || today}
                    error={Boolean(errors.availableTo) || isExpired}
                    {...register('availableTo')}
                  />
                  {errors.availableTo ? (
                    <p className="text-sm text-state-error">{errors.availableTo.message}</p>
                  ) : isExpired ? (
                    <p className="text-sm text-state-error">{PROPERTY_PUBLICATION_LABELS.helpers.expiredAvailability}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <PropertyImageUploader
            images={selectedImages}
            onFilesSelected={addImages}
            onRemoveImage={removeImage}
            onReorderImage={reorderImages}
            error={imageError}
          />

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">
                    {PROPERTY_PUBLICATION_LABELS.sectionTitles.amenities}
                  </h2>
                  <p className="text-sm text-text-secondary">Describe lo que ofrece el inmueble.</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="amenity" className="text-sm font-medium text-text-primary">
                      {PROPERTY_PUBLICATION_LABELS.labels.amenityInput}
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="amenity"
                        value={amenityInput}
                        placeholder={PROPERTY_PUBLICATION_LABELS.placeholders.amenityInput}
                        onChange={(event) => setAmenityInput(event.target.value)}
                      />
                      <Button type="button" onClick={handleAddAmenity}>
                        {PROPERTY_PUBLICATION_LABELS.buttons.addAmenity}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="rule" className="text-sm font-medium text-text-primary">
                      {PROPERTY_PUBLICATION_LABELS.labels.ruleInput}
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="rule"
                        value={ruleInput}
                        placeholder={PROPERTY_PUBLICATION_LABELS.placeholders.ruleInput}
                        onChange={(event) => setRuleInput(event.target.value)}
                      />
                      <Button type="button" onClick={handleAddRule}>
                        {PROPERTY_PUBLICATION_LABELS.buttons.addRule}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {PROPERTY_PUBLICATION_SUGGESTIONS.amenities.map((amenity) => (
                      <button
                        key={amenity}
                        type="button"
                        className="rounded-full border border-border bg-background px-3 py-2 text-sm text-text-secondary transition hover:border-border-focus hover:text-text-primary"
                        onClick={() => addAmenity(amenity)}
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>

                  <div className="grid gap-2">
                    {amenities.length > 0 ? (
                      <div className="grid gap-2">
                        {amenities.map((amenity, index) => (
                          <div
                            key={`${amenity}-${index}`}
                            className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background px-4 py-3 text-sm"
                          >
                            <span>{amenity}</span>
                            <button
                              type="button"
                              className="text-text-secondary transition hover:text-text-primary"
                              onClick={() => removeAmenity(index)}
                            >
                              Eliminar
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-text-secondary">Añade amenidades para mejorar la visibilidad de tu publicación.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">
                    {PROPERTY_PUBLICATION_LABELS.sectionTitles.houseRules}
                  </h2>
                  <p className="text-sm text-text-secondary">Define las normas de convivencia del inmueble.</p>
                </div>

                <div className="grid gap-3">
                  {rules.length > 0 ? (
                    rules.map((rule, index) => (
                      <div
                        key={`${rule}-${index}`}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background px-4 py-3 text-sm"
                      >
                        <span>{rule}</span>
                        <button
                          type="button"
                          className="text-text-secondary transition hover:text-text-primary"
                          onClick={() => removeRule(index)}
                        >
                          Eliminar
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-text-secondary">Agrega reglas como no fumar, no fiestas o limpieza de mascotas.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-text-primary">{PROPERTY_PUBLICATION_LABELS.sectionTitles.preview}</h2>
              <div className="rounded-3xl border border-border bg-background p-4 text-sm text-text-secondary">
                <p className="text-sm text-text-primary font-medium">Título</p>
                <p>{watch('title') || 'Apartamento mediano 2 habitaciones'}</p>
              </div>
              <div className="rounded-3xl border border-border bg-background p-4 text-sm text-text-secondary">
                <p className="text-sm text-text-primary font-medium">Precio aproximado</p>
                <p>{watch('price') || '$850/mes'}</p>
              </div>
              <div className="rounded-3xl border border-border bg-background p-4 text-sm text-text-secondary">
                <p className="text-sm text-text-primary font-medium">Ubicación</p>
                <p>{watch('location') || 'San José, Costa Rica'}</p>
              </div>
              <div className="rounded-3xl border border-border bg-background p-4 text-sm text-text-secondary">
                <p className="text-sm text-text-primary font-medium">Fechas de disponibilidad</p>
                <p>
                  {availableFrom && availableTo && !isExpired
                    ? `${availableFrom} hasta ${availableTo}`
                    : 'Selecciona un rango válido para que esta publicación aparezca como disponible.'}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-background p-4 text-sm text-text-secondary">
              <h3 className="mb-3 text-sm font-semibold text-text-primary">Enlace de navegación</h3>
              {location ? (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-primary transition hover:text-primary/80"
                >
                  Ver en Google Maps
                </a>
              ) : (
                <p>{PROPERTY_PUBLICATION_LABELS.helpers.coordinatesMissing}</p>
              )}

              <div className="mt-6 rounded-2xl border border-border bg-surface p-4">
                <p className="text-sm font-medium text-text-primary">Normas activas</p>
                {rules.length > 0 ? (
                  <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                    {rules.map((rule, index) => (
                      <li key={`${rule}-${index}`} className="list-disc pl-4">
                        {rule}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-text-secondary">Aún no hay normas definidas.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {formError ? <p className="text-sm text-state-error">{formError}</p> : null}
        {submitSuccess ? (
          <p className="text-sm text-success">Publicación preparada correctamente. Revisa el panel cuando termines.</p>
        ) : null}

        <Button type="submit" className="w-full py-3 text-base">
          {PROPERTY_PUBLICATION_LABELS.buttons.submit}
        </Button>
      </form>
    </div>
  )
}
