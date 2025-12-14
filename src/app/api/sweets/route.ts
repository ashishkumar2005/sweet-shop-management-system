import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Sweet from '@/lib/models/Sweet'
import { requireAuth } from '@/lib/middleware'

export async function GET() {
  try {
    await connectDB()

    const sweets = await Sweet.find().sort({ name: 1 }).lean()

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

export async function POST(request: NextRequest) {
  const authResult = requireAuth(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const { name, category, price, quantity, image_url, description } = await request.json()

    if (!name || !category || price === undefined) {
      return NextResponse.json(
        { error: 'Name, category, and price are required' },
        { status: 400 }
      )
    }

    await connectDB()

    const sweet = await Sweet.create({
      name,
      category,
      price: parseFloat(price),
      quantity: quantity || 0,
      imageUrl: image_url || `https://source.unsplash.com/400x300/?${encodeURIComponent(name)},indian,sweet`,
      description: description || ''
    })

    const formattedSweet = {
      id: sweet._id.toString(),
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantity,
      image_url: sweet.imageUrl,
      description: sweet.description,
      created_at: sweet.createdAt
    }

    return NextResponse.json({ sweet: formattedSweet }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
