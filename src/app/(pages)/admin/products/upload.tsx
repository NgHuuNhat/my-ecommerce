'use client'

import React, { useRef, useState, useEffect } from 'react'
import { UploadCloud, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel
} from '@/components/ui/field'
import { Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'

interface ImageItem {
    file: File
    preview: string
    uploadedUrl?: string
}

interface UploadProps {
    form: any
}

const Upload = ({ form }: UploadProps) => {
    const [images, setImages] = useState<ImageItem[]>([])
    const inputRef = useRef<HTMLInputElement | null>(null)

    // cleanup preview memory
    useEffect(() => {
        return () => {
            images.forEach(img => {
                URL.revokeObjectURL(img.preview)
            })
        }
    }, [images])

    const handleChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = e.target.files

        if (!files || files.length === 0) return

        const newImages: ImageItem[] = Array.from(files).map(file => ({
            file,
            preview: URL.createObjectURL(file),
        }))

        // preview ngay
        setImages(prev => [...prev, ...newImages])

        // upload từng ảnh
        for (const img of newImages) {
            try {
                const formData = new FormData()

                formData.append('image', img.file)

                const res = await fetch('/api/products/upload', {
                    method: 'POST',
                    body: formData,
                })

                const data = await res.json()

                setImages(prev => {
                    const updated = prev.map(i =>
                        i.preview === img.preview
                            ? {
                                ...i,
                                uploadedUrl: data.url,
                            }
                            : i
                    )

                    // lấy tất cả url đã upload
                    const urls = updated
                        .filter(i => i.uploadedUrl)
                        .map(i => i.uploadedUrl as string)

                    // 🔥 tránh warning React
                    queueMicrotask(() => {
                        form.setValue(
                            'images',
                            urls,
                            {
                                shouldValidate: true,
                                shouldDirty: true,
                            }
                        )
                    })

                    return updated
                })

            } catch (err) {
                console.error('Upload failed:', err)
            }
        }

        // reset input
        e.target.value = ''
    }

    const handleRemove = (preview: string) => {
        const removed = images.find(
            img => img.preview === preview
        )

        if (removed) {
            URL.revokeObjectURL(removed.preview)
        }

        setImages(prev => {
            const updated = prev.filter(
                img => img.preview !== preview
            )

            const urls = updated
                .filter(i => i.uploadedUrl)
                .map(i => i.uploadedUrl as string)

            queueMicrotask(() => {
                form.setValue(
                    'images',
                    urls,
                    {
                        shouldValidate: true,
                        shouldDirty: true,
                    }
                )
            })

            return updated
        })

        if (inputRef.current) {
            inputRef.current.value = ''
        }
    }

    return (
        <div className="space-y-4 my-5">
            <div className="font-medium">
                Images
            </div>

            {/* upload zone */}
            <label className="cursor-pointer">
                <Card className="flex flex-col items-center justify-center border-dashed p-6 hover:bg-muted transition">
                    <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />

                    <p className="text-sm text-muted-foreground">
                        Click hoặc chọn nhiều ảnh
                    </p>

                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleChange}
                    />
                </Card>
            </label>

            {/* react-hook-form field */}
            <FieldGroup>
                <Controller
                    name="images"
                    control={form.control}
                    defaultValue={[]}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>
                                Images URL
                            </FieldLabel>

                            <Input
                                value={(field.value || []).join(', ')}
                                readOnly
                            />

                            {fieldState.invalid && (
                                <FieldError
                                    errors={[fieldState.error]}
                                />
                            )}
                        </Field>
                    )}
                />
            </FieldGroup>

            {/* preview */}
            {images.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    {images.map((img, index) => (
                        <div
                            key={index}
                            className="relative"
                        >
                            <img
                                src={img.preview}
                                alt="preview"
                                className="w-full h-32 object-cover rounded-xl border"
                            />

                            {/* uploading overlay */}
                            {!img.uploadedUrl && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs rounded-xl">
                                    Uploading...
                                </div>
                            )}

                            {/* remove button */}
                            <Button
                                type="button"
                                size="icon"
                                variant="destructive"
                                className="absolute -top-2 -right-2 rounded-full w-6 h-6"
                                onClick={() =>
                                    handleRemove(img.preview)
                                }
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Upload