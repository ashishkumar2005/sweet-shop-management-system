import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const id = searchParams.get('id')

    let query = supabaseAdmin.from('sweets').select('*')

    if (id) {
      query = query.eq('id', id)
    }

    if (name) {
      query = query.ilike('name', `%${name}%`)
    }

    if (category) {
      query = query.ilike('category', `%${category}%`)
    }

    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice))
    }

    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice))
    }

    const { data: sweets, error } = await query.order('name')

    if (error) {
      return NextResponse.json(
        { error: 'Failed to search sweets' },
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
