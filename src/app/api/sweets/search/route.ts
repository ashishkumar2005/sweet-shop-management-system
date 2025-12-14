import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Sweet from '@/lib/models/Sweet'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const id = searchParams.get('id')

    await connectDB()

    const query: any = {}

    if (id) {
      query._id = id
    }

    if (name) {
      query.name = { $regex: name, $options: 'i' }
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' }
    }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = parseFloat(minPrice)
      if (maxPrice) query.price.$lte = parseFloat(maxPrice)
    }

    const sweets = await Sweet.find(query).sort({ name: 1 }).lean()

    const formattedSweets = sweets.map((sweet) => ({
      id: sweet._id.toString(),
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantity,
      image_url: sweet.imageUrl,
      description: sweet.description,
      created_at: sweet.createdAt
    }))

    return NextResponse.json({ sweets: formattedSweets })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
