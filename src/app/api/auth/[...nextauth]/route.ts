import { findAdminByEmail, isEmailExists } from "@/app/features/admin/model"
import { comparePassword } from "@/app/features/login/password"
import { formSchema } from "@/app/features/login/validation"
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const loginAdmin = async (email: string, password: string) => {
    // 1. Kiểm tra sự tồn tại của email
    const emailExists = await isEmailExists(email)
    if (!emailExists) {
        throw new Error("Email không tồn tại")
    }

    // 2. Lấy thông tin admin
    const admin = await findAdminByEmail(email)

    // 3. Kiểm tra password
    const isMatch = await comparePassword(password, admin.password)
    if (!isMatch) {
        throw new Error("Mật khẩu không đúng")
    }

    // 4. Trả về data sạch cho NextAuth
    return {
        id: admin.id.toString(),
        email: admin.email,
        // name: admin.email.split('@')[0], // Optional: lấy prefix email làm tên
    }
}

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt", // BẮT BUỘC có dòng này để Middleware getToken hoạt động
        maxAge: 30 * 24 * 60 * 60, // 30 ngày
    },
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                console.log("credentials", credentials)

                // Validate đầu vào sơ bộ
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Vui lòng nhập đầy đủ thông tin")
                }

                // Parse bằng Zod schema
                const parsed = formSchema.safeParse(credentials)
                if (!parsed.success) {
                    throw new Error(parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ")
                }

                try {
                    // Gọi hàm bóc tách
                    const user = await loginAdmin(parsed.data.email, parsed.data.password)
                    return user
                } catch (error: any) {
                    // Bắn lỗi từ loginAdmin ra ngoài giao diện
                    throw new Error(error.message)
                }
            }

        })
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) token.id = user.id
            return token
        },
        async session({ session, token }: any) {
            if (session.user) session.user.id = token.id as string
            return session
        }
    },

    pages: {
        signIn: '/login', // Chỉ định trang login custom của bạn
    },
}

const authHandler = NextAuth(authOptions)

export { authHandler as GET, authHandler as POST }