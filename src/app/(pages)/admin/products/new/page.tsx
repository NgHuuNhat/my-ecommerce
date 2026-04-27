'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
// import FormSubmitProduct, { ProductFormValues } from '../form-submit'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import FormSubmitProduct, { ProductFormValues } from '../form-submit'

export default function NewProductPage() {
    const router = useRouter()

    const onSubmit = async (data: ProductFormValues) => {
        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })

            const result = await res.json()

            // ❌ chỉ show lỗi từ BE
            if (!res.ok) {
                if (result?.error) {
                    toast.error(result.error)
                }
                return false
            }

            // ✅ success cũng lấy từ BE nếu có
            if (result?.message) {
                toast.success(result.message)
            }

            router.push("/admin/products")
            router.refresh()
            return true

        } catch (err) {
            // ❌ không custom message
            return false
        }
    }

    return (
        <div className='new-products-page px-4 md:px-6'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <h6 className="mb-5">Create Product</h6>
                <Link href="/admin/products">
                    <Button>←</Button>
                </Link>
            </div>

            <FormSubmitProduct onSubmit={onSubmit} />
        </div>
    )
}