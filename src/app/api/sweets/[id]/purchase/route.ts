import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Sweet from '@/lib/models/Sweet'
import { requireAuth } from '@/lib/middleware'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = requireAuth(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const { id } = await params
    const { quantity = 1 } = await request.json()

    await connectDB()

    const sweet = await Sweet.findById(id)

    if (!sweet) {
      return NextResponse.json(
        { error: 'Sweet not found' },
        { status: 404 }
      )
    }

    if (sweet.quantity < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      )
    }

    sweet.quantity -= quantity
    await sweet.save()

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

    return NextResponse.json({
      message: 'Purchase successful',
      sweet: formattedSweet
    })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
