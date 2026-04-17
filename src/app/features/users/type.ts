export interface UserType {
  id: string
  email: string
  email_lowercase: string
  password: string
  role: "admin" | "user"
  isActive: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}