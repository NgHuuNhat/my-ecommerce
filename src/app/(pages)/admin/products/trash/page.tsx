'use client'

import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { debounce } from 'lodash'
import { toast } from 'sonner'

import Link from 'next/link'

import { RotateCcw, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { Badge } from '@/components/ui/badge'

import { ProductType } from '@/app/features/products/type'
import { formatDate } from '@/app/features/products/format-date'

export default function TrashPage() {
    const [items, setItems] = useState<ProductType[]>([])
    const [loading, setLoading] = useState(true)
    const [keyword, setKeyword] = useState('')

    // 🔹 FETCH
    const fetchDeletedProducts = async (searchTerm = '') => {
        try {
            const queryString = searchTerm
                ? `?deleted=true&keyword=${encodeURIComponent(searchTerm)}`
                : '?deleted=true'

            const res = await fetch(`/api/products${queryString}`)

            const result = await res.json()

            if (!res.ok) {
                toast.error('Unable to load trash data')
                return
            }

            setItems(result.data || [])

        } catch (err) {
            toast.error('An error occurred')

        } finally {
            setLoading(false)
        }
    }

    // 🔹 DEBOUNCE SEARCH
    const debouncedFetch = useMemo(
        () => debounce((value: string) => fetchDeletedProducts(value), 300),
        []
    )

    const handleSearchChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value

            setKeyword(value)

            debouncedFetch(value)
        },
        [debouncedFetch]
    )

    useEffect(() => {
        fetchDeletedProducts()
    }, [])

    useEffect(() => {
        return () => {
            debouncedFetch.cancel()
        }
    }, [debouncedFetch])

    // 🔹 RESTORE
    const handleRestore = async (id: string, name: string) => {
        const confirmed = confirm(
            `Restore "${name}" ?`
        )

        if (!confirmed) return

        try {
            const res = await fetch(`/api/products/${id}/restore`, {
                method: 'PATCH',
            })

            const result = await res.json()

            if (!res.ok) {
                toast.error(result.error || 'Restore failed')
                return
            }

            toast.success(result.message)

            setItems(prev =>
                prev.filter(item => item.id !== id)
            )

        } catch (err) {
            toast.error('An error occurred')
        }
    }

    // 🔹 DELETE FOREVER
    const handlePermanentDelete = async (id: string, name: string) => {
        const confirmed = confirm(
            `Delete "${name}" forever?`
        )

        if (!confirmed) return

        try {
            const res = await fetch(`/api/products/${id}/force`, {
                method: 'DELETE',
            })

            const result = await res.json()

            if (!res.ok) {
                toast.error(result.error || 'Delete failed')
                return
            }

            toast.success(result.message)

            setItems(prev =>
                prev.filter(item => item.id !== id)
            )

        } catch (err) {
            toast.error('An error occurred')
        }
    }

    // 🔹 LOADING
    if (loading) {
        return (
            <div className="px-4 md:px-6">
                <h1 className="mb-5 text-2xl font-bold">
                    Product Trash
                </h1>

                <div>loading...</div>
            </div>
        )
    }

    return (
        <div className="table-page w-full flex-col justify-start gap-6 px-4 md:px-6">

            {/* HEADER */}
            <div className="mb-6 flex flex-col gap-4">

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Product Trash
                        </h1>

                        <p className="text-sm text-muted-foreground">
                            Manage deleted products
                        </p>
                    </div>

                    <Link href="/admin/products">
                        <Button>
                            ←
                        </Button>
                    </Link>
                </div>

                {/* SEARCH */}
                <div className="flex-1 max-w-sm">
                    <Input
                        value={keyword}
                        onChange={handleSearchChange}
                        placeholder="Search by name or ID..."
                    />
                </div>
            </div>

            {/* EMPTY */}
            {items.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                    <p className="text-muted-foreground">
                        Trash is empty
                    </p>
                </div>

            ) : (

                /* TABLE */
                <div className="overflow-hidden rounded-lg border">

                    <Table>

                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead>Name</TableHead>
                                {/* <TableHead>Price</TableHead> */}
                                <TableHead>Deleted At</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>

                            {items.map((item) => (

                                <TableRow key={item.id}>

                                    {/* ID */}
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className="px-1.5 text-muted-foreground"
                                        >
                                            {item.id}
                                        </Badge>
                                    </TableCell>

                                    {/* IMAGE */}
                                    <TableCell>
                                        {item.images?.[0] ? (
                                            <img
                                                src={item.images[0]}
                                                alt={item.name}
                                                className="h-14 w-14 rounded-md object-cover border"
                                            />
                                        ) : (
                                            <div className="h-14 w-14 rounded-md border flex items-center justify-center text-xs text-muted-foreground">
                                                No image
                                            </div>
                                        )}
                                    </TableCell>

                                    {/* NAME */}
                                    <TableCell className="font-medium">
                                        {item.name}
                                    </TableCell>

                                    {/* PRICE */}
                                    {/* <TableCell>
                                        <Badge variant="outline">
                                            ${item.price || 0}
                                        </Badge>
                                    </TableCell> */}

                                    {/* DELETED AT */}
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className="px-1.5 text-muted-foreground"
                                        >
                                            {formatDate(item.deleted_at)}
                                        </Badge>
                                    </TableCell>

                                    {/* ACTIONS */}
                                    <TableCell>
                                        <div className="flex gap-2">

                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    handleRestore(
                                                        item.id,
                                                        item.name
                                                    )
                                                }
                                                className='bg-green-100 hover:bg-green-200 text-green-700 hover:text-green-900'
                                            >
                                                <RotateCcw className="size-4" />

                                                <span className="hidden sm:inline">
                                                    Restore
                                                </span>
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() =>
                                                    handlePermanentDelete(
                                                        item.id,
                                                        item.name
                                                    )
                                                }
                                            >
                                                <Trash2 className="size-4" />

                                                <span className="hidden sm:inline">
                                                    Delete forever
                                                </span>
                                            </Button>

                                        </div>
                                    </TableCell>

                                </TableRow>
                            ))}

                        </TableBody>

                    </Table>

                </div>
            )}
        </div>
    )
}