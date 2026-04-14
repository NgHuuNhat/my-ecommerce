'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import FormSubmitCategory, { CategoryFormValues } from '../../form-submit'

export default function EditCategoryPage() {
    const router = useRouter()
    const params = useParams() // 👈 dùng cái này
    const id = params.id as string

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<CategoryFormValues | null>(null)

    useEffect(() => {
        if (!id) return

        const fetchData = async () => {
            try {
                const res = await fetch(`/api/categories/${id}`)
                const result = await res.json()

                // const text = await res.text() // 👈 đổi qua text trước
                // console.log("raw:", text)

                if (!res.ok) {
                    toast.error(result.message)
                    return
                }

                setData(result.data)
            } catch (err) {
                 console.error("ERROR:", err) // 👈 thêm cái này
                toast.error("Lỗi load data")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id]) // ✅ OK

    const onSubmit = async (formData: CategoryFormValues) => {
        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })

            const result = await res.json()

            if (!res.ok) {
                toast.error(result.message)
                return false
            }

            toast.success(result.message || "Update thành công")
            router.push("/admin/categories")
            return true
        } catch (err) {
            toast.error("Có lỗi xảy ra")
            return false
        }
    }

    if (loading) return <div>Loading...</div>

    return (
        <div className="px-4 md:px-6">
            <h6 className="mb-5">Edit Category</h6>

            {data && (
                <FormSubmitCategory
                    onSubmit={onSubmit}
                    data={data}
                />
            )}
        </div>
    )
}