export interface CategoryType {
  id: string
  name: string
  name_lowercase?: string
  slug: string
  description: string
  deleted_at: string | null
  created_at: string
  updated_at: string
}