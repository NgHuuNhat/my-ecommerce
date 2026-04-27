'use client'

import { productSchema } from '@/app/features/products/validation'
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
import { useEffect, useState } from 'react'
import z from 'zod'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'

export type ProductFormValues = z.infer<typeof productSchema>

interface Category {
  id: string
  name: string
}

export interface FormSubmitProps {
  data?: ProductFormValues
  onSubmit: (data: ProductFormValues) => Promise<boolean>
}

export default function FormSubmitProduct({ data, onSubmit }: FormSubmitProps) {
  const isEdit = !!data

  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCate, setLoadingCate] = useState(true)
  const { data: session }: any = useSession()

  // 🔥 giả lập user (sau này lấy từ auth)
  const userId = session?.user?.id

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: data?.name || "",
      slug: data?.slug || "",
      description: data?.description || "",
      category_id: data?.category_id || "",
      user_id: data?.user_id || "",
    }
  })

  // 🔥 fetch category từ DB
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories')
        const json = await res.json()

        setCategories(json.data || [])
      } catch (err) {
        console.error('Fetch categories error:', err)
      } finally {
        setLoadingCate(false)
      }
    }

    fetchCategories()
  }, [])

  // 🔥 inject user_id
  useEffect(() => {
    form.setValue("user_id", userId)
  }, [userId])

  // 🔥 auto slug
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

  const handleOnSubmit = async (values: ProductFormValues) => {
    const payload = {
      ...values,
      user_id: userId,
    }

    const success = await onSubmit(payload)

    if (success) {
      form.reset()
    }
  }

  return (
    <div className='form-submit-product'>
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

                <Input {...field} placeholder="Product name..." />

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

                <Input {...field} placeholder="product-slug" />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* CATEGORY */}
          <Controller
            name="category_id"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Category</FieldLabel>

                <select
                  {...field}
                  disabled={loadingCate}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">
                    {loadingCate ? "Đang tải..." : "-- Chọn category --"}
                  </option>

                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

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
                    rows={6}
                    className="min-h-24 resize-none"
                  />

                  <InputGroupAddon align="block-end">
                    <InputGroupText>
                      {field.value?.length || 0}
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>

                <FieldDescription>
                  Mô tả sản phẩm
                </FieldDescription>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

        </FieldGroup>

        <Button type="submit">
          {isEdit ? "Update" : "Create"}
        </Button>
      </form>
    </div>
  )
}