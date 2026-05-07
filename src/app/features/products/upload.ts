import { storage } from "@/app/services/firebase"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

// upload image
export const uploadProductImage = async (file: File): Promise<string> => {
    try {
        const storageRef = ref(storage, `products/${Date.now()}_${file.name}`)
        const snapshot = await uploadBytes(storageRef, file)
        const url = await getDownloadURL(snapshot.ref)
        // console.log('url', url)
        return url
    } catch (err: any) {
        throw new Error(err.message || "Upload ảnh thất bại")
    }
}