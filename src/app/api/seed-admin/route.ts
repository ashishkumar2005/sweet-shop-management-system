import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export async function POST() {
  try {
    const db = await getDb()
    const usersCollection = db.collection('users')
    const sweetsCollection = db.collection('sweets')

    const existingAdmin = await usersCollection.findOne({ email: 'admin@mithaimahal.com' })
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10)
      
      await usersCollection.insertOne({
        email: 'admin@mithaimahal.com',
        password: hashedPassword,
        name: 'Admin',
        role: 'admin',
        createdAt: new Date(),
      })
    }

    const sweetCount = await sweetsCollection.countDocuments()
    
    if (sweetCount === 0) {
      const sampleSweets = [
        {
          name: 'Gulab Jamun',
          description: 'Soft milk-solid balls soaked in rose-flavored syrup',
          price: 250,
          category: 'Sweets',
          image: 'https://images.unsplash.com/photo-1589638518669-ca4f5e4c7b95?w=500',
          quantity: 50,
          createdAt: new Date(),
        },
        {
          name: 'Rasgulla',
          description: 'Spongy cottage cheese balls in sugar syrup',
          price: 200,
          category: 'Sweets',
          image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500',
          quantity: 40,
          createdAt: new Date(),
        },
        {
          name: 'Jalebi',
          description: 'Crispy, spiral-shaped sweet soaked in saffron syrup',
          price: 180,
          category: 'Sweets',
          image: 'https://images.unsplash.com/photo-1606471191009-2f292a0b0163?w=500',
          quantity: 60,
          createdAt: new Date(),
        },
        {
          name: 'Kaju Katli',
          description: 'Diamond-shaped cashew fudge with silver leaf',
          price: 450,
          category: 'Sweets',
          image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500',
          quantity: 30,
          createdAt: new Date(),
        },
        {
          name: 'Ladoo',
          description: 'Sweet balls made from flour, ghee and sugar',
          price: 220,
          category: 'Sweets',
          image: 'https://images.unsplash.com/photo-1610192244261-3f33de0d8b4d?w=500',
          quantity: 45,
          createdAt: new Date(),
        },
        {
          name: 'Barfi',
          description: 'Dense milk-based sweet with nuts and cardamom',
          price: 280,
          category: 'Sweets',
          image: 'https://images.unsplash.com/photo-1589638518669-ca4f5e4c7b95?w=500',
          quantity: 35,
          createdAt: new Date(),
        },
        {
          name: 'Samosa',
          description: 'Crispy triangular pastry filled with spiced potatoes',
          price: 40,
          category: 'Snacks',
          image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500',
          quantity: 100,
          createdAt: new Date(),
        },
        {
          name: 'Pakora',
          description: 'Deep-fried vegetable fritters with chickpea batter',
          price: 120,
          category: 'Snacks',
          image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500',
          quantity: 80,
          createdAt: new Date(),
        },
      ]

      await sweetsCollection.insertMany(sampleSweets)
    }

    return NextResponse.json({
      message: 'Database seeded successfully',
      admin: { email: 'admin@mithaimahal.com', password: 'admin123' },
    })
  } catch (error) {
    console.error('Seeding error:', error)
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}
