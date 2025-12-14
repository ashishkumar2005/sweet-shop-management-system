import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/middleware'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const { id } = await params
    const { quantity } = await request.json()

    const { data: sweet, error: fetchError } = await supabaseAdmin
      .from('sweets')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !sweet) {
      return NextResponse.json({ error: 'Sweet not found' }, { status: 404 })
    }

    const { data, error } = await supabaseAdmin
      .from('sweets')
      .update({ quantity: sweet.quantity + quantity })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ sweet: data })
  } catch {
    return NextResponse.json({ error: 'Restock failed' }, { status: 500 })
  }
}
