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

const COLLECTION = "categories";

// GET ALL
export const getCategories = async (keyword: string = '') => {
  // const snapshot = await getDocs(collection(db, COLLECTION));
  // const normalizedKeyword = keyword.trim().toLowerCase()
  const colRef = collection(db, COLLECTION)
  let q
  if (keyword) {
    const kw = keyword.trim().toLowerCase()
    q = query(
      colRef,
      // orderBy("name"),
      // where("name", ">=", kw),
      // where("name", "<=", kw + "\uf8ff")

      orderBy("name_lowercase"),
      startAt(kw),
      endAt(kw + "\uf8ff")
    )
  } else {
    q = query(colRef, orderBy("created_at", "desc"))
  }

  const snapshot = await getDocs(q)
  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

  // .filter((item: any) => {

  //   // bỏ item đã xoá
  //   if (item.deleted_at) return false
  //   // nếu không có keyword → lấy hết
  //   if (!normalizedKeyword) return true

  //   const matchId = item.id
  //     ?.toLowerCase()
  //     .includes(normalizedKeyword)

  //   const matchName = item.name
  //     ?.toLowerCase()
  //     .includes(normalizedKeyword)

  //   return matchName || matchId
  // })
};

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

  return await updateDoc(ref, {
    ...data,
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