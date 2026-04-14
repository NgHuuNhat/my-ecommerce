import { db } from "@/app/services/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  query,
  orderBy,
  where,
  startAt,
  endAt,
} from "firebase/firestore";
import { CategoryType } from "./type";

const COLLECTION = "categories";

// GET ALL (co search name)
// export const getCategories = async (
//   keyword: string = '',
//   sortField: string = 'created_at',
//   sortOrder: "asc" | "desc" = "desc",
// ) => {
//   const colRef = collection(db, COLLECTION)

//   let q

//   if (keyword) {
//     const kw = keyword.trim().toLowerCase()
//     q = query(
//       colRef,
//       orderBy("name_lowercase"),
//       startAt(kw),
//       endAt(kw + "\uf8ff")
//     )
//   } else {
//     if (sortField && sortOrder) {
//       q = query(
//         colRef,
//         orderBy(sortField, sortOrder))
//     } else {
//       q = query(
//         colRef,
//         orderBy("created_at", "desc"))
//     }
//   }

//   const snapshot = await getDocs(q)
//   const data: CategoryType[] = snapshot.docs
//     .map((doc) => ({
//       id: doc.id,
//       ...(doc.data() as Omit<CategoryType, "id">),
//     }))
//     .filter((item) => !item.deleted_at)
//   return data
// }

// GET ALL (co search id-name)
export const getCategories = async (
  keyword: string = '',
  sortField: string = 'created_at',
  sortOrder: "asc" | "desc" = "desc",
) => {
  const colRef = collection(db, COLLECTION)

  // 🔥 1. Nếu có keyword → check ID trước
  if (keyword) {
    const kw = keyword.trim()

    // 👉 tìm theo ID (exact match)
    const docRef = doc(db, COLLECTION, kw)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const item = {
        id: docSnap.id,
        ...(docSnap.data() as Omit<CategoryType, "id">),
      }

      // 👉 filter deleted
      if (!item.deleted_at) {
        return [item]
      }
      return []
    }

    // 👉 nếu không phải ID → search name
    const lowerKw = kw.toLowerCase()

    const q = query(
      colRef,
      orderBy("name_lowercase"),
      startAt(lowerKw),
      endAt(lowerKw + "\uf8ff")
    )

    const snapshot = await getDocs(q)

    return snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<CategoryType, "id">),
      }))
      .filter((item) => !item.deleted_at)
  }

  // 🔥 2. Không có keyword → sort bình thường
  let q

  if (sortField && sortOrder) {
    q = query(colRef, orderBy(sortField, sortOrder))
  } else {
    q = query(colRef, orderBy("created_at", "desc"))
  }

  const snapshot = await getDocs(q)

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<CategoryType, "id">),
    }))
    .filter((item) => !item.deleted_at)
}

// GET ONE
export const getCategoryById = async (id: string) => {
  const ref = doc(db, COLLECTION, id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  return { id: snapshot.id, ...snapshot.data() };
};

// CREATE
export const createCategory = async (data: any) => {
  const name = data.name
  return await addDoc(collection(db, COLLECTION), {
    ...data,
    name_lowercase: name.toLowerCase(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  });
};

// UPDATE
export const updateCategory = async (id: string, data: any) => {
  const ref = doc(db, COLLECTION, id);
  const name = data.name

  return await updateDoc(ref, {
    ...data,
    name_lowercase: name.toLowerCase(),
    updated_at: new Date().toISOString(),
  });
};

// SOFT DELETE
export const deleteCategory = async (id: string) => {
  const ref = doc(db, COLLECTION, id);

  return await updateDoc(ref, {
    deleted_at: new Date().toISOString(),
  });
};