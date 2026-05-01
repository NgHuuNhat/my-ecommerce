import { createUser, getUsers } from "@/app/features/users/model"
import { NextRequest, NextResponse } from "next/server"

// GET ALL USERS
export async function GET(req: NextRequest) {
  try {
    const data = await getUsers(
      Object.fromEntries(req.nextUrl.searchParams)
    )
    return NextResponse.json({ success: true, data })

  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

// POST - CREATE USER
export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json()
    const user = await createUser(data)
    return NextResponse.json(
      {
        message: "Tạo user thành công", 
        data: user,
      },
      { status: 201 }
    )

  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message || "Server error", 
      },
      { status: 400 } 
    )
  }
}