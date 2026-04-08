import { createCategory, getCategories } from "@/app/features/categories/model";
import { NextRequest } from "next/server";

// GET /api/categories
export async function GET() {
  try {
    const data = await getCategories();

    return Response.json({
      success: true,
      data,
    });
  } catch (error) {
    return Response.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST /api/categories
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, slug, description } = body;

    // ✅ validate basic
    if (!name || !slug) {
      return Response.json(
        { success: false, message: "Name and slug are required" },
        { status: 400 }
      );
    }

    const docRef = await createCategory({
      name,
      slug,
      description: description || "",
    });

    return Response.json({
      success: true,
      data: {
        id: docRef.id,
      },
    });
  } catch (error) {
    return Response.json(
      { success: false, message: "Failed to create category" },
      { status: 500 }
    );
  }
}