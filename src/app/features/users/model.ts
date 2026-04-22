import { db } from "@/app/services/firebase"
import { addDoc, collection, deleteDoc, doc, endAt, getDoc, getDocs, orderBy, query, startAt, Timestamp, updateDoc, where } from "firebase/firestore"
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

// GET ALL
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

// GET ONE USER
export const getUserById = async (id: string) => {
  const snap = await getDoc(doc(userRef, id))

  if (!snap.exists()) {
    throw new Error("User không tồn tại")
  }

  return {
    id: snap.id,
    ...snap.data(),
  }
}

// EDIT USER
export const updateUser = async (id: string, data: Partial<CreateUserType>) => {
  // 1. tìm user
  const snap = await getDoc(doc(userRef, id))

  if (!snap.exists()) {
    throw new Error("User không tồn tại")
  }

  const currentUser = snap.data() as UserType

  // 2. nếu update email thì check trùng
  if (data.email && data.email !== currentUser.email) {
    const q = await getDocs(query(userRef, where("email", "==", data.email)))

    if (!q.empty) {
      throw new Error("Email đã tồn tại")
    }
  }

  // 2. xử lý password
  if (data.password) {
    // hash password mới
    data.password = await hashPassword(data.password)
  } else {
    // không update password nếu không truyền lên
    delete data.password
  }

  // 3. update
  await updateDoc(doc(userRef, id), {
    ...data,
    updated_at: new Date().toISOString(),
  })

  return {
    message: "Cập nhật user thành công",
  }
}

// DELETE USER (SOFT DELETE)
export const deleteUser = async (id: string) => {
  // 1. tìm user
  const snap = await getDoc(doc(userRef, id))

  if (!snap.exists()) {
    throw new Error("User không tồn tại")
  }

  // 2. soft delete bằng cách set deleted_at
  await updateDoc(doc(userRef, id), {
    deleted_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  return {
    message: "Xóa user thành công",
  }
}

// RESTORE USER
export const restoreUser = async (id: string) => {
  // 1. tìm user
  const snap = await getDoc(doc(userRef, id))

  if (!snap.exists()) {
    throw new Error("User không tồn tại")
  }

  // 2. restore bằng cách set deleted_at về null
  await updateDoc(doc(userRef, id), {
    deleted_at: null,
    updated_at: new Date().toISOString(),
  })

  return {
    message: "Khôi phục user thành công",
  }
}

// FORCE DELETE (XOÁ VĨNH VIỄN)
export const forceDeleteUser = async (id: string) => {
  if (!id) throw new Error("Thiếu user id")

  const ref = doc(userRef, id)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    throw new Error("User không tồn tại")
  }

  if (!snap.data().deleted_at) {
    throw new Error("User chưa bị xoá")
  }

  await deleteDoc(ref)

  return {
    message: "Đã xoá vĩnh viễn user",
  }
}