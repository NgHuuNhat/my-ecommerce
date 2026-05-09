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

import { zodResolver } from '@hookform/resolvers/zod'

import { Controller, useForm } from 'react-hook-form'

import {
  useEffect,
  useMemo,
  useState
} from 'react'

import dynamic from 'next/dynamic'

// import 'react-quill/dist/quill.snow.css'
import 'react-quill-new/dist/quill.snow.css'

import z from 'zod'

import { Button } from '@/components/ui/button'

import { useSession } from 'next-auth/react'

import Upload from './upload'

// const ReactQuill = dynamic(
//   () => import('react-quill'),
//   { ssr: false }
// ) 
const ReactQuill = dynamic(
  () => import('react-quill-new'),
  { ssr: false }
)

export type ProductFormValues =
  z.infer<typeof productSchema>

interface Category {
  id: string
  name: string
}

export interface FormSubmitProps {
  data?: ProductFormValues

  onSubmit: (
    data: ProductFormValues
  ) => Promise<boolean>
}

export default function FormSubmitProduct({
  data,
  onSubmit
}: FormSubmitProps) {

  const isEdit = !!data

  const [categories, setCategories] =
    useState<Category[]>([])

  const [loadingCate, setLoadingCate] =
    useState(true)

  // chống spam submit
  const [loading, setLoading] =
    useState(false)

  const { data: session }: any =
    useSession()

  const userId = session?.user?.id

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),

    defaultValues: {
      name: data?.name || '',

      slug: data?.slug || '',

      description:
        data?.description || '',

      images:
        data?.images || [],

      category_id:
        data?.category_id || '',

      user_id:
        data?.user_id || '',
    }
  })

  // toolbar react quill
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [
          { list: 'ordered' },
          { list: 'bullet' }
        ],
        ['link'],
        ['clean'],
      ],
    }),
    []
  )

  // fetch categories
  useEffect(() => {

    const fetchCategories =
      async () => {

        try {

          const res = await fetch(
            '/api/categories'
          )

          const json =
            await res.json()

          setCategories(
            json.data || []
          )

        } catch (err) {

          console.error(
            'Fetch categories error:',
            err
          )

        } finally {

          setLoadingCate(false)
        }
      }

    fetchCategories()

  }, [])

  // inject user_id
  useEffect(() => {

    if (!userId) return

    form.setValue(
      'user_id',
      userId
    )

  }, [userId, form])

  // slugify
  const slugify = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

  const nameValue =
    form.watch('name')

  // auto slug
  useEffect(() => {

    form.setValue(
      'slug',
      slugify(nameValue || '')
    )

  }, [nameValue, form])

  // submit
  const handleOnSubmit = async (
    values: ProductFormValues
  ) => {

    console.log(
      'values',
      values
    )

    // chống spam create
    if (loading) return

    try {

      setLoading(true)

      const payload = {
        ...values,
        user_id: userId,
      }

      console.log(
        'payload',
        payload
      )

      const success =
        await onSubmit(payload)

      if (success) {

        form.reset({
          name: '',
          slug: '',
          description: '',
          images: [],
          category_id: '',
          user_id: userId,
        })
      }

    } catch (err) {

      console.error(err)

    } finally {

      setLoading(false)
    }
  }

  return (
    <div className='form-submit-product'>

      <form
        onSubmit={form.handleSubmit(
          handleOnSubmit
        )}
        className="space-y-6"
      >

        {/* upload */}
        <Upload form={form} />

        <FieldGroup>

          {/* NAME */}
          <Controller
            name="name"
            control={form.control}
            render={({
              field,
              fieldState
            }) => (
              <Field
                data-invalid={
                  fieldState.invalid
                }
              >
                <FieldLabel>
                  Name
                </FieldLabel>

                <Input
                  {...field}
                  disabled={loading}
                  placeholder="Product name..."
                />

                {fieldState.invalid && (
                  <FieldError
                    errors={[
                      fieldState.error
                    ]}
                  />
                )}
              </Field>
            )}
          />

          {/* SLUG */}
          <Controller
            name="slug"
            control={form.control}
            render={({
              field,
              fieldState
            }) => (
              <Field
                data-invalid={
                  fieldState.invalid
                }
              >
                <FieldLabel>
                  Slug
                </FieldLabel>

                <Input
                  {...field}
                  disabled={loading}
                  placeholder="product-slug"
                />

                {fieldState.invalid && (
                  <FieldError
                    errors={[
                      fieldState.error
                    ]}
                  />
                )}
              </Field>
            )}
          />

          {/* CATEGORY */}
          <Controller
            name="category_id"
            control={form.control}
            render={({
              field,
              fieldState
            }) => (
              <Field
                data-invalid={
                  fieldState.invalid
                }
              >
                <FieldLabel>
                  Category
                </FieldLabel>

                <select
                  {...field}
                  disabled={
                    loading ||
                    loadingCate
                  }
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">
                    {loadingCate
                      ? 'Đang tải...'
                      : '-- Chọn category --'}
                  </option>

                  {categories.map(c => (
                    <option
                      key={c.id}
                      value={c.id}
                    >
                      {c.name}
                    </option>
                  ))}
                </select>

                {fieldState.invalid && (
                  <FieldError
                    errors={[
                      fieldState.error
                    ]}
                  />
                )}
              </Field>
            )}
          />

          {/* DESCRIPTION */}
          <Controller
            name="description"
            control={form.control}
            render={({
              field,
              fieldState
            }) => (
              <Field
                data-invalid={
                  fieldState.invalid
                }
              >
                <FieldLabel>
                  Description
                </FieldLabel>

                <div className="space-y-2">

                  <ReactQuill
                    theme="snow"
                    value={field.value}
                    onChange={
                      field.onChange
                    }
                    modules={modules}
                    readOnly={loading}
                    className="bg-white"
                  />

                  <div className="text-sm text-muted-foreground text-right">
                    {field.value?.length ||
                      0}
                  </div>

                </div>

                <FieldDescription>
                  Mô tả sản phẩm
                </FieldDescription>

                {fieldState.invalid && (
                  <FieldError
                    errors={[
                      fieldState.error
                    ]}
                  />
                )}
              </Field>
            )}
          />

        </FieldGroup>

        {/* submit */}
        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Loading...'
            : isEdit
              ? 'Update'
              : 'Create'}
        </Button>

      </form>
    </div>
  )
}