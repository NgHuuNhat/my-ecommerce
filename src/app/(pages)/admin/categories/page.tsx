import React from 'react'
import { DataTable } from './table'
import data from "./data.json"
import { InputGroup, InputGroupAddon, InputGroupInput } from './search'
import { SearchIcon } from 'lucide-react'

export default function CategoriesPage() {
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
