'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { cn } from '@/lib/utils'
import { PROPERTY_PUBLICATION_CONFIG, PROPERTY_PUBLICATION_LABELS } from '@/features/properties/constants/publication.constants'
import { publicationSchema, type PublicationFormValues } from '@/features/properties/schemas/publication.schema'
import { usePropertyPublication } from '@/features/properties/hooks/use-property-publication'
import { PropertyImageUploader } from '@/features/properties/components/property-image-uploader'
import { PropertyLocationPicker } from '@/features/properties/components/property-location-picker'
import { PropertyAmenitiesSelector } from '@/features/properties/components/property-amenities-selector'
import { createProperty, type CreatePropertyPayload } from '@/features/properties/actions/create-property'
import { updateProperty, type UpdatePropertyPayload } from '@/features/properties/actions/update-property'
import { PROPERTY_ACTIONS_MESSAGES } from '@/features/properties/constants/property-actions.constants'

export interface PropertyPublicationFormProps {
  initialData?: any; // The property data to edit
  propertyId?: string;
}

export function PropertyPublicationForm({ initialData, propertyId }: PropertyPublicationFormProps) {
  const router = useRouter()
  const isEditing = Boolean(initialData && propertyId);
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
    ruleInput,
    setRuleInput,
    toggleAmenity,
    addRule,
    removeRule,
    setAmenities,
    setRules,
    setSelectedImages,
  } = usePropertyPublication()

  // Pre-fill data if editing
  useEffect(() => {
    if (initialData) {
      if (initialData.latitude && initialData.longitude) {
        updateLocation({ lat: initialData.latitude, lng: initialData.longitude })
      }
      if (initialData.amenities) setAmenities(initialData.amenities)
      if (initialData.rules) setRules(initialData.rules)
      if (initialData.images) {
        const previewImages = initialData.images.map((url: string, index: number) => ({
          id: `existing-img-${index}-${Date.now()}`,
          previewUrl: url,
        }))
        setSelectedImages(previewImages)
      }
    }
  }, [initialData])

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PublicationFormValues>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      price: initialData?.price || undefined,
      location: initialData?.location || '',
      bedrooms: initialData?.bedrooms || null,
      bathrooms: initialData?.bathrooms || null,
      squareMeters: initialData?.area || null,
      availableFrom: initialData?.available_from || '',
      latitude: initialData?.latitude || null,
      longitude: initialData?.longitude || null,
      amenities: initialData?.amenities || [],
      rules: initialData?.rules || [],
    },
  })

  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSavingDraft, setIsSavingDraft] = useState(false)

  const availableFrom = watch('availableFrom')
  const priceValue = watch('price')

  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])

  // Format price input
  const formatPrice = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

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

  const handleAddRule = () => {
    addRule(ruleInput)
  }

  const handleSubmitForm : SubmitHandler<PublicationFormValues> = async (values: PublicationFormValues) => {
    setFormError(null)

    if (selectedImages.length === 0) {
      setFormError(PROPERTY_ACTIONS_MESSAGES.errors.noImages)
      return
    }

    if (!location) {
      setFormError(PROPERTY_PUBLICATION_LABELS.helpers.coordinatesMissing)
      return
    }

    if (amenities.length === 0) {
      setFormError(PROPERTY_ACTIONS_MESSAGES.errors.noAmenities)
      return
    }

    try {
      if (isEditing && propertyId) {
        const payload: UpdatePropertyPayload = {
          ...values,
          latitude: location.lat,
          longitude: location.lng,
          images: selectedImages.map(img => img.file || img.previewUrl), // Mixed files and existing URLs
          navigationUrl: `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`,
        }
        
        const result = await updateProperty(propertyId, payload)
        
        if (result.success) {
          setSubmitSuccess(true)
          setFormError(null)
          setTimeout(() => {
            setSubmitSuccess(false)
            router.push('/mis-publicaciones')
          }, 2000)
        } else {
          setFormError(result.error || "No se pudo actualizar la propiedad")
        }
      } else {
        const payload: CreatePropertyPayload = {
          ...values,
          latitude: location.lat,
          longitude: location.lng,
          images: selectedImages.map((image) => image.file as File),
          navigationUrl: `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`,
        }

        const result = await createProperty(payload)

        if (result.success) {
          setSubmitSuccess(true)
          setFormError(null)
          reset()
          clearImages()
          setTimeout(() => {
            setSubmitSuccess(false)
            router.push('/mis-publicaciones')
          }, 2000)
        } else {
          setFormError(result.error || PROPERTY_ACTIONS_MESSAGES.errors.unexpectedError)
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setFormError(PROPERTY_ACTIONS_MESSAGES.errors.unexpectedProcessing)
    }
  }

  const handleSaveDraft = async () => {
    setIsSavingDraft(true)
    try {
      const draftData = {
        timestamp: new Date().toISOString(),
        isEditing,
        propertyId,
        formData: {
          title: watch('title'),
          description: watch('description'),
          price: watch('price'),
          location: watch('location'),
          bedrooms: watch('bedrooms'),
          bathrooms: watch('bathrooms'),
          squareMeters: watch('squareMeters'),
          availableFrom: watch('availableFrom'),
          latitude: location?.lat,
          longitude: location?.lng,
          amenities,
          rules,
        },
        images: selectedImages.map(img => ({
          id: img.id,
          previewUrl: img.previewUrl,
          isNew: !!img.file
        }))
      }
      localStorage.setItem('propertyDraft', JSON.stringify(draftData))
      // Show success message temporarily
      const previousError = formError
      setFormError('Borrador guardado exitosamente')
      setTimeout(() => setFormError(previousError), 3000)
    } catch (error) {
      console.error('Error saving draft:', error)
      setFormError('No se pudo guardar el borrador')
    } finally {
      setIsSavingDraft(false)
    }
  }

  const handleExit = () => {
    router.push('/mis-publicaciones')
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-text-primary">{PROPERTY_PUBLICATION_LABELS.pageTitle}</h1>
          <p className="text-sm text-text-secondary">{PROPERTY_PUBLICATION_LABELS.pageSubtitle}</p>
        </div>
      </section>

      <form onSubmit={handleSubmit((data) => handleSubmitForm(data))} noValidate className="space-y-8">
        <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
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
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-primary font-medium">₡</span>
                  <Input
                    id="price"
                    placeholder={PROPERTY_PUBLICATION_LABELS.placeholders.price}
                    error={Boolean(errors.price)}
                    className="pl-8"
                    {...register('price', {
                      onChange: (e) => {
                        e.target.value = formatPrice(e.target.value)
                      },
                    })}
                  />
                </div>
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
        </section>

        <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
          <PropertyLocationPicker
            lat={location?.lat ?? null}
            lng={location?.lng ?? null}
            onLocationChange={updateLocation}
          />
        </section>

        <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">{PROPERTY_PUBLICATION_LABELS.sectionTitles.availability}</h2>
              <p className="text-sm text-text-secondary">{PROPERTY_PUBLICATION_LABELS.helpers.dateHint}</p>
            </div>
            <div className="max-w-xs">
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

          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">
                    {PROPERTY_PUBLICATION_LABELS.sectionTitles.amenities}
                  </h2>
                  <p className="text-sm text-text-secondary">{PROPERTY_PUBLICATION_LABELS.helpers.amenitiesDescription}</p>
                </div>
                <PropertyAmenitiesSelector selectedAmenities={amenities} onToggleAmenity={toggleAmenity} />
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">
                    {PROPERTY_PUBLICATION_LABELS.sectionTitles.houseRules}
                  </h2>
                  <p className="text-sm text-text-secondary">{PROPERTY_PUBLICATION_LABELS.helpers.houseRulesDescription}</p>
                </div>

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
                          className="text-text-secondary transition hover:text-state-error cursor-pointer"
                          onClick={() => removeRule(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-text-secondary">{PROPERTY_PUBLICATION_LABELS.helpers.rulesExample}</p>
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
                <p className="text-sm text-text-primary font-medium">{PROPERTY_PUBLICATION_LABELS.previewLabels.title}</p>
                <p>{watch('title') || PROPERTY_PUBLICATION_LABELS.placeholders.title}</p>
              </div>
              <div className="rounded-3xl border border-border bg-background p-4 text-sm text-text-secondary">
                <p className="text-sm text-text-primary font-medium">{PROPERTY_PUBLICATION_LABELS.previewLabels.approximatePrice}</p>
                <p>₡ {priceValue || PROPERTY_PUBLICATION_LABELS.placeholders.priceExample}/mes</p>
              </div>
              <div className="rounded-3xl border border-border bg-background p-4 text-sm text-text-secondary">
                <p className="text-sm text-text-primary font-medium">{PROPERTY_PUBLICATION_LABELS.previewLabels.location}</p>
                <p>{watch('location') || PROPERTY_PUBLICATION_LABELS.placeholders.location}</p>
              </div>
              <div className="rounded-3xl border border-border bg-background p-4 text-sm text-text-secondary">
                <p className="text-sm text-text-primary font-medium">{PROPERTY_PUBLICATION_LABELS.previewLabels.availabilityDate}</p>
                <p>
                  {availableFrom
                    ? availableFrom
                    : PROPERTY_PUBLICATION_LABELS.placeholders.location}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-background p-4 text-sm text-text-secondary">
              <h3 className="mb-3 text-sm font-semibold text-text-primary">{PROPERTY_PUBLICATION_LABELS.previewLabels.navigationLink}</h3>
              {location ? (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-primary transition hover:text-primary/80"
                >
                  {PROPERTY_PUBLICATION_LABELS.previewLabels.viewInGoogleMaps}
                </a>
              ) : (
                <p>{PROPERTY_PUBLICATION_LABELS.helpers.coordinatesMissing}</p>
              )}

              <div className="mt-6 rounded-2xl border border-border bg-surface p-4">
                <p className="text-sm font-medium text-text-primary">{PROPERTY_PUBLICATION_LABELS.previewLabels.activeRules}</p>
                {rules.length > 0 ? (
                  <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                    {rules.map((rule, index) => (
                      <li key={`${rule}-${index}`} className="list-disc pl-4">
                        {rule}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-text-secondary">{PROPERTY_PUBLICATION_LABELS.helpers.noRulesDefined}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {formError ? <div className="rounded-lg border border-state-error/30 bg-state-error/10 p-4 text-sm text-state-error">{formError}</div> : null}
        {submitSuccess ? (
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700">{PROPERTY_PUBLICATION_LABELS.messages.success}</div>
        ) : null}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button type="submit" disabled={isSubmitting} className="flex-1 py-3 text-base">
            {isSubmitting ? PROPERTY_PUBLICATION_LABELS.buttons.publishing : PROPERTY_PUBLICATION_LABELS.buttons.submit}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            disabled={isSavingDraft} 
            onClick={handleSaveDraft}
            className="flex-1 py-3 text-base cursor-pointer"
          >
            Guardar Borrador
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleExit}
            className="flex-1 py-3 text-base cursor-pointer"
          >
            Salir
          </Button>
        </div>
      </form>
    </div>
  )
}
