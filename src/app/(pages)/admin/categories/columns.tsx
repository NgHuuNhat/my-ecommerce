"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { PenLine, Trash2 } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CategoryType = {
    id: string
    name: string
    slug: string
    createdAt: string
    updatedAt: string
}

export const columns: ColumnDef<CategoryType>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "slug",
        header: "Slug",
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
    },
    {
        accessorKey: "updatedAt",
        header: "Updated At",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const category = row.original

            return (
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            console.log("Edit", category.id)
                        }}
                        className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 hover:text-yellow-700 transition-colors cursor-pointer"
                    >
                        Edit <PenLine />
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={() => {
                            console.log("Delete", category.id)
                        }}
                        className="cursor-pointer"
                    >
                        Delete <Trash2 />
                    </Button>
                </div>
            )
        },
    }
]