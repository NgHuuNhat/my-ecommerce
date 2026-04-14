import { deleteCategory, getCategoryById, updateCategory } from "@/app/features/categories/model";
import { NextRequest } from "next/server";

// GET ONE /api/categories/:id
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const data = await getCategoryById(id)

    if (!data) {
      return Response.json(
        { message: "Category not found" },
        { status: 404 }
      )
    }

    return Response.json({ data })
  } catch (error) {
    return Response.json(
      { message: "Failed to fetch category" },
      { status: 500 }
    )
  }
}

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