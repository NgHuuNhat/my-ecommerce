'use server'

import { uploadProductImage } from "./upload"

// import { uploadProductImage } from "./model"


export async function uploadProductImageAction(image: File) {
    if (!image) return

    try {
        const url = await uploadProductImage(image)
        console.log('Uploaded image URL:', url)
    } catch (err: any) {
        console.error('Error uploading image:', err.message)
    }
}