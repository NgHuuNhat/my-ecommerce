import { z } from "zod"
import { de } from "zod/locales"

const propertySchema = z.object({
  name: z.string().min(1, "Tên thuộc tính không được để trống"),
  color: z.string().min(1, "Color không được để trống"),
  size: z.string().min(1, "Size không được để trống"),
  price: z
    .number({ message: "Price phải là số" })
    .min(0, "Price phải >= 0"),
  stock: z
    .number({ message: "Stock phải là số" })
    .int("Stock phải là số nguyên")
    .min(0, "Stock phải >= 0"),
})

export const productSchema = z.object({
  name: z
    .string()
    .min(2, "Name phải có ít nhất 2 ký tự")
    .max(150, "Name quá dài"),
  slug: z
    .string()
    .min(2, "Slug quá ngắn")
    .max(150, "Slug quá dài")
    .regex(/^[a-z0-9-]+$/, "Slug chỉ gồm chữ thường, số và dấu -"),
  description: z
    .string()
    .min(2, "Description phải ít nhất 2 ký tự"),
  // created_id: z.object({
  //   id: z.string().min(1, "User id không hợp lệ"),
  // }),
  // images: z
  //   .array(z.string().url("Image phải là URL hợp lệ"))
  //   .optional(),
  // category_id: z.array(z.string().min(1, "Category id không hợp lệ")),
  // properties: z.array(propertySchema).optional(),
  // default_price: z.number().optional(),
  user_id: z.string().min(1),
  category_id: z.string().min(1, "Category is required"),
})