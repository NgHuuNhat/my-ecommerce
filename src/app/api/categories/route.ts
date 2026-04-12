import { createCategory, getCategories } from "@/app/features/categories/model";
import { categorySchema } from "@/app/features/categories/validation";
import { NextRequest } from "next/server";

// GET /api/categories
// export async function GET() {
//   try {
//     const data = await getCategories();

//     return Response.json({
//       success: true,
//       data,
//     });
//   } catch (error) {
//     return Response.json(
//       { success: false, message: "Failed to fetch categories" },
//       { status: 500 }
//     );
//   }
// }

export async function GET(req: NextRequest) {
  try {
    const keyword = req.nextUrl.searchParams.get("keyword") || ""
    const sortField = req.nextUrl.searchParams.get("sortField") || ""
    const sortOrderParam = req.nextUrl.searchParams.get("sortOrder")
    const sortOrder: "asc" | "desc" =
      sortOrderParam === "asc" || sortOrderParam === "desc"
        ? sortOrderParam
        : "desc" // default

    const data = await getCategories(keyword, sortField, sortOrder)

    return Response.json({
      success: true,
      data,
    })
  } catch (error) {
    // console.error("🔥 FIRESTORE ERROR:", error)
    // throw error
    return Response.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}

// // POST /api/categories
// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();

//     const { name, slug, description } = body;

//     // ✅ validate basic
//     if (!name || !slug) {
//       return Response.json(
//         { success: false, message: "Name and slug are required" },
//         { status: 400 }
//       );
//     }

//     const docRef = await createCategory({
//       name,
//       slug,
//       description: description || "",
//     });

//     return Response.json({
//       success: true,
//       data: {
//         id: docRef.id,
//       },
//     });
//   } catch (error) {
//     return Response.json(
//       { success: false, message: "Failed to create category" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = categorySchema.safeParse(body)

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      return Response.json(
        {
          error: Object.values(errors)[0]?.[0] || "Dữ liệu không hợp lệ"
        },
        { status: 400 }
      )
    }

    const data = result.data

    // check slug trùng
    const isExist = false // TODO: check DB
    if (isExist) {
      return Response.json(
        { error: "Slug đã tồn tại" },
        { status: 400 }
      )
    }

    // TODO: save DB
    const docRef = await createCategory(data);

    return Response.json({
      message: "Tạo category thành công",
      success: true,
      data: {
        id: docRef.id,
      },
    })
  } catch (error) {
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}