import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { indianSweets } from '../seed-sweets/route'

export async function POST() {
  try {
    const db = await getDb()
    const ordersCollection = db.collection('orders')
    const sweetsCollection = db.collection('sweets')
    
    const sweets = await sweetsCollection.find({}).toArray()
    if (sweets.length === 0) {
      return NextResponse.json({ error: 'Please seed sweets first' }, { status: 400 })
    }

    await ordersCollection.deleteMany({})

    const regions = ['North', 'South', 'East', 'West', 'Central']
    const statuses = ['delivered', 'processing', 'shipped']
    const orders = []

    // Generate orders for the last 12 months
    const today = new Date()
    for (let i = 0; i < 300; i++) {
      const sweet = sweets[Math.floor(Math.random() * sweets.length)]
      const quantity = Math.floor(Math.random() * 5) + 1
      const orderDate = new Date(today)
      orderDate.setDate(today.getDate() - Math.floor(Math.random() * 365))
      
      orders.push({
        sweetId: sweet._id.toString(),
        sweetName: sweet.name,
        sweetImage: sweet.image_url,
        sweetPrice: sweet.price,
        quantity,
        totalPrice: sweet.price * quantity,
        orderDate: orderDate.toISOString(),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        userEmail: 'test@example.com',
        region: regions[Math.floor(Math.random() * regions.length)]
      })
    }

    await ordersCollection.insertMany(orders)

    return NextResponse.json({ 
      message: 'Orders seeded successfully', 
      count: orders.length 
    })
  } catch (error) {
    console.error('Error seeding orders:', error)
    return NextResponse.json(
      { error: 'Failed to seed orders' },
      { status: 500 }
    )
  }
}
