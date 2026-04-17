import {
  deleteUser,
  getUserById,
  updateUser,
} from "@/app/features/users/model"
import { userSchema } from "@/app/features/users/validation"
import { NextRequest, NextResponse } from "next/server"

// ================= GET DETAIL =================
// GET ONE /api/users/:id
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const data = await getUserById(id)

    if (!data) {
      return NextResponse.json(
        { message: "User không tồn tại" },
        { status: 404 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("GET USER ERROR:", error)

    return NextResponse.json(
      { message: "Failed to fetch user" },
      { status: 500 }
    )
  }
}

// ================= UPDATE =================
export async function PUT(req: Request, { params }: { params: { id: string } }) {
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

    await updateUser(params.id, {
      email: data.email,
      email_lowercase: data.email.toLowerCase(),
      password: data.password,
      role: data.role,
      updated_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: "Cập nhật user thành công",
    })
  } catch {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    )
  }
}

// ================= DELETE =================
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await deleteUser(params.id)

  return NextResponse.json({
    success: true,
    message: "Đã xoá user",
  })
}