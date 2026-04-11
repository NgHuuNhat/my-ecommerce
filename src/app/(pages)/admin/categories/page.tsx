import React from 'react'
import { DataTable } from './table'
// import data from "./data.json"

export default async function CategoriesPage() {
    const baseUrl = process.env.NEXTAUTH_URL
    const res = await fetch(`${baseUrl}/api/categories`, {
        cache: "no-store", // luôn fresh data
    })

    const json = await res.json()
    const data = json.data

    return (
        <>
            <DataTable data={data} />
        </>
    )
}
