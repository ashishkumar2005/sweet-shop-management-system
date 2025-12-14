import { NextResponse } from 'next/server'
import { getDb, ObjectId } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getDb()
    const sweetsCollection = db.collection('sweets')
    
    const sweets = await sweetsCollection.find({}).toArray()
    
    const formattedSweets = sweets.map(sweet => ({
      id: sweet._id.toString(),
      name: sweet.name,
      description: sweet.description,
      price: sweet.price,
      category: sweet.category,
      image_url: sweet.image,
      quantity: sweet.quantity,
    }))

    return NextResponse.json({ sweets: formattedSweets })
  } catch (error) {
    console.error('Error fetching sweets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sweets' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const sweet = await request.json()

    if (!sweet.name || !sweet.price || !sweet.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const sweetsCollection = db.collection('sweets')

    const result = await sweetsCollection.insertOne({
      name: sweet.name,
      description: sweet.description || '',
      price: parseFloat(sweet.price),
      category: sweet.category,
      image: sweet.image || '/placeholder.svg',
      quantity: parseInt(sweet.quantity) || 0,
      createdAt: new Date(),
    })

    const newSweet = {
      id: result.insertedId.toString(),
      ...sweet,
      price: parseFloat(sweet.price),
      quantity: parseInt(sweet.quantity) || 0,
    }

    return NextResponse.json(newSweet, { status: 201 })
  } catch (error) {
    console.error('Error creating sweet:', error)
    return NextResponse.json(
      { error: 'Failed to create sweet' },
      { status: 500 }
    )
  }
}