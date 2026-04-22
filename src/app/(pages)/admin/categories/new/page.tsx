'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import FormSubmitCategory, { CategoryFormValues } from '../form-submit'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NewCategoryPage() {
    const router = useRouter()

    const onSubmit = async (data: CategoryFormValues) => {
        try {
            const res = await fetch("/api/categories", {
                method: "POST",
                body: JSON.stringify(data)
            })

            const result = await res.json()

            if (!res.ok) {
                toast.error(result.error) // 👈 show lỗi từ BE
                return false
            }

            toast.success(result.message || "Tạo thành công")
            router.push("/admin/categories") // 👉 quay về list
            router.refresh()
            return true
        } catch (err) {
            toast.error("Có lỗi xảy ra")
            return false
        }
    }

    return (
        <div className='new-categories-page px-4 md:px-6'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <h6 className="mb-5">Create Category</h6>
                <Link href="/admin/categories">
                    <Button>←</Button>
                </Link>
            </div>
            <FormSubmitCategory onSubmit={onSubmit} />
        </div>
    )
}