import { db } from "@/app/services/firebase"
import { addDoc, collection, doc, endAt, getDoc, getDocs, orderBy, query, startAt, Timestamp, where } from "firebase/firestore"
import { CreateUserType, defaultUserQuery, UserQuery, UserType } from "./type"
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

export const getUsers = async (params: UserQuery = {}) => {
  const { keyword, sortField, sortOrder, deleted } = defaultUserQuery(params)

  const filter = (i: any) => (deleted ? !!i.deleted_at : !i.deleted_at)

  if (keyword) {
    // 🔥 1. thử tìm theo ID trước
    const docRef = doc(userRef, keyword)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const user = { id: docSnap.id, ...docSnap.data() }
      return filter(user) ? [user] : []
    }

    // 🔥 2. không có thì search email như cũ
    const lower = keyword.trim().toLowerCase()
    const snap = await getDocs(
      query(
        userRef,
        orderBy("email"),
        startAt(lower),
        endAt(lower + "\uf8ff")
      )
    )

    return snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(filter)
  }

  const snap = await getDocs(query(userRef, orderBy(sortField, sortOrder === "asc" ? "asc" : "desc")))
  return snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(filter)
}