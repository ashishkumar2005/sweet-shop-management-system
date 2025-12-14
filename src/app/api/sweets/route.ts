import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAuth } from '@/lib/middleware'

export async function GET() {
  try {
    const { data: sweets, error } = await supabaseAdmin
      .from('sweets')
      .select('*')
      .order('name')

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch sweets' },
        { status: 500 }
      )
    }

    return NextResponse.json({ sweets })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const authResult = requireAuth(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const { name, category, price, quantity, image_url, description } = await request.json()

    if (!name || !category || price === undefined) {
      return NextResponse.json(
        { error: 'Name, category, and price are required' },
        { status: 400 }
      )
    }

    const { data: sweet, error } = await supabaseAdmin
      .from('sweets')
      .insert({
        name,
        category,
        price: parseFloat(price),
        quantity: quantity || 0,
        image_url: image_url || `https://source.unsplash.com/400x300/?${encodeURIComponent(name)},indian,sweet`,
        description: description || ''
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create sweet' },
        { status: 500 }
      )
    }

    return NextResponse.json({ sweet }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
