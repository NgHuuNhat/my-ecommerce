import { uploadProductImage } from '@/app/features/products/upload'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json({ error: 'No file' }, { status: 400 })
    }

    const url = await uploadProductImage(file)

    return NextResponse.json({ url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}