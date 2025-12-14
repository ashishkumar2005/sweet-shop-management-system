import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/middleware'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('sweets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ sweets: data || [] })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch sweets' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authResult = requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const body = await request.json()
    const { name, category, price, quantity, image_url, description } = body

    const { data, error } = await supabaseAdmin
      .from('sweets')
      .insert({
        name,
        category,
        price,
        quantity,
        image_url,
        description
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ sweet: data })
  } catch {
    return NextResponse.json({ error: 'Failed to create sweet' }, { status: 500 })
  }
}
