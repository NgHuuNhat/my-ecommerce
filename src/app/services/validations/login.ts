import * as z from "zod"

export const formSchema = z.object({
    email: z
        .string()
        .min(1, "Vui lòng nhập email")
        .email("Email không hợp lệ"),

    password: z
        .string()
        .min(1, "Vui lòng nhập mật khẩu")
        .min(3, "Mật khẩu tối thiểu 3 ký tự"),
})