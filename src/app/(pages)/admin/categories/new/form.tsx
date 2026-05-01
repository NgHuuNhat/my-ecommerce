// 'use client'

// import { useActionState } from 'react'
// import { createCategoryAction } from '@/app/features/categories/actions'

// // shadcn
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import { Button } from '@/components/ui/button'
// import { Label } from '@/components/ui/label'

// export default function Form() {
//     const [state, action] = useActionState(createCategoryAction, null)

//     return (
//         <form action={action} className="space-y-5 max-w-md">

//             {/* NAME */}
//             <div className="space-y-1">
//                 <Label>Name</Label>
//                 <Input name="name" placeholder="Category name..." required />
//             </div>

//             {/* SLUG */}
//             <div className="space-y-1">
//                 <Label>Slug</Label>
//                 <Input name="slug" placeholder="category-slug" required />
//             </div>

//             {/* DESCRIPTION */}
//             <div className="space-y-1">
//                 <Label>Description</Label>
//                 <Textarea
//                     name="description"
//                     placeholder="Nhập mô tả..."
//                     className="min-h-[100px]"
//                     required
//                 />
//             </div>

//             {/* BUTTON */}
//             <Button type="submit" className="bg-blue-200 hover:bg-blue-300 text-blue-700 hover:text-blue-900 cursor-pointer">
//                 Create Category
//             </Button>

//             {/* MESSAGE */}
//             {state?.msg && (
//                 <p className={state.ok ? 'text-green-600' : 'text-red-600'}>
//                     {state.msg}
//                 </p>
//             )}
//         </form>
//     )
// }

'use client'

import { useActionState, useEffect, useState } from 'react'
import { createCategoryAction } from '@/app/features/categories/actions'

// shadcn
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

export default function Form() {
    // state action
    const [state, action] = useActionState(createCategoryAction, null)

    // handle form state để auto gen slug và description
    const [name, setName] = useState('')
    const [slug, setSlug] = useState('')
    const [description, setDescription] = useState('')

    const handleNameChange = (value: string) => {
        setName(value)

        const slugValue = toSlug(value)
        setSlug(slugValue)

        setDescription(value)
    }

    // router để redirect sau khi tạo xong
    const router = useRouter()

    useEffect(() => {
        if (state?.ok) {
            router.push('/admin/categories')
        }
    }, [state])

    return (
        <form action={action} className="space-y-5 max-w-md">

            {/* NAME */}
            <div className="space-y-1">
                <Label>Name</Label>
                <Input
                    name="name"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Category name..."
                    required
                />
            </div>

            {/* SLUG */}
            <div className="space-y-1">
                <Label>Slug</Label>
                <Input
                    name="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)} // vẫn cho sửa tay
                    required
                />
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-1">
                <Label>Description</Label>
                <Textarea
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[100px]"
                    required
                />
            </div>

            <Button type="submit" className="bg-blue-200 hover:bg-blue-300 text-blue-700 hover:text-blue-900 cursor-pointer">
                Create
            </Button>

            {state?.msg && (
                <p className={state.ok ? 'text-green-600' : 'text-red-600'}>
                    {state.msg}
                </p>
            )}
        </form>
    )
}

// 🔥 đặt dưới component hoặc file utils
const toSlug = (str: string) => {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
}