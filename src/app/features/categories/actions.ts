'use server'

import { createCategory } from "./model"

export async function createCategoryAction(_: any, formData: FormData) {
    try {
        const data = {
            name: formData.get('name')?.toString() || '',
            slug: formData.get('slug')?.toString() || '',
            description: formData.get('description')?.toString() || '',
        }

        if (!data.name) throw new Error('Name is required')
        if (!data.slug) throw new Error('Slug is required')
        if (!data.description) throw new Error('Description is required')

        // 🔥 GỌI MODEL Ở ĐÂY
        const docRef = await createCategory(data)

        return {
            ok: true,
            msg: `Created: ${docRef.name} // ${docRef.id}`,

        }
    } catch (err: any) {
        return {
            ok: false,
            msg: err.message,
        }

    }
}