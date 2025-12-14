import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { hashPassword } from '@/lib/auth'

const sampleSweets = [
  {
    name: "Gulab Jamun",
    category: "Milk Based",
    price: 299,
    quantity: 50,
    image_url: "https://images.unsplash.com/photo-1624461794091-c48eb0afe3fe?w=400&h=300&fit=crop",
    description: "Soft, melt-in-mouth milk solids dipped in rose-flavored sugar syrup"
  },
  {
    name: "Rasgulla",
    category: "Milk Based",
    price: 249,
    quantity: 45,
    image_url: "https://images.unsplash.com/photo-1601303516990-33c74e308c3f?w=400&h=300&fit=crop",
    description: "Spongy cottage cheese balls soaked in light sugar syrup"
  },
  {
    name: "Kaju Katli",
    category: "Dry Fruits",
    price: 599,
    quantity: 30,
    image_url: "https://images.unsplash.com/photo-1666190050401-fcaa76c8ac65?w=400&h=300&fit=crop",
    description: "Premium cashew fudge topped with edible silver leaf"
  },
  {
    name: "Ladoo",
    category: "Traditional",
    price: 199,
    quantity: 60,
    image_url: "https://images.unsplash.com/photo-1630383249896-483b6a29e294?w=400&h=300&fit=crop",
    description: "Round sweet balls made with gram flour, ghee, and sugar"
  },
  {
    name: "Jalebi",
    category: "Fried",
    price: 149,
    quantity: 0,
    image_url: "https://images.unsplash.com/photo-1589301773859-34462fcf47da?w=400&h=300&fit=crop",
    description: "Crispy spiral-shaped sweet dipped in saffron sugar syrup"
  }
]

export async function POST() {
  try {
    const passwordHash = await hashPassword('admin123')

    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', 'admin@mithaimahal.com')
      .single()

    if (!existingUser) {
      await supabaseAdmin.from('users').insert({
        email: 'admin@mithaimahal.com',
        password: passwordHash,
        name: 'Admin User',
        role: 'admin'
      })
    } else {
      await supabaseAdmin
        .from('users')
        .update({ password: passwordHash, role: 'admin' })
        .eq('email', 'admin@mithaimahal.com')
    }

    const { data: existingSweets } = await supabaseAdmin
      .from('sweets')
      .select('id')

    if (!existingSweets || existingSweets.length === 0) {
      await supabaseAdmin.from('sweets').insert(sampleSweets)
    }

    return NextResponse.json({ 
      message: 'Admin user and sample sweets created successfully',
      admin: { email: 'admin@mithaimahal.com', password: 'admin123' }
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 })
  }
}
