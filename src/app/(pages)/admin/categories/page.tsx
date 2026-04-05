import { CategoryType, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<CategoryType[]> {
    // Fetch data from your API here.
    return [
        {
            id: "728ed52f",
            name: "test1",
            slug: "test-1",
            createdAt: "01/01/2001",
            updatedAt: "02/02/2002",
        },
        // ...
    ]
}

export default async function DemoPage() {
    const data = await getData()

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    )
}