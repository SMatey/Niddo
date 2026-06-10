import type { UserItem } from '../types/domain.types'

export interface UserListItem extends UserItem {
  matchScore?: number
}