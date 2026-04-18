import { createUser, getUsers } from "@/app/features/users/model"
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
export const POST = async (req: Request) => {
  const data = await req.json()
  const user = await createUser(data)
  return NextResponse.json(user)
}