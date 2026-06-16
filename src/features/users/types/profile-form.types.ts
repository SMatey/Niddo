export interface ProfileFormValues {
  name: string
  age: number
  avatar?: string
  bio?: string
  location?: string
  budget_min?: number
  budget_max?: number
}

export interface EditableProfile {
  name: string
  age: number
  avatar: string
  bio: string
  location: string
  budget_min?: number
  budget_max?: number
}

export type StatusType = 'success' | 'error' | 'info'

export interface FormStatus {
  type: StatusType
  message: string
}
