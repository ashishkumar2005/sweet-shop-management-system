import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get('email')

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const ordersCollection = db.collection('orders')

    const orders = await ordersCollection
      .find({ userEmail })
      .sort({ orderDate: -1 })
      .toArray()

    const formattedOrders = orders.map(order => ({
      id: order._id.toString(),
      sweetId: order.sweetId,
      sweetName: order.sweetName,
      sweetImage: order.sweetImage,
      sweetPrice: order.sweetPrice,
      quantity: order.quantity,
      totalPrice: order.totalPrice,
      orderDate: order.orderDate,
      status: order.status
    }))

    return NextResponse.json({ orders: formattedOrders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
