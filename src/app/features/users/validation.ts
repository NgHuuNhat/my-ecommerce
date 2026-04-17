import { z } from "zod"

export const userSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(3, "Mật khẩu tối thiểu 3 ký tự"),
  role: z.enum(["admin", "user"]),
})

export type CreateUserInput = z.infer<typeof userSchema>

export const updateUserSchema = z.object({
  email: z.string().email("Email không hợp lệ").optional(),
  password: z.string().min(3).optional(),
  role: z.enum(["admin", "manager"]).optional(),
  isActive: z.boolean().optional(),
})