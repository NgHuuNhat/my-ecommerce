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
  deleteDoc,
} from "firebase/firestore";
import { CategoryType } from "./type";

const COLLECTION = "categories"

//get all
const FIRESTORE_SEARCH_SUFFIX = "\uf8ff"
const createCategoryItem = (doc: any): CategoryType => ({
  id: doc.id,
  ...(doc.data() as Omit<CategoryType, "id">),
})
const isActive = (item: CategoryType): boolean => !item.deleted_at
const isDeleted = (item: CategoryType): boolean => !!item.deleted_at

export const getCategories = async (
  keyword: string = '',
  sortField: string = 'created_at',
  sortOrder: "asc" | "desc" = "desc",
  showDeleted: boolean = false,
): Promise<CategoryType[]> => {
  const colRef = collection(db, COLLECTION)
  const filterFunc = showDeleted ? isDeleted : isActive

  if (keyword) {
    const trimmed = keyword.trim()

    const docSnap = await getDoc(doc(db, COLLECTION, trimmed))
    if (docSnap.exists()) {
      const item = createCategoryItem(docSnap)
      return filterFunc(item) ? [item] : []
    }

    const lower = trimmed.toLowerCase()
    const q = query(
      colRef,
      orderBy("name_lowercase"),
      startAt(lower),
      endAt(lower + FIRESTORE_SEARCH_SUFFIX)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(createCategoryItem).filter(filterFunc)
  }

  const q = query(colRef, orderBy(sortField, sortOrder))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(createCategoryItem).filter(filterFunc)
}

// GET ONE
export const getCategoryById = async (id: string): Promise<CategoryType | null> => {
  const ref = doc(db, COLLECTION, id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  return createCategoryItem(snapshot);
};

// CREATE
export const createCategory = async (data: any) => {
  // const name = data.name

  const payload = {
    ...data,
    name_lowercase: data.name.toLowerCase(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  }

  const docRef = await addDoc(collection(db, COLLECTION), payload)

  return {
    id: docRef.id,
    ...payload,
  }

  // return await addDoc(collection(db, COLLECTION), {
  //   ...data,
  //   name_lowercase: name.toLowerCase(),
  //   created_at: new Date().toISOString(),
  //   updated_at: new Date().toISOString(),
  //   deleted_at: null,
  // });
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
  const ref = doc(db, COLLECTION, id)

  return await updateDoc(ref, {
    deleted_at: new Date().toISOString(),
  })
}

// RESTORE FROM TRASH
export const restoreCategory = async (id: string) => {
  const ref = doc(db, COLLECTION, id)

  return await updateDoc(ref, {
    deleted_at: null,
  })
}

// PERMANENT DELETE
export const deleteForever = async (id: string) => {
  const ref = doc(db, COLLECTION, id)
  return await deleteDoc(ref)
}