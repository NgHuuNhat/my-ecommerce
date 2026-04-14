'use client'

import { CreateAdminType } from "@/app/features/admin/type"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { FormLoginCustom } from "./form"

export default function Page() {
  const router = useRouter()

  const onLogin = async (data: CreateAdminType) => {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl: "/admin"
    })

    if (res?.error) {
      toast.error(res.error) // 👈 hiển thị đúng lỗi BE
      return
    }

    toast.success("Login thanh cong")
    router.push("/admin")
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <FormLoginCustom onLogin={onLogin} />
      </div>
    </div>
  )
}
