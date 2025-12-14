import { NextResponse } from 'next/server'
import { getDb, ObjectId } from '@/lib/mongodb'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await getDb()
    const sweetsCollection = db.collection('sweets')

    const sweet = await sweetsCollection.findOne({ _id: new ObjectId(id) })

    if (!sweet) {
      return NextResponse.json(
        { error: 'Sweet not found' },
        { status: 404 }
      )
    }

    const formattedSweet = {
      id: sweet._id.toString(),
      name: sweet.name,
      description: sweet.description,
      price: sweet.price,
      category: sweet.category,
      image: sweet.image,
      quantity: sweet.quantity,
    }

    return NextResponse.json(formattedSweet)
  } catch (error) {
    console.error('Error fetching sweet:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sweet' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updates = await request.json()

    const db = await getDb()
    const sweetsCollection = db.collection('sweets')

    const updateData: any = {}
    if (updates.name) updateData.name = updates.name
    if (updates.description !== undefined) updateData.description = updates.description
    if (updates.price !== undefined) updateData.price = parseFloat(updates.price)
    if (updates.category) updateData.category = updates.category
    if (updates.image) updateData.image = updates.image
    if (updates.quantity !== undefined) updateData.quantity = parseInt(updates.quantity)
    updateData.updatedAt = new Date()

    const result = await sweetsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Sweet not found' },
        { status: 404 }
      )
    }

    const updatedSweet = await sweetsCollection.findOne({ _id: new ObjectId(id) })

    return NextResponse.json({
      id: updatedSweet!._id.toString(),
      name: updatedSweet!.name,
      description: updatedSweet!.description,
      price: updatedSweet!.price,
      category: updatedSweet!.category,
      image: updatedSweet!.image,
      quantity: updatedSweet!.quantity,
    })
  } catch (error) {
    console.error('Error updating sweet:', error)
    return NextResponse.json(
      { error: 'Failed to update sweet' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await getDb()
    const sweetsCollection = db.collection('sweets')

    const result = await sweetsCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Sweet not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Sweet deleted successfully' })
  } catch (error) {
    console.error('Error deleting sweet:', error)
    return NextResponse.json(
      { error: 'Failed to delete sweet' },
      { status: 500 }
    )
  }
}
