import { createProduct, getProducts } from "@/app/features/products/model"
import { NextRequest, NextResponse } from "next/server"

// GET ALL PRODUCTS
export async function GET(req: NextRequest) {
  try {
    const data = await getProducts(
      Object.fromEntries(req.nextUrl.searchParams)
    )

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (e) {
    console.error(e)

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    )
  }
}

// CREATE PRODUCT
export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json()

    const product = await createProduct(data)

    return NextResponse.json(
      {
        data: product,
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