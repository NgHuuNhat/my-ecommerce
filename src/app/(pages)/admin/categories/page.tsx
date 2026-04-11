import React from 'react'
import { DataTable } from './table'
// import data from "./data.json"

interface IProps {
    params: {},
    searchParams: {
        keyword?: string,
    },
}

export default async function CategoriesPage({ searchParams }: IProps) {
    const { keyword = '' } = await searchParams
    // console.log("-------------------keyword", keyword)

    const params = new URLSearchParams()
    if (keyword) params.set("keyword", keyword)

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
