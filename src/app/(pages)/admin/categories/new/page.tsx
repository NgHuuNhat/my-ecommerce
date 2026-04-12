'use client'

import { categorySchema } from '@/app/features/categories/validation'

import { zodResolver } from '@hookform/resolvers/zod'
import {  useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import z from 'zod'
import { toast } from 'sonner'
import FormSubmitCategory, { CategoryFormValues } from '../form-submit'

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
            router.refresh()
            return true
        } catch (err) {
            toast.error("Có lỗi xảy ra")
            return false
        }
    }

    return (
        <div className='new-categories-page px-4 md:px-6'>
            <FormSubmitCategory onSubmit={onSubmit}/>
        </div>
    )
}