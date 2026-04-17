import { db } from "@/app/services/firebase"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  startAt,
  endAt,
} from "firebase/firestore"

// ================= TYPE =================
export type UserType = {
  id: string
  email: string
  email_lowercase: string
  password: string
  role: "admin" | "user"
  isActive: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

// ================= COLLECTION =================
const col = collection(db, "users")

// ================= CREATE =================
export async function createUser(data: Omit<UserType, "id">) {
  const docRef = await addDoc(col, data)
  return docRef.id
}

// ================= GET ALL =================
// export async function getUsers(
//   keyword: string = "",
//   sortField: keyof UserType = "created_at",
//   sortOrder: "asc" | "desc" = "desc",
//   isDeleted: boolean = false
// ) {
//   let q = query(col)

//   // filter deleted
//   q = query(q, where("deleted_at", isDeleted ? "!=" : "==", null))

//   // search email
//   if (keyword) {
//     const k = keyword.toLowerCase()
//     q = query(
//       q,
//       orderBy("email_lowercase"),
//       startAt(k),
//       endAt(k + "\uf8ff")
//     )
//   } else {
//     q = query(q, orderBy(sortField, sortOrder))
//   }

//   const snap = await getDocs(q)

//   return snap.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   })) as UserType[]
// }

const FIRESTORE_SEARCH_SUFFIX = "\uf8ff"

const createUserItem = (doc: any): UserType => ({
  id: doc.id,
  ...(doc.data() as Omit<UserType, "id">),
})

const isActive = (item: UserType): boolean => !item.deleted_at
const isDeleted = (item: UserType): boolean => !!item.deleted_at

export const getUsers = async (
  keyword: string = "",
  sortField: keyof UserType = "created_at",
  sortOrder: "asc" | "desc" = "desc",
  showDeleted: boolean = false
): Promise<UserType[]> => {
  const colRef = collection(db, "users")
  const filterFunc = showDeleted ? isDeleted : isActive

  // ================= SEARCH =================
  if (keyword) {
    const trimmed = keyword.trim()

    // 👉 search theo ID trước (giống category)
    const docSnap = await getDoc(doc(db, "users", trimmed))
    if (docSnap.exists()) {
      const item = createUserItem(docSnap)
      return filterFunc(item) ? [item] : []
    }

    // 👉 search theo email
    const lower = trimmed.toLowerCase()

    const q = query(
      colRef,
      orderBy("email_lowercase"),
      startAt(lower),
      endAt(lower + FIRESTORE_SEARCH_SUFFIX)
    )

    const snapshot = await getDocs(q)

    return snapshot.docs
      .map(createUserItem)
      .filter(filterFunc)
  }

  // ================= NORMAL LIST =================
  const q = query(colRef, orderBy(sortField, sortOrder))
  const snapshot = await getDocs(q)

  return snapshot.docs
    .map(createUserItem)
    .filter(filterFunc)
}

// ================= GET DETAIL =================
export async function getUserById(id: string) {
  const snap = await getDoc(doc(db, "users", id))
  if (!snap.exists()) return null

  return {
    id: snap.id,
    ...snap.data(),
  } as UserType
}

// ================= UPDATE =================
export async function updateUser(
  id: string,
  data: Partial<UserType>
) {
  await updateDoc(doc(db, "users", id), data)
}

// ================= DELETE (SOFT) =================
export async function deleteUser(id: string) {
  await updateDoc(doc(db, "users", id), {
    deleted_at: new Date().toISOString(),
  })
}

// ================= CHECK EMAIL =================
export async function checkEmailExists(email_lowercase: string) {
  const q = query(
    col,
    where("email_lowercase", "==", email_lowercase),
    where("deleted_at", "==", null)
  )

  const snap = await getDocs(q)
  return !snap.empty
}