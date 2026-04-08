'use client'

import { categorySchema } from '@/app/features/categories/validation'
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea
} from '@/components/ui/input-group'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import z from 'zod'
import { toast } from 'sonner'

export default function NewCategory() {
    const router = useRouter()

    const form = useForm<z.infer<typeof categorySchema>>({
        // resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            slug: "",
            description: ""
        }
    })

    // auto slug
    const slugify = (str: string) =>
        str
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")

    const nameValue = form.watch("name")

    useEffect(() => {
        form.setValue("slug", slugify(nameValue || ""))
    }, [nameValue])

    //   const onSubmit = async (data: z.infer<typeof categorySchema>) => {
    //     try {
    //       await fetch("/api/categories", {
    //         method: "POST",
    //         body: JSON.stringify(data)
    //       })

    //       router.refresh()
    //     } catch (err) {
    //       console.error(err)
    //     }
    //   }

    const onSubmit = async (data: z.infer<typeof categorySchema>) => {
        try {
            const res = await fetch("/api/categories", {
                method: "POST",
                body: JSON.stringify(data)
            })

            const result = await res.json()

            if (!res.ok) {
                toast.error(result.error) // 👈 show lỗi từ BE
                return
            }

            toast.success(result.message || "Tạo thành công")

            form.reset() // clear form
            router.refresh()
        } catch (err) {
            toast.error("Có lỗi xảy ra")
        }
    }

    return (
        <div className='new-categories-page px-4 md:px-6'>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <FieldGroup>

                    {/* NAME */}
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Name</FieldLabel>

                                <Input
                                    {...field}
                                    placeholder="Category name..."
                                    autoComplete="off"
                                    aria-invalid={fieldState.invalid}
                                />

                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    {/* SLUG */}
                    <Controller
                        name="slug"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Slug</FieldLabel>

                                <Input
                                    {...field}
                                    placeholder="category-slug"
                                    aria-invalid={fieldState.invalid}
                                />

                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    {/* DESCRIPTION */}
                    <Controller
                        name="description"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Description</FieldLabel>

                                <InputGroup>
                                    <InputGroupTextarea
                                        {...field}
                                        placeholder="Nhập description (HTML)..."
                                        rows={6}
                                        className="min-h-24 resize-none"
                                        aria-invalid={fieldState.invalid}
                                    />

                                    <InputGroupAddon align="block-end">
                                        <InputGroupText className="tabular-nums">
                                            {field.value?.length || 0}
                                        </InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>

                                <FieldDescription>
                                    Có thể nhập HTML (bold, link, ...)
                                </FieldDescription>

                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                </FieldGroup>

                {/* SUBMIT */}
                <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 rounded"
                >
                    Create Category
                </button>
            </form>
        </div>
    )
}