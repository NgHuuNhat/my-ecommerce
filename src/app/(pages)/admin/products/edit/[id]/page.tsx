'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import Link from 'next/link'
import Image from 'next/image'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import FormSubmitProduct, {
    ProductFormValues
} from '../../form-submit'

export default function EditProductPage() {

    const router = useRouter()

    const params = useParams()

    const id = params.id as string

    const [loading, setLoading] = useState(true)

    const [data, setData] =
        useState<ProductFormValues | null>(null)

    // 🔹 FETCH PRODUCT
    useEffect(() => {

        if (!id) return

        const fetchData = async () => {

            try {

                const res = await fetch(`/api/products/${id}`)

                const result = await res.json()

                if (!res.ok) {
                    toast.error(
                        result.error || 'Load failed'
                    )

                    return
                }

                // 🔥 map data cho form
                setData({
                    ...result.data,

                    category_id:
                        result.data.category_by?.id || '',

                    user_id:
                        result.data.created_by?.id || '',

                    images:
                        result.data.images || [],
                })

            } catch (err) {

                toast.error('Lỗi load product')

            } finally {

                setLoading(false)
            }
        }

        fetchData()

    }, [id])

    // 🔹 UPDATE PRODUCT
    const onSubmit = async (
        formData: ProductFormValues
    ) => {

        try {

            const res = await fetch(
                `/api/products/${id}`,
                {
                    method: 'PATCH',

                    headers: {
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify(formData),
                }
            )

            const result = await res.json()

            if (!res.ok) {

                toast.error(
                    result.error || 'Update thất bại'
                )

                return false
            }

            toast.success(
                result.message || 'Update thành công'
            )

            router.push('/admin/products')

            return true

        } catch (err) {

            toast.error('Có lỗi xảy ra')

            return false
        }
    }

    // 🔹 LOADING
    if (loading) {
        return (
            <div className="px-4 md:px-6">
                loading...
            </div>
        )
    }

    return (
        <div className="px-4 md:px-6">

            {/* HEADER */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <h1 className="text-2xl font-semibold">
                    Edit Product
                </h1>

                <Link href="/admin/products">
                    <Button>
                        ←
                    </Button>
                </Link>

            </div>

            {/* IMAGE PREVIEW */}
            {data?.images?.length && (

                <div className="mb-6 flex flex-wrap gap-3">

                    {data.images.map((url, index) => (

                        <img
                            key={index}
                            src={url}
                            alt=""
                            className="h-24 w-24 rounded-lg object-cover border"
                        />

                    ))}

                </div>
            )}

            {/* FORM */}
            {data && (
                <FormSubmitProduct
                    onSubmit={onSubmit}
                    data={data}
                />
            )}

        </div>
    )
}