import { NextResponse } from 'next/server'
import { getDb, ObjectId } from '@/lib/mongodb'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { quantity, userEmail } = await request.json()

    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        { error: 'Invalid quantity' },
        { status: 400 }
      )
    }

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const sweetsCollection = db.collection('sweets')

    const sweet = await sweetsCollection.findOne({ _id: new ObjectId(id) })

    if (!sweet) {
      return NextResponse.json(
        { error: 'Sweet not found' },
        { status: 404 }
      )
    }

    if (sweet.quantity < quantity) {
      return NextResponse.json(
        { error: 'Insufficient quantity available' },
        { status: 400 }
      )
    }

    const result = await sweetsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { quantity: -quantity }, $set: { updatedAt: new Date() } }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to update quantity' },
        { status: 500 }
      )
    }

    const ordersCollection = db.collection('orders')
    await ordersCollection.insertOne({
      userEmail,
      sweetId: id,
      sweetName: sweet.name,
      sweetImage: sweet.image,
      sweetPrice: sweet.price,
      quantity,
      totalPrice: sweet.price * quantity,
      orderDate: new Date(),
      status: 'completed'
    })

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
    console.error('Error processing purchase:', error)
    return NextResponse.json(
      { error: 'Failed to process purchase' },
      { status: 500 }
    )
  }
}