import { deleteCategory, deleteForever, getCategoryById, updateCategory } from "@/app/features/categories/model";
import { NextRequest, NextResponse } from "next/server";

// GET ONE /api/categories/:id (get one)
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params

        const data = await getCategoryById(id)

        if (!data) {
            return NextResponse.json(
                { message: "Category not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ data })
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch category" },
            { status: 500 }
        )
    }
}

// PATCH /api/categories/:id (edit one)
export async function PATCH(
    req: NextRequest,
    //   { params }: { params: { id: string } }
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const body = await req.json();
        // const { id } = params;

        const existing = await getCategoryById(id);

        if (!existing) {
            return NextResponse.json(
                { success: false, message: "Category not found" },
                { status: 404 }
            );
        }

        await updateCategory(id, body);

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to update category" },
            { status: 500 }
        );
    }
}

// DELETE /api/categories/:id (soft delete or permanent delete)
export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const forceDelete = req.headers.get('X-Force-Delete') === 'true'

        if (forceDelete) {
            // Permanent delete
            await deleteForever(id)
        } else {
            // Soft delete
            await deleteCategory(id)
        }

        return NextResponse.json({
            success: true,
            message: "Xoá thành công!"
        })
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to delete category" },
            { status: 500 }
        )
    }
}