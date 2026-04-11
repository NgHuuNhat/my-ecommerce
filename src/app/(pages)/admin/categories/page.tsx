import React from 'react'
import { DataTable } from './table'
// import data from "./data.json"

interface IProps {
    params: {},
    searchParams: {
        keyword?: string,
        sortField: string,
        sortOrder: string,
    },
}

export default async function CategoriesPage({ searchParams }: IProps) {
    const { keyword = '', sortField = 'created_at', sortOrder = 'desc' } = await searchParams
    console.log("-------------------searchParams", keyword, sortField, sortOrder)

    const params = new URLSearchParams()
    if (keyword) params.set("keyword", keyword)
    if (sortField) params.set("sortField", sortField)
    if (sortOrder) params.set("sortOrder", sortOrder)

    const baseUrl = process.env.NEXTAUTH_URL
    const res = await fetch(`${baseUrl}/api/categories?${params.toString()}`, {
        cache: "no-store", // luôn fresh data
    })

    const json = await res.json()
    const data = json.data

    return (
        <>
            <DataTable data={data || []} />
        </>
    )
}
