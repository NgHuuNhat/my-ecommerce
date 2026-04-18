'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import FormSubmitUser, { UserFormValues } from '../form-submit'

export default function NewUserPage() {
  const router = useRouter()

  const onSubmit = async (data: UserFormValues) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(data),
      })

      const result = await res.json()

      // ❌ lỗi từ BE
      if (!res.ok) {
        toast.error(result.error) // 👈 chỉ lấy từ BE
        return false
      }
      // ✅ success
      toast.success(result.message) // 👈 chỉ lấy từ BE

      router.push("/admin/users") // 👉 quay về list
      router.refresh()
      return true

    } catch (err) {
      // ❗ lỗi network (BE không trả về)
      toast.error("Network error")
      return false
    }
  }

  return (
    <div className="new-users-page px-4 md:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h6 className="mb-5">Create User</h6>

        <Link href="/admin/users">
          <Button>←</Button>
        </Link>
      </div>

      <FormSubmitUser onSubmit={onSubmit} />
    </div>
  )
}