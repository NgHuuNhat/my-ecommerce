import {
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/app/features/products/model"

import { NextRequest, NextResponse } from "next/server"

// 🔹 GET ONE PRODUCT
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const data = await getProductById(id)

    return NextResponse.json({
      data,
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 404 }
    )
  }
}

// 🔹 PATCH - UPDATE PRODUCT
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const body = await req.json()

    const result = await updateProduct(id, body)

    return NextResponse.json(result)

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}

// 🔹 DELETE - SOFT DELETE PRODUCT
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const result = await deleteProduct(id)

    return NextResponse.json(result)

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}