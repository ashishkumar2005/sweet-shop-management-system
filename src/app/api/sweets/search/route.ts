import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const sweetsCollection = db.collection('sweets')

    const sweets = await sweetsCollection
      .find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
        ],
      })
      .toArray()

    const formattedSweets = sweets.map(sweet => ({
      id: sweet._id.toString(),
      name: sweet.name,
      description: sweet.description,
      price: sweet.price,
      category: sweet.category,
      image: sweet.image,
      quantity: sweet.quantity,
    }))

    return NextResponse.json({ sweets: formattedSweets })
  } catch (error) {
    console.error('Error searching sweets:', error)
    return NextResponse.json(
      { error: 'Failed to search sweets' },
      { status: 500 }
    )
  }
}
