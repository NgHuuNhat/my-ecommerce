'use client'

import { getSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { FormLoginCustom } from "./form"
import { CreateUserType } from "@/app/features/users/type"
import { LoginType } from "@/app/features/login/type"

export default function Page() {
  const router = useRouter()

  const onLogin = async (data: LoginType) => {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (res?.error) {
      toast.error(res.error) // 👈 hiển thị đúng lỗi BE
      return
    }

    toast.success("Login thanh cong")

    // lấy session để check role
    const session = await getSession()
    const role = (session?.user as any)?.role

    // redirect theo role
    if (role === "admin") {
      router.push("/admin")
    } else {
      router.push("/")
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <FormLoginCustom onLogin={onLogin} />
      </div>
    </div>
  )
}
