import { deleteUser, getUserById, restoreUser, updateUser } from "@/app/features/users/model"
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

// PATCH - UPDATE USER
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

// DELETE - SOFT DELETE USER
export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const result = await deleteUser(id)
        return Response.json(result)

    } catch (error: any) {
        return Response.json(
            { error: error.message },
            { status: 400 }
        )
    }
}