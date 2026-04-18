import { db } from "@/app/services/firebase"
import { addDoc, collection, getDoc, getDocs, orderBy, query, Timestamp, where } from "firebase/firestore"
import { CreateUserType, UserType } from "./type"
import { hashPassword } from "../login/password"


const COLLECTION = "users"
const userRef = collection(db, COLLECTION)

//FIND EMAIL
export const findUserByEmail = async (email: string): Promise<UserType> => {
  const exitedUser = await getDocs(query(userRef, where('email', '==', email)))
  
  if (exitedUser.empty) {
    throw new Error("User không tồn tại")
  }
  
  const user = exitedUser.docs[0].data() as UserType
  return {
    ...user,
    id: exitedUser.docs[0].id,
    role: exitedUser.docs[0].data().role
  }
}

// CHECK EMAIL EXISTS
export const isUserEmailExists = async (email: string): Promise<boolean> => {
  const exitedEmail = await getDocs(
    query(userRef, where("email", "==", email))
  )
  return !exitedEmail.empty
}

// CREATE USER
export const createUser = async (data: CreateUserType) => {
  const isExists = await isUserEmailExists(data.email)
  if (isExists) {
    throw new Error("Email đã tồn tại!")
  }

  const hashedPassword = await hashPassword(data.password)

  const newUserRef = await addDoc(userRef, {
    email: data.email,
    password: hashedPassword,
    role: data.role || "user", // nếu có role
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  const newUser = await getDoc(newUserRef)

  return {
    ...(newUser.data() as UserType),
    id: newUser.id,
  }
}

//GET ALL USERS
export const getUsers = async (
  keyword: string = '',
  sortField: string = 'created_at',
  sortOrder: "asc" | "desc" = "desc",
  showDeleted: boolean = false,
): Promise<UserType[]> => {
  const q = query(userRef, orderBy("created_at", "desc"))
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => {
    const data = doc.data() as UserType
    const { id, ...rest } = data as any

    return {
      id: doc.id,
      ...rest,
    }
  })
}