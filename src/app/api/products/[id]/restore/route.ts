import { getCategoryById, restoreCategory } from "@/app/features/categories/model"
import { NextRequest, NextResponse } from "next/server"

// PATCH /api/categories/[id]/restore (restore from trash)
export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params

        const existing = await getCategoryById(id)

        if (!existing) {
            return NextResponse.json(
                { success: false, message: "Category not found" },
                { status: 404 }
            )
        }

        if (!existing.deleted_at) {
            return NextResponse.json(
                { success: false, message: "Category is not deleted" },
                { status: 400 }
            )
        }

        await restoreCategory(id)

        return NextResponse.json({
            success: true,
            message: "Khôi phục thành công",
        })
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to restore category" },
            { status: 500 }
        )
    }
}
