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
