import React from 'react'
import { DataTable } from './data-table'
import data from "./data.json"

export default function categoriesPage() {
    return (
        <div className='categories-layout'>
            <DataTable data={data} />
        </div>
    )
}
