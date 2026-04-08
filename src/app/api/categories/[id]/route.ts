import { deleteCategory, getCategoryById, updateCategory } from "@/app/features/categories/model";
import { NextRequest } from "next/server";

// PATCH /api/categories/:id
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
            return Response.json(
                { success: false, message: "Category not found" },
                { status: 404 }
            );
        }

        await updateCategory(id, body);

        return Response.json({
            success: true,
        });
    } catch (error) {
        return Response.json(
            { success: false, message: "Failed to update category" },
            { status: 500 }
        );
    }
}

// DELETE /api/categories/:id (soft delete)
export async function DELETE(
    req: NextRequest,
    //   { params }: { params: { id: string } }
    context: { params: Promise<{ id: string }> }

) {
    try {
        // const { id } = params;
        const { id } = await context.params


        await deleteCategory(id);

        return Response.json({
            success: true,
        });
    } catch (error) {
        return Response.json(
            { success: false, message: "Failed to delete category" },
            { status: 500 }
        );
    }
}