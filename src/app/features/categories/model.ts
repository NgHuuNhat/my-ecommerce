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

// GET ALL
export const getCategories = async (
  keyword: string = '',
  sortField: string = '',
  // sortOrder: string = '',
  sortOrder: "asc" | "desc" = "desc"
  // keyword?: string,
  // sortField?: string,
  // sortOrder?: "asc" | "desc",
) => {
  const colRef = collection(db, COLLECTION)
  let q
  if (keyword) {
    const kw = keyword.trim().toLowerCase()
    q = query(
      colRef,
      orderBy("name_lowercase"),
      startAt(kw),
      endAt(kw + "\uf8ff")
    )
  } else {
    if (sortField && sortOrder) {
      q = query(colRef, orderBy(sortField, sortOrder))
    } else {
      q = query(colRef)
    }
  }

  const snapshot = await getDocs(q)
  const data: CategoryType[] = snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<CategoryType, "id">),
    }))
    .filter((item) => !item.deleted_at)
  return data
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