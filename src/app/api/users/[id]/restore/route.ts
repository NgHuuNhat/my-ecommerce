import {
  getManagerById,
  restoreManager,
} from "@/app/features/users/model"
import { NextRequest, NextResponse } from "next/server"

// PATCH /api/managers/[id]/restore
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const existing = await getManagerById(id)

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Manager not found" },
        { status: 404 }
      )
    }

    if (!existing.deleted_at) {
      return NextResponse.json(
        { success: false, message: "Manager is not deleted" },
        { status: 400 }
      )
    }

    await restoreManager(id)

    return NextResponse.json({
      success: true,
      message: "Khôi phục thành công",
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to restore manager" },
      { status: 500 }
    )
  }
}