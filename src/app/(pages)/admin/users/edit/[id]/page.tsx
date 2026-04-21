'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import FormSubmitUser, { UserFormValues } from '../../form-submit'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function EditUserPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<UserFormValues | null>(null)

    useEffect(() => {
        if (!id) return

        const fetchData = async () => {
            try {
                const res = await fetch(`/api/users/${id}`)
                const result = await res.json()

                if (!res.ok) {
                    toast.error(result.message)
                    return
                }

                setData(result.data)
            } catch (err) {
                toast.error("Lỗi load data")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id])

    const onSubmit = async (formData: UserFormValues) => {
        try {
            const res = await fetch(`/api/users/${id}`, {
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
            router.push("/admin/users")
            return true
        } catch (err) {
            toast.error("Có lỗi xảy ra")
            return false
        }
    }

    if (loading) {
        return (
            <div className="px-4 md:px-6">
                loading...
            </div>
        )
    }

    return (
        <div className="px-4 md:px-6">
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <h6 className="mb-5">Edit User</h6>

                <Link href="/admin/users">
                    <Button>←</Button>
                </Link>
            </div>

            {data && (
                <FormSubmitUser
                    onSubmit={onSubmit}
                    data={data}
                />
            )}
        </div>
    )
}