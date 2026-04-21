import { getUserById, updateUser } from "@/app/features/users/model"
import { NextRequest, NextResponse } from "next/server"

// GET ONE USER
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const data = await getUserById(id)

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

// PUT - UPDATE USER
export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const body = await req.json()
        const result = await updateUser(id, body)
        return NextResponse.json(result)

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 400 }
        )
    }
}