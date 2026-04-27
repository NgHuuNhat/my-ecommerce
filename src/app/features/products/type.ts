import { CategoryType } from "../categories/type"
import { UserType } from "../users/type"

export interface ProductType {
  id: string
  name: string
  name_lowercase?: string
  slug: string
  description: string
  images?: string[]
  user_id: string
  category_id: string
  properties?: Array<{
    name: string
    color: string
    size: string
    price: number
    stock: number
  }>
  deleted_at: string | null
  created_at: string
  updated_at: string
  default_price?: number
}

export interface CreateProductType extends Omit<ProductType, "user_id" | "category_id"> {
  created_by: UserType
  category_by: CategoryType
}

export type ProductQuery = {
  keyword?: string
  sortField?: string
  sortOrder?: "asc" | "desc"
  deleted?: boolean
}