import { db } from "@/app/services/firebase"
import { addDoc, collection, getDoc, getDocs, query, Timestamp, where } from "firebase/firestore"
import { AdminType, CreateAdminType } from "./type"
import { hashPassword } from "../login/password"

const COLLECTION = "admins";
const adminRef = collection(db, COLLECTION)

export const findAdminByEmail = async (email: string): Promise<AdminType> => {
    const exitedAdmin = await getDocs(query(adminRef, where('email', '==', email)))
    const admin = exitedAdmin.docs[0].data() as AdminType
    return {
        ...admin,
        id: exitedAdmin.docs[0].id
    }
}

export const isEmailExists = async (email: string): Promise<boolean> => {
    const exitedEmail = await getDocs(
        query(adminRef, where('email', '==', email))
    )
    return !exitedEmail.empty
}

export const createAdmin = async (data: CreateAdminType) => {
    const isExists = await isEmailExists(data.email)
    if (isExists) {
        throw new Error('Email already exists!')
    }

    const hashedPassword = await hashPassword(data.password)

    const newAdminRef = await addDoc(adminRef, {
        email: data.email,
        password: hashedPassword,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
    })
    const newAdmin = await getDoc(newAdminRef)

    return { id: newAdmin.id, ...newAdmin.data() }
}