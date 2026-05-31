'use client'

import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { ShieldCheck, Upload } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { PROFILE_FORM } from '@/features/users/constants/profile-form.constants'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { createClient } from '@/lib/supabase/client'

type StatusType = 'success' | 'error' | 'info'

interface FormStatus {
  type: StatusType
  message: string
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

export function VerificationSection() {
  const { user } = useAuth()
  const [status, setStatus] = useState<FormStatus | null>(null)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const onOpenUpload = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setIsUploadOpen(true)
  }

  const onCloseUpload = () => {
    setIsUploadOpen(false)
  }

  const onSelectDocumentFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      setSelectedFile(null)
      setPreviewUrl(null)
      return
    }

    if (!PROFILE_FORM.ID_DOCUMENT.ACCEPTED_TYPES.includes(file.type as (typeof PROFILE_FORM.ID_DOCUMENT.ACCEPTED_TYPES)[number])) {
      setStatus({ type: 'error', message: PROFILE_FORM.ID_DOCUMENT.VALIDATION.FILE_TYPE })
      return
    }

    if (file.size > PROFILE_FORM.ID_DOCUMENT.MAX_SIZE_BYTES) {
      setStatus({ type: 'error', message: PROFILE_FORM.ID_DOCUMENT.VALIDATION.FILE_SIZE })
      return
    }

    setSelectedFile(file)

    if (file.type.startsWith('image/')) {
      try {
        const dataUrl = await fileToDataUrl(file)
        setPreviewUrl(dataUrl)
      } catch {
        setPreviewUrl(null)
      }
    } else {
      setPreviewUrl(null)
    }
  }

  async function encryptFileAndUpload(file: File, userId: string) {
    const subtle = window.crypto.subtle
    const key = await subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt'])
    const rawKey = await subtle.exportKey('raw', key)
    const rawKeyB64 = btoa(String.fromCharCode(...new Uint8Array(rawKey)))

    const iv = window.crypto.getRandomValues(new Uint8Array(12))
    const fileArrayBuffer = await file.arrayBuffer()
    const encryptedBuffer = await subtle.encrypt({ name: 'AES-GCM', iv }, key, fileArrayBuffer)

    const encryptedBlob = new Blob([encryptedBuffer], { type: file.type })

    const fileExt = 'enc'
    const fileName = `${userId}/${crypto.randomUUID()}.${fileExt}`

    const supabase = createClient()
    const { error: uploadError } = await supabase.storage.from('identity_documents').upload(fileName, encryptedBlob, { upsert: true })
    if (uploadError) throw uploadError

    return {
      path: fileName,
      key_b64: rawKeyB64,
      file_iv_b64: btoa(String.fromCharCode(...iv)),
    }
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

  return (
    <section className="mx-auto w-full max-w-3xl rounded-2xl border border-border bg-surface p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] md:p-8">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-text-primary">Verificacion de Identidad</h2>
        <p className="text-sm text-text-secondary">Verifica tu identidad para aumentar tu nivel de confianza</p>
      </header>

      <div className="mt-6 rounded-2xl border border-border bg-surface-muted/40 p-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-brand-50 p-2 text-brand-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-primary">Estado actual</h3>
            <p className="mt-1 text-sm text-text-secondary">Tu identidad ha sido verificada</p>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">Documentos aceptados</h3>
        <ul className="space-y-3 text-sm text-text-secondary">
          <li className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-brand-600 text-brand-600">✓</span>
            INE / IFE vigente
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-brand-600 text-brand-600">✓</span>
            Pasaporte mexicano vigente
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-brand-600 text-brand-600">✓</span>
            Licencia de conducir vigente
          </li>
        </ul>
      </div>

      {status ? (
        <p className={`mt-5 text-sm ${status.type === 'error' ? 'text-state-error' : 'text-state-success'}`}>
          {status.message}
        </p>
      ) : null}

      <div className="mt-8">
        <Button type="button" className="w-full gap-2 md:w-auto md:min-w-[220px]" onClick={onOpenUpload}>
          <Upload className="h-4 w-4" />
          {PROFILE_FORM.ID_DOCUMENT.UI.OPEN_BUTTON}
        </Button>
      </div>

      <p className="mt-6 text-sm text-text-secondary">
        Tu documento sera revisado en un plazo de 24-48 horas. La informacion se maneja de forma segura y confidencial.
      </p>

      {isUploadOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={onCloseUpload}
        >
          <div
            className="w-full max-w-2xl rounded-3xl border border-border bg-surface p-6 shadow-2xl md:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">{PROFILE_FORM.ID_DOCUMENT.UI.MODAL_TITLE}</h3>
                <p className="text-sm text-text-secondary">{PROFILE_FORM.ID_DOCUMENT.UI.PREVIEW_HINT}</p>
              </div>
              <button
                onClick={onCloseUpload}
                className="text-sm font-medium text-text-muted transition-colors hover:text-text-primary"
                aria-label="Cerrar modal"
              >
                {PROFILE_FORM.ID_DOCUMENT.UI.CLOSE}
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">Seleccionar archivo</label>
                <div className="rounded-md border border-border bg-surface px-3 py-2">
                  <input
                    type="file"
                    accept={PROFILE_FORM.ID_DOCUMENT.ACCEPTED_TYPES.join(',')}
                    onChange={onSelectDocumentFile}
                    className="w-full text-sm text-text-primary"
                  />
                </div>

                <div className="text-sm text-text-secondary">
                  {selectedFile ? selectedFile.name : <span className="text-text-muted">{PROFILE_FORM.ID_DOCUMENT.UI.PREVIEW_HINT}</span>}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="flex w-full max-w-md items-center justify-center rounded-2xl border border-border bg-white p-4">
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
              <Button type="button" variant="ghost" onClick={onCloseUpload} disabled={uploading}>
                {PROFILE_FORM.ID_DOCUMENT.UI.CANCEL}
              </Button>
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
