import { z } from "zod"

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Name phải có ít nhất 2 ký tự")
    .max(100, "Name quá dài"),

  slug: z
    .string()
    // .min(2, "Slug quá ngắn")
    .max(100),
    // .regex(/^[a-z0-9-]+$/, "Slug chỉ gồm chữ thường, số và dấu -"),

  description: z
    .string()
    .min(2, "Description quá ngắn. Phải tối thiểu 2 ký tự.")
})