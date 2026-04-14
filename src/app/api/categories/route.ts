import { createCategory, getCategories } from "@/app/features/categories/model"
import { categorySchema } from "@/app/features/categories/validation"
import { NextRequest, NextResponse } from "next/server"

// GET ALL
export async function GET(req: NextRequest) {
  try {
    const keyword = req.nextUrl.searchParams.get("keyword") || ""
    const sortField = req.nextUrl.searchParams.get("sortField") || ""
    const sortOrderParam = req.nextUrl.searchParams.get("sortOrder")
    const deleted = req.nextUrl.searchParams.get("deleted") === "true"
    const sortOrder: "asc" | "desc" =
      sortOrderParam === "asc" || sortOrderParam === "desc"
        ? sortOrderParam
        : "desc"

    // Get deleted categories if deleted=true
    if (deleted) {
      const data = await getCategories(keyword, "deleted_at", "desc", true)
      return NextResponse.json({
        success: true,
        data,
      })
    }

    const data = await getCategories(keyword, sortField || "created_at", sortOrder)

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}

// POST - CREATE NEW
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = categorySchema.safeParse(body)

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      return NextResponse.json(
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
      return NextResponse.json(
        { error: "Slug đã tồn tại" },
        { status: 400 }
      )
    }

    // TODO: save DB
    const docRef = await createCategory(data);

    return NextResponse.json({
      message: "Tạo category thành công",
      success: true,
      data: {
        id: docRef.id,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}