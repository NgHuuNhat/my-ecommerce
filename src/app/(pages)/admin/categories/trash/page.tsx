'use client'

import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { debounce } from 'lodash'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { RotateCcw, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/app/features/categories/format-date'

interface DeletedCategory {
    id: string
    name: string
    slug: string
    description: string
    created_at: string
    updated_at: string
    deleted_at: string
}

export default function TrashPage() {
    const [items, setItems] = useState<DeletedCategory[]>([])
    const [loading, setLoading] = useState(true)
    const [keyword, setKeyword] = useState('')

    const fetchDeletedCategories = async (searchTerm = '') => {
        try {
            const queryString = searchTerm ? `?deleted=true&keyword=${encodeURIComponent(searchTerm)}` : '?deleted=true'
            const res = await fetch(`/api/categories${queryString}`)
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

    const debouncedFetch = useMemo(
        () => debounce((value: string) => fetchDeletedCategories(value), 200),
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
        fetchDeletedCategories()
    }, [])

    useEffect(() => {
        return () => {
            debouncedFetch.cancel()
        }
    }, [debouncedFetch])

    const handleRestore = async (id: string, name: string) => {
        const confirmRestore = confirm(`Are you sure you want to restore "${name}"?`)
        if (!confirmRestore) return

        try {
            const res = await fetch(`/api/categories/${id}/restore`, {
                method: 'PATCH',
            })

            const result = await res.json()

            if (!res.ok) {
                toast.error(result.message || 'Restore failed')
                return
            }

            toast.success('Restored successfully')
            setItems(items.filter(item => item.id !== id))
        } catch (err) {
            toast.error('An error occurred')
        }
    }

    const handlePermanentDelete = async (id: string, name: string) => {
        const confirmDelete = confirm(
            `Are you sure you want to permanently delete "${name}"? This cannot be undone.`
        )
        if (!confirmDelete) return

        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: 'DELETE',
                headers: { 'X-Force-Delete': 'true' },
            })

            const result = await res.json()

            if (!res.ok) {
                toast.error(result.message || 'Delete failed')
                return
            }

            toast.success('Permanently deleted successfully')
            setItems(items.filter(item => item.id !== id))
        } catch (err) {
            toast.error('An error occurred')
        }
    }

    if (loading) {
        return (
            <div className="px-4 md:px-6">
                <h1 className="mb-5 text-2xl font-bold">Trash</h1>
                <div>Loading...</div>
            </div>
        )
    }

    return (
        <div className="table-page w-full flex-col justify-start gap-6 px-4 md:px-6">
            <div className="mb-6 flex flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Trash</h1>
                        <p className="text-sm text-muted-foreground">Manage soft-deleted categories and restore or permanently delete items.</p>
                    </div>
                    {/* <Link href="/admin/categories">
                        <Button variant="outline">← Back</Button>
                    </Link> */}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1 max-w-sm">
                        <Input
                            value={keyword}
                            onChange={handleSearchChange}
                            placeholder="Search by Name, Slug or ID..."
                        />
                    </div>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                    <p className="text-muted-foreground">Trash is empty</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-lg border">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Deleted At</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <Badge variant="outline" className="px-1.5 text-muted-foreground">
                                            {item.id}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="px-1.5 text-muted-foreground">
                                            {item.slug}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate text-sm">
                                        <Badge variant="outline" className="px-1.5 text-muted-foreground">
                                            {item.description || '-'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="px-1.5 text-muted-foreground">
                                            {formatDate(item.deleted_at)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="bg-green-50 text-green-700 hover:bg-green-100"
                                                onClick={() => handleRestore(item.id, item.name)}
                                            >
                                                <RotateCcw className="size-4" />
                                                <span className="hidden sm:inline">Restore</span>
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() =>
                                                    handlePermanentDelete(item.id, item.name)
                                                }
                                            >
                                                <Trash2 className="size-4" />
                                                <span className="hidden sm:inline">Delete</span>
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

