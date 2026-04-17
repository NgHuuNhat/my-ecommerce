'use client'

import { userSchema } from '@/app/features/users/validation'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { z } from 'zod'

export type UserFormValues = z.infer<typeof userSchema>

export interface FormSubmitUserProps {
  data?: UserFormValues
  onSubmit: (data: UserFormValues) => Promise<boolean>
}

export default function FormSubmitUser({ data, onSubmit }: FormSubmitUserProps) {
  const isEdit = !!data

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: data?.email || "",
      password: "",
      role: data?.role || "user",
    }
  })

  // ✅ FIX QUAN TRỌNG: update khi data change
  useEffect(() => {
    if (data) {
      form.reset({
        email: data.email,
        password: "",
        role: data.role,
      })
    }
  }, [data, form])

  const handleOnSubmit = async (values: UserFormValues) => {
    const success = await onSubmit(values)
    if (success) {
      form.reset()
    }
  }

  return (
    <div className='form-submit-user'>
      <form
        onSubmit={form.handleSubmit(handleOnSubmit)}
        className="space-y-6 max-w-md"
      >
        <FieldGroup>

          {/* EMAIL */}
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Email</FieldLabel>

                <Input
                  {...field}
                  placeholder="Enter email..."
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* PASSWORD */}
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Password</FieldLabel>

                <Input
                  type="password"
                  {...field}
                  placeholder="Enter password..."
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* ROLE */}
          <Controller
            name="role"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Role</FieldLabel>

                <select
                  {...field}
                  className="w-full border px-2 py-2 rounded"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

        </FieldGroup>

        {/* SUBMIT */}
        <Button
          type="submit"
          className={`cursor-pointer ${
            isEdit
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