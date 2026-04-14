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
import { useEffect } from 'react'
import z from 'zod'
import { Button } from '@/components/ui/button'
import { CategoryType } from '@/app/features/categories/type'

export type CategoryFormValues = z.infer<typeof categorySchema>

export interface FormSubmitProps {
    data?: CategoryFormValues,
    onSubmit: (data: CategoryFormValues) => Promise<boolean>,
}

export default function FormSubmitCategory({ data, onSubmit }: FormSubmitProps) {
    const isEdit = !!data
    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: data?.name || "",
            slug: data?.slug || "",
            description: data?.description || "",
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
        form.setValue("description", slugify(nameValue || ""))
    }, [nameValue])

    const handleOnSubmit = async (values: CategoryFormValues) => {
        const success = await onSubmit(values)
        if (success) {
            form.reset() // ✅ chỉ clear khi thành công
        }
    }

    return (
        <div className='form-submit-category'>
            <form
                onSubmit={form.handleSubmit(handleOnSubmit)}
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
                {/* <Button
                    type="submit"
                    className='cursor-pointer'
                >
                    Submit
                </Button> */}
                <Button
                    type="submit"
                    className={`cursor-pointer ${isEdit
                        ? "bg-yellow-200 hover:bg-yellow-300 text-yellow-700 hover:text-yellow-900"
                        : "bg-blue-200 hover:bg-blue-300 text-blue-700 hover:text-blue-900"
                        }`}
                >
                    {isEdit ? "Update" : "Create"}
                </Button>
            </form>
        </div>
    )
}