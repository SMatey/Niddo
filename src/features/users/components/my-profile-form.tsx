'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { PROFILE_FORM } from '@/features/users/constants/profile-form.constants'
import { useMyProfile } from '@/features/users/hooks/use-my-profile'
import { createClient } from '@/lib/supabase/client'
import {
  profileFormSchema,
  toProfileFormDefaults,
  type ProfileFormSchemaValues,
} from '@/features/users/schemas/profile-form.schema'

type StatusType = 'success' | 'error' | 'info'

interface FormStatus {
  type: StatusType
  message: string
}

const PROFILE_CONTAINER_CLASS =
  'mx-auto w-full max-w-3xl rounded-xl border border-border bg-surface p-6 md:p-8'

const getInitialFromName = (nameCandidate?: string | null) => {
  const fallbackLetter = 'U'
  const normalizedName = nameCandidate?.trim()

  if (!normalizedName) {
    return fallbackLetter
  }

  return normalizedName.charAt(0).toUpperCase()
}

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error(PROFILE_FORM.UI.SAVE_ERROR))
    }

    reader.onerror = () => {
      reject(new Error(PROFILE_FORM.UI.SAVE_ERROR))
    }

    reader.readAsDataURL(file)
  })

export function MyProfileForm() {
  const { user, isInitialized } = useAuth()

  const fallbackName = useMemo(
    () => user?.user_metadata?.full_name ?? user?.email ?? '',
    [user?.email, user?.user_metadata?.full_name]
  )

  const { profile, isLoading, loadError, isSaving, saveError, saveProfile } = useMyProfile(
    user?.id ?? null,
    fallbackName
  )

  const [status, setStatus] = useState<FormStatus | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProfileFormSchemaValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: toProfileFormDefaults(),
  })

  useEffect(() => {
    if (!profile) {
      return
    }

    reset(toProfileFormDefaults(profile))
  }, [profile, reset])

  useEffect(() => {
    if (saveError) {
      setStatus({ type: 'error', message: PROFILE_FORM.UI.SAVE_ERROR })
    }
  }, [saveError])

  const avatarValue = watch('avatar')
  const nameValue = watch('name')

  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const onSelectAvatarFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      setStatus({ type: 'info', message: PROFILE_FORM.UI.FILE_CLEARED })
      return
    }

    if (!PROFILE_FORM.AVATAR.ACCEPTED_TYPES.includes(file.type as (typeof PROFILE_FORM.AVATAR.ACCEPTED_TYPES)[number])) {
      setStatus({ type: 'error', message: PROFILE_FORM.VALIDATION.FILE_TYPE })
      return
    }

    if (file.size > PROFILE_FORM.AVATAR.MAX_SIZE_BYTES) {
      setStatus({ type: 'error', message: PROFILE_FORM.VALIDATION.FILE_SIZE })
      return
    }

    try {
      const dataUrl = await fileToDataUrl(file)
      setValue('avatar', dataUrl, { shouldValidate: true, shouldDirty: true })
      setStatus({ type: 'info', message: PROFILE_FORM.UI.FILE_READY })
    } catch {
      setStatus({ type: 'error', message: PROFILE_FORM.UI.SAVE_ERROR })
    }
  }


  const onSubmit = async (values: ProfileFormSchemaValues) => {
    const didSave = await saveProfile(values)

    if (!didSave) {
      setStatus({ type: 'error', message: PROFILE_FORM.UI.SAVE_ERROR })
      return
    }

    setStatus({ type: 'success', message: PROFILE_FORM.UI.SAVE_SUCCESS })
  }

  const handleUploadSubmit = async () => {
    if (!user?.id) return setStatus({ type: 'error', message: PROFILE_FORM.ID_DOCUMENT.VALIDATION.AUTH_REQUIRED })
    if (!selectedFile) return setStatus({ type: 'error', message: PROFILE_FORM.ID_DOCUMENT.VALIDATION.NO_FILE })

    try {
      setUploading(true)
      setStatus(null)

      const result = await encryptFileAndUpload(selectedFile, user.id)

      const resp = await fetch('/api/id-doc/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ profileId: user.id, idDocumentPath: result.path, keyB64: result.key_b64, fileIvB64: result.file_iv_b64 }),
      })

      if (!resp.ok) {
        const text = await resp.text()
        throw new Error(text || 'Error saving metadata')
      }

      setStatus({ type: 'success', message: PROFILE_FORM.ID_DOCUMENT.UI.SUCCESS })
      setIsUploadOpen(false)
    } catch (err: any) {
      setStatus({ type: 'error', message: err?.message ?? 'Error al subir documento' })
    } finally {
      setUploading(false)
    }
  }

  if (!isInitialized || isLoading) {
    return (
      <section className={PROFILE_CONTAINER_CLASS}>
        <p className="text-sm text-text-secondary">{PROFILE_FORM.UI.LOADING}</p>
      </section>
    )
  }

  if (loadError && !profile) {
    return (
      <section className={PROFILE_CONTAINER_CLASS}>
        <p className="text-sm text-state-error">{PROFILE_FORM.UI.LOAD_ERROR}</p>
      </section>
    )
  }

  return (
    <section className={PROFILE_CONTAINER_CLASS}>
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-text-primary">{PROFILE_FORM.UI.TITLE}</h1>
        <p className="text-sm text-text-secondary">{PROFILE_FORM.UI.SUBTITLE}</p>
      </header>

      <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="rounded-lg border border-border p-4">
          <h2 className="text-base font-medium text-text-primary">{PROFILE_FORM.UI.AVATAR_TITLE}</h2>
          <p className="mt-1 text-sm text-text-secondary">{PROFILE_FORM.UI.AVATAR_HINT}</p>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="h-24 w-24 overflow-hidden rounded-full border border-border bg-surface-muted">
              {avatarValue ? (
                <img
                  src={avatarValue}
                  alt={PROFILE_FORM.UI.PREVIEW_ALT}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-text-muted">
                  {getInitialFromName(nameValue)}
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div className="space-y-2">
                <label htmlFor="profile-avatar-url" className="block text-sm font-medium text-text-primary">
                  {PROFILE_FORM.UI.LABEL_AVATAR_URL}
                </label>
                <Input
                  id="profile-avatar-url"
                  placeholder={PROFILE_FORM.UI.PLACEHOLDER_AVATAR_URL}
                  error={Boolean(errors.avatar)}
                  {...register('avatar')}
                />
                {errors.avatar ? <p className="text-sm text-state-error">{errors.avatar.message}</p> : null}
              </div>

              <div className="space-y-2">
                <label htmlFor="profile-avatar-upload" className="block text-sm font-medium text-text-primary">
                  {PROFILE_FORM.UI.LABEL_AVATAR_UPLOAD}
                </label>
                <Input
                  id="profile-avatar-upload"
                  type="file"
                  accept={PROFILE_FORM.AVATAR.ACCEPTED_TYPES.join(',')}
                  onChange={onSelectAvatarFile}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="profile-name" className="block text-sm font-medium text-text-primary">
              {PROFILE_FORM.UI.LABEL_NAME}
            </label>
            <Input
              id="profile-name"
              placeholder={PROFILE_FORM.UI.PLACEHOLDER_NAME}
              error={Boolean(errors.name)}
              {...register('name')}
            />
            {errors.name ? <p className="text-sm text-state-error">{errors.name.message}</p> : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="profile-age" className="block text-sm font-medium text-text-primary">
              {PROFILE_FORM.UI.LABEL_AGE}
            </label>
            <Input
              id="profile-age"
              type="number"
              min={PROFILE_FORM.AGE.MIN}
              max={PROFILE_FORM.AGE.MAX}
              placeholder={PROFILE_FORM.UI.PLACEHOLDER_AGE}
              error={Boolean(errors.age)}
              {...register('age')}
            />
            {errors.age ? <p className="text-sm text-state-error">{errors.age.message}</p> : null}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="profile-location" className="block text-sm font-medium text-text-primary">
            {PROFILE_FORM.UI.LABEL_LOCATION}
          </label>
          <Input
            id="profile-location"
            placeholder={PROFILE_FORM.UI.PLACEHOLDER_LOCATION}
            error={Boolean(errors.location)}
            {...register('location')}
          />
          {errors.location ? <p className="text-sm text-state-error">{errors.location.message}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="profile-bio" className="block text-sm font-medium text-text-primary">
            {PROFILE_FORM.UI.LABEL_BIO}
          </label>
          <textarea
            id="profile-bio"
            rows={PROFILE_FORM.BIO.TEXTAREA_ROWS}
            maxLength={PROFILE_FORM.BIO.MAX_LENGTH}
            className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1"
            placeholder={PROFILE_FORM.UI.PLACEHOLDER_BIO}
            {...register('bio')}
          />
          {errors.bio ? <p className="text-sm text-state-error">{errors.bio.message}</p> : null}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="profile-budget-min" className="block text-sm font-medium text-text-primary">
              {PROFILE_FORM.UI.LABEL_BUDGET_MIN}
            </label>
            <Input
              id="profile-budget-min"
              type="number"
              min={PROFILE_FORM.BUDGET.MIN}
              placeholder={PROFILE_FORM.UI.PLACEHOLDER_BUDGET_MIN}
              error={Boolean(errors.budget_min)}
              {...register('budget_min')}
            />
            {errors.budget_min ? <p className="text-sm text-state-error">{errors.budget_min.message}</p> : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="profile-budget-max" className="block text-sm font-medium text-text-primary">
              {PROFILE_FORM.UI.LABEL_BUDGET_MAX}
            </label>
            <Input
              id="profile-budget-max"
              type="number"
              min={PROFILE_FORM.BUDGET.MIN}
              placeholder={PROFILE_FORM.UI.PLACEHOLDER_BUDGET_MAX}
              error={Boolean(errors.budget_max)}
              {...register('budget_max')}
            />
            {errors.budget_max ? <p className="text-sm text-state-error">{errors.budget_max.message}</p> : null}
          </div>
        </div>

        {status ? (
          <p className={status.type === 'error' ? 'text-sm text-state-error' : 'text-sm text-state-success'}>
            {status.message}
          </p>
        ) : null}

        <div className="flex justify-end">
          <div className="flex items-center gap-3">
            <Button type="button" variant="secondary" onClick={onOpenUpload} disabled={isSaving}>
              {PROFILE_FORM.ID_DOCUMENT.UI.OPEN_BUTTON}
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? PROFILE_FORM.UI.SAVING : PROFILE_FORM.UI.SUBMIT}
            </Button>
          </div>
        </div>
      </form>
      {isUploadOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onCloseUpload}
        >
          <div
            className="w-full max-w-2xl rounded-4xl bg-surface border border-border shadow-2xl p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2v4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 8v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 12h6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">{PROFILE_FORM.ID_DOCUMENT.UI.MODAL_TITLE}</h3>
                  <p className="text-sm text-text-secondary">{PROFILE_FORM.ID_DOCUMENT.UI.PREVIEW_HINT}</p>
                </div>
              </div>
              <button
                onClick={onCloseUpload}
                className="text-sm font-medium text-text-muted hover:text-text-primary"
                aria-label="Cerrar modal"
              >
                {PROFILE_FORM.ID_DOCUMENT.UI.CLOSE}
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
              <div className="col-span-1 md:col-span-1">
                <label className="block text-sm font-medium text-text-primary mb-2">Seleccionar archivo</label>
                <div className="rounded-md border border-border bg-surface px-3 py-2">
                  <input
                    type="file"
                    accept={PROFILE_FORM.ID_DOCUMENT.ACCEPTED_TYPES.join(',')}
                    onChange={onSelectDocumentFile}
                    className="w-full text-sm text-text-primary"
                  />
                </div>

                <div className="mt-3 text-sm text-text-secondary">
                  {selectedFile ? selectedFile.name : <span className="text-text-muted">{PROFILE_FORM.ID_DOCUMENT.UI.PREVIEW_HINT}</span>}
                </div>
              </div>

              <div className="col-span-1 flex items-center justify-center">
                <div className="w-full max-w-md rounded-lg border border-border bg-white p-4 flex items-center justify-center">
                  {previewUrl ? (
                    <img src={previewUrl} alt="preview" className="max-h-64 object-contain" />
                  ) : selectedFile ? (
                    <div className="text-sm text-text-primary">{selectedFile.name}</div>
                  ) : (
                    <div className="text-sm text-text-muted">{PROFILE_FORM.ID_DOCUMENT.UI.PREVIEW_HINT}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={onCloseUpload} disabled={uploading}>{PROFILE_FORM.ID_DOCUMENT.UI.CANCEL}</Button>
              <Button type="button" onClick={handleUploadSubmit} disabled={uploading || !selectedFile}>
                {uploading ? PROFILE_FORM.ID_DOCUMENT.UI.UPLOADING : PROFILE_FORM.ID_DOCUMENT.UI.UPLOAD_BUTTON}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

    </section>
  )
}
