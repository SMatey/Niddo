export interface Review {
  id: string
  authorId: string
  targetId: string
  rating: 1 | 2 | 3 | 4 | 5
  comment: string
  createdAt: string
}
