import { forceDeleteUser, restoreUser } from "@/app/features/users/model"
import { doc, getDoc } from "firebase/firestore"

// RESTORE USER
export async function PATCH(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const result = await restoreUser(id)
        return Response.json(result)
    } catch (error: any) {
        return Response.json(
            { error: error.message },
            { status: 400 }
        )
    }
}

// FORCE DELETE (XOÁ VĨNH VIỄN)
export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params

        const result = await forceDeleteUser(id)

        return Response.json(result)
    } catch (error: any) {
        return Response.json(
            { error: error.message },
            { status: 400 }
        )
    }
}