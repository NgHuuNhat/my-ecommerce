import { db } from "@/app/services/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";

const COLLECTION = "categories";

// GET ALL
export const getCategories = async () => {
  const snapshot = await getDocs(collection(db, COLLECTION));

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter((item: any) => !item.deleted_at);
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
  return await addDoc(collection(db, COLLECTION), {
    ...data,
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