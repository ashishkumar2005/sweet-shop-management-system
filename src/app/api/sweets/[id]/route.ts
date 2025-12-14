import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Sweet from '@/lib/models/Sweet'
import { requireAuth, requireAdmin } from '@/lib/middleware'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB()

    const sweet = await Sweet.findById(id).lean()

    if (!sweet) {
      return NextResponse.json(
        { error: 'Sweet not found' },
        { status: 404 }
      )
    }

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

    return NextResponse.json({ sweet: formattedSweet })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = requireAuth(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const { id } = await params
    const updates = await request.json()

    await connectDB()

    const updateData: any = {}
    if (updates.name !== undefined) updateData.name = updates.name
    if (updates.category !== undefined) updateData.category = updates.category
    if (updates.price !== undefined) updateData.price = updates.price
    if (updates.quantity !== undefined) updateData.quantity = updates.quantity
    if (updates.image_url !== undefined) updateData.imageUrl = updates.image_url
    if (updates.description !== undefined) updateData.description = updates.description

    const sweet = await Sweet.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).lean()

    if (!sweet) {
      return NextResponse.json(
        { error: 'Sweet not found or failed to update' },
        { status: 404 }
      )
    }

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

    return NextResponse.json({ sweet: formattedSweet })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const { id } = await params
    await connectDB()

    const result = await Sweet.findByIdAndDelete(id)

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to delete sweet' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Sweet deleted successfully' })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
