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
// export const POST = async (req: Request) => {
//   const data = await req.json()
//   const user = await createUser(data)
//   return NextResponse.json(user)
// }

// import { NextResponse } from "next/server"
// import { createUser } from "@/app/features/users/model"

// export const POST = async (req: Request) => {
//   try {
//     const data = await req.json()

//     const user = await createUser(data)

//     return NextResponse.json({
//       message: "Tạo user thành công", // 👈 BE quyết định message
//       data: user,
//     })
//   } catch (err: any) {
//     return NextResponse.json(
//       {
//         error: err.message, // 👈 BE quyết định luôn message lỗi
//       },
//       {
//         status: 400, // 👈 cực kỳ quan trọng
//       }
//     )
//   }
// }

// import { NextResponse } from "next/server"
// import { createUser } from "@/app/features/users/model"

export const POST = async (req: Request) => {
  try {
    const data = await req.json()

    const user = await createUser(data)

    return NextResponse.json(
      {
        message: "Tạo user thành công", // 👈 BE giữ message
        data: user,
      },
      { status: 201 }
    )
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message || "Server error", // 👈 BE giữ luôn lỗi
      },
      { status: 400 } // 👈 để FE biết là lỗi
    )
  }
}