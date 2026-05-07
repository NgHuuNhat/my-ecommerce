import { deleteProductForever } from "@/app/features/products/model"
import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
 context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const result = await deleteProductForever(id)

    return NextResponse.json(result)

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}