import { createUser, getUsers, checkEmailExists } from "@/app/features/users/model"
import { userSchema } from "@/app/features/users/validation"
import { NextRequest, NextResponse } from "next/server"

// ================= GET =================
export async function GET(req: NextRequest) {
  try {
    const keyword = req.nextUrl.searchParams.get("keyword") || ""
    const sortField = (req.nextUrl.searchParams.get("sortField") || "created_at") as any
    const sortOrder = (req.nextUrl.searchParams.get("sortOrder") as "asc" | "desc") || "desc"
    const deleted = req.nextUrl.searchParams.get("deleted") === "true"

    const data = await getUsers(keyword, sortField, sortOrder, deleted)

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

// ================= POST =================
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = userSchema.safeParse(body)

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors

      return NextResponse.json(
        {
          success: false,
          error: Object.values(errors)[0]?.[0],
        },
        { status: 400 }
      )
    }

    const data = result.data
    const email_lowercase = data.email.toLowerCase()

    // check email
    const isExist = await checkEmailExists(email_lowercase)

    if (isExist) {
      return NextResponse.json(
        { success: false, error: "Email đã tồn tại" },
        { status: 400 }
      )
    }

    const id = await createUser({
      email: data.email,
      email_lowercase,
      password: data.password,
      role: data.role,
      isActive: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    })

    return NextResponse.json({
      success: true,
      message: "Tạo user thành công",
      data: { id },
    })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    )
  }
}