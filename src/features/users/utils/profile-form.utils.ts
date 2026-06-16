import { PROFILE_FORM } from '../constants/profile-form.constants'

export const getInitialFromName = (nameCandidate?: string | null): string => {
  const fallbackLetter = 'U'
  const normalizedName = nameCandidate?.trim()

  if (!normalizedName) {
    return fallbackLetter
  }

  return normalizedName.charAt(0).toUpperCase()
}

export const fileToDataUrl = (file: File): Promise<string> =>
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
