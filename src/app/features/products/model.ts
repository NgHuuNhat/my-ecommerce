import { db, storage } from "@/app/services/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  query,
  orderBy,
  startAt,
  endAt,
  deleteDoc,
} from "firebase/firestore";
import { ProductQuery, ProductType } from "./type";
import { getUserById } from "../users/model";
import { getCategoryById } from "../categories/model";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const COLLECTION = "products"
const FIRESTORE_SEARCH_SUFFIX = "\uf8ff"

// 🔹 mapper
const createProductItem = (doc: any): ProductType => ({
  id: doc.id,
  ...(doc.data() as Omit<ProductType, "id">),
})

// 🔹 filter
const isActive = (item: ProductType) => !item.deleted_at
const isDeleted = (item: ProductType) => !!item.deleted_at

// 🔹 GET ALL
export const getProducts = async (
  params: ProductQuery = {}
) => {
  const {
    keyword = "",
    sortField = "created_at",
    sortOrder = "desc",
    deleted = false,
  } = params

  const colRef = collection(db, COLLECTION)
  const filterFunc = deleted ? isDeleted : isActive

  if (keyword) {
    const trimmed = keyword.trim()

    // 👉 search by id
    const docSnap = await getDoc(doc(db, COLLECTION, trimmed))
    if (docSnap.exists()) {
      const item = createProductItem(docSnap)
      return filterFunc(item) ? [item] : []
    }

    // 👉 search by name
    const lower = trimmed.toLowerCase()
    const q = query(
      colRef,
      orderBy("name_lowercase"),
      startAt(lower),
      endAt(lower + FIRESTORE_SEARCH_SUFFIX)
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map(createProductItem).filter(filterFunc)
  }

  const q = query(colRef, orderBy(sortField, sortOrder))
  const snapshot = await getDocs(q)

  return snapshot.docs.map(createProductItem).filter(filterFunc)
}

// 🔹 GET ONE
export const getProductById = async (id: string): Promise<ProductType | null> => {
  const ref = doc(db, COLLECTION, id)
  const snapshot = await getDoc(ref)

  if (!snapshot.exists()) return null

  return createProductItem(snapshot)
}

// 🔹 CREATE
// export const createProduct = async (data: ProductType) => {
//   try {
//     const { name, user_id, category_id, ...restData } = data

//     // 🔥 validate
//     if (!name) throw new Error("Name không được để trống")
//     if (!user_id) throw new Error("Thiếu người tạo")
//     if (!category_id) throw new Error("Thiếu category")

//     const created_by = await getUserById(user_id)
//     if (!created_by) throw new Error("User không tồn tại")

//     const category_by = await getCategoryById(category_id)
//     if (!category_by) throw new Error("Category không tồn tại")

//     const docRef = await addDoc(collection(db, COLLECTION), {
//       ...restData,
//       name,
//       name_lowercase: name.toLowerCase(),
//       created_by,
//       category_by,
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//       deleted_at: null,
//     })

//     return {
//       id: docRef.id,
//       message: "Tạo sản phẩm thành công",
//     }

//   } catch (err: any) {
//     throw new Error(err.message || "Tạo sản phẩm thất bại")
//   }
// }

export const createProduct = async (data: ProductType) => {
  try {
    const {
      name,
      user_id,
      category_id,
      images,
      ...restData
    } = data

    // validate
    if (!name) throw new Error("Name không được để trống")
    if (!user_id) throw new Error("Thiếu người tạo")
    if (!category_id) throw new Error("Thiếu category")

    const created_by = await getUserById(user_id)

    if (!created_by) {
      throw new Error("User không tồn tại")
    }

    const category_by = await getCategoryById(category_id)

    if (!category_by) {
      throw new Error("Category không tồn tại")
    }

    const docRef = await addDoc(collection(db, COLLECTION), {
      ...restData,

      name,
      images: images || [],

      name_lowercase: name.toLowerCase(),

      created_by,
      category_by,

      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    })

    return {
      id: docRef.id,
      message: "Tạo sản phẩm thành công",
    }
  } catch (err: any) {
    throw new Error(err.message || "Tạo sản phẩm thất bại")
  }
}

// 🔹 UPDATE
export const updateProduct = async (id: string, data: any) => {
  try {
    const ref = doc(db, COLLECTION, id)

    const updateData: any = {
      ...data,
      updated_at: new Date().toISOString(),
    }

    // 🔥 tránh lỗi name undefined
    if (data.name) {
      updateData.name_lowercase = data.name.toLowerCase()
    }

    await updateDoc(ref, updateData)

    return {
      message: "Cập nhật sản phẩm thành công",
    }

  } catch (err: any) {
    throw new Error(err.message || "Cập nhật thất bại")
  }
}

// 🔹 SOFT DELETE
export const deleteProduct = async (id: string) => {
  try {
    const ref = doc(db, COLLECTION, id)

    await updateDoc(ref, {
      deleted_at: new Date().toISOString(),
    })

    return {
      message: "Đã xoá sản phẩm",
    }

  } catch (err: any) {
    throw new Error(err.message || "Xoá thất bại")
  }
}

// 🔹 RESTORE
export const restoreProduct = async (id: string) => {
  try {
    const ref = doc(db, COLLECTION, id)

    await updateDoc(ref, {
      deleted_at: null,
    })

    return {
      message: "Khôi phục sản phẩm thành công",
    }

  } catch (err: any) {
    throw new Error(err.message || "Khôi phục thất bại")
  }
}

// 🔹 DELETE FOREVER
export const deleteProductForever = async (id: string) => {
  try {
    const ref = doc(db, COLLECTION, id)

    await deleteDoc(ref)

    return {
      message: "Đã xoá vĩnh viễn",
    }

  } catch (err: any) {
    throw new Error(err.message || "Xoá vĩnh viễn thất bại")
  }
}