'use client'

import { useState, type ChangeEvent } from 'react'
import { ImagePlus, GripVertical, Trash2 } from 'lucide-react'
import type { PublicationFilePreview } from '@/features/properties/types/publication.types'
import { PROPERTY_PUBLICATION_CONFIG, PROPERTY_PUBLICATION_LABELS } from '@/features/properties/constants/publication.constants'

interface PropertyImageUploaderProps {
  images: PublicationFilePreview[]
  onFilesSelected: (files: FileList | null) => void
  onRemoveImage: (index: number) => void
  onReorderImage: (fromIndex: number, toIndex: number) => void
  error?: string | null
}

export function PropertyImageUploader({
  images,
  onFilesSelected,
  onRemoveImage,
  onReorderImage,
  error,
}: PropertyImageUploaderProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const handleFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFilesSelected(event.target.files)
    event.target.value = ''
  }

  const handleDragStart = (index: number) => {
    setDragIndex(index)
  }

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null)
      return
    }

    onReorderImage(dragIndex, index)
    setDragIndex(null)
  }

  return (
    <div className="rounded-3xl border border-border bg-surface p-4 shadow-sm">
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            {PROPERTY_PUBLICATION_LABELS.sectionTitles.photos}
          </h2>
          <p className="text-sm text-text-secondary">
            {PROPERTY_PUBLICATION_LABELS.labels.uploadInstructions}
          </p>
        </div>

        <label className="group flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-background px-4 py-6 text-center transition hover:border-border-focus hover:bg-surface-muted">
          <ImagePlus className="h-8 w-8 text-primary" aria-hidden="true" />
          <span className="text-sm font-medium text-text-primary">{PROPERTY_PUBLICATION_LABELS.labels.images}</span>
          <span className="text-sm text-text-secondary">{PROPERTY_PUBLICATION_LABELS.helpers.imageLimit}</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={handleFilesChange}
          />
        </label>

        {error ? <p className="text-sm text-state-error">{error}</p> : null}

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((image, index) => (
            <div
              key={image.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDrop(index)}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-sm transition hover:border-border-focus"
            >
              <div className="relative h-48 overflow-hidden bg-surface-muted">
                <img
                  src={image.previewUrl}
                  alt={`Foto ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute left-2 top-2 rounded-full bg-background/80 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-text-secondary">
                  {index + 1}
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-3 text-sm text-text-secondary">
                <span className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4" /> Arrastrar
                </span>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-destructive transition hover:bg-destructive/10"
                  onClick={(event) => {
                    event.preventDefault()
                    onRemoveImage(index)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  {PROPERTY_PUBLICATION_LABELS.buttons.removePhoto}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
