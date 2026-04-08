import React from 'react'
import { DataTable } from './table'
// import data from "./data.json"
import { InputGroup, InputGroupAddon, InputGroupInput } from './search'
import { SearchIcon } from 'lucide-react'

export default async function CategoriesPage() {
    const res = await fetch("http://localhost:3000/api/categories", {
        cache: "no-store", // luôn fresh data
    })

    const json = await res.json()
    const data = json.data

    return (
        <>
            <div className='search px-4 lg:px-6'>
                <InputGroup>
                    <InputGroupInput placeholder="Search..." />
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                </InputGroup>
            </div>

            <DataTable data={data} />
        </>
    )
}
