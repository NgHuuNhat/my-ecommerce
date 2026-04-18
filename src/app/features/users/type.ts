//user type
export interface UserType {
  id: string
  email: string
  email_lowercase?: string
  password: string
  role: "admin" | "user"
  isActive: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

//create type
export interface CreateUserType {
  email: string
  password: string
  role?: "admin" | "user"
}

//search type + sort type
export type UserQuery = {
  keyword?: string
  sortField?: string
  sortOrder?: "asc" | "desc"
  deleted?: boolean
}

//search default type + sort default type
export const defaultUserQuery = (params: UserQuery = {}) => ({
  keyword: "",
  sortField: "created_at",
  sortOrder: "desc",
  deleted: false,
  ...params,
})