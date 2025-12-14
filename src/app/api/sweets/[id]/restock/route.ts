import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Sweet from '@/lib/models/Sweet'
import { requireAdmin } from '@/lib/middleware'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const { id } = await params
    const { quantity } = await request.json()

    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be a positive number' },
        { status: 400 }
      )
    }

    await connectDB()

    const sweet = await Sweet.findById(id)

    if (!sweet) {
      return NextResponse.json(
        { error: 'Sweet not found' },
        { status: 404 }
      )
    }

    sweet.quantity += quantity
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
      message: 'Restock successful',
      sweet: formattedSweet
    })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
