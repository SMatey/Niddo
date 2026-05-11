'use client'

import { useCallback, useEffect, useState } from 'react'
import type { PublicationFilePreview, PublicationLocation } from '@/features/properties/types/publication.types'
import { PROPERTY_PUBLICATION_CONFIG } from '@/features/properties/constants/publication.constants'

export function usePropertyPublication() {
  const [selectedImages, setSelectedImages] = useState<PublicationFilePreview[]>([])
  const [location, setLocation] = useState<PublicationLocation | null>(null)
  const [amenities, setAmenities] = useState<string[]>([])
  const [rules, setRules] = useState<string[]>([])
  const [amenityInput, setAmenityInput] = useState('')
  const [ruleInput, setRuleInput] = useState('')
  const [imageError, setImageError] = useState<string | null>(null)

  const clearImages = useCallback(() => {
    setSelectedImages((current) => {
      current.forEach((image) => URL.revokeObjectURL(image.previewUrl))
      return []
    })
  }, [])

  useEffect(() => {
    return () => {
      clearImages()
    }
  }, [clearImages])

  const addImages = useCallback((files: FileList | null) => {
    if (!files) {
      return
    }

    const newFiles = Array.from(files).filter((file) => file.type.startsWith('image/'))
    const availableSlots = PROPERTY_PUBLICATION_CONFIG.maxImages - selectedImages.length
    const allowedFiles = newFiles.slice(0, availableSlots)

    if (allowedFiles.length < newFiles.length) {
      setImageError(`Solo puedes subir hasta ${PROPERTY_PUBLICATION_CONFIG.maxImages} fotos.`)
    } else {
      setImageError(null)
    }

    const previews = allowedFiles.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }))

    setSelectedImages((current) => [...current, ...previews])
  }, [selectedImages.length])

  const removeImage = useCallback((index: number) => {
    setSelectedImages((current) => {
      const image = current[index]
      if (!image) {
        return current
      }

      URL.revokeObjectURL(image.previewUrl)
      return current.filter((_, imageIndex) => imageIndex !== index)
    })
  }, [])

  const reorderImages = useCallback((fromIndex: number, toIndex: number) => {
    setSelectedImages((current) => {
      if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= current.length || toIndex >= current.length) {
        return current
      }

      const updated = [...current]
      const [movedImage] = updated.splice(fromIndex, 1)
      updated.splice(toIndex, 0, movedImage)
      return updated
    })
  }, [])

  const updateLocation = useCallback((next: PublicationLocation) => {
    setLocation(next)
  }, [])

  const addAmenity = useCallback((value: string) => {
    const trimmed = value.trim()
    if (!trimmed || amenities.includes(trimmed) || amenities.length >= PROPERTY_PUBLICATION_CONFIG.maxAmenities) {
      return
    }
    setAmenities((current) => [...current, trimmed])
    setAmenityInput('')
  }, [amenities])

  const toggleAmenity = useCallback((value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return

    setAmenities((current) => {
      if (current.includes(trimmed)) {
        return current.filter((a) => a !== trimmed)
      } else if (current.length < PROPERTY_PUBLICATION_CONFIG.maxAmenities) {
        return [...current, trimmed]
      }
      return current
    })
  }, [])

  const removeAmenity = useCallback((index: number) => {
    setAmenities((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }, [])

  const addRule = useCallback((value: string) => {
    const trimmed = value.trim()
    if (!trimmed || rules.includes(trimmed) || rules.length >= PROPERTY_PUBLICATION_CONFIG.maxRules) {
      return
    }
    setRules((current) => [...current, trimmed])
    setRuleInput('')
  }, [rules])

  const removeRule = useCallback((index: number) => {
    setRules((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }, [])

  return {
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
    toggleAmenity,
    removeAmenity,
    addRule,
    removeRule,
    setAmenities,
    setRules,
    setSelectedImages,
  }
}
