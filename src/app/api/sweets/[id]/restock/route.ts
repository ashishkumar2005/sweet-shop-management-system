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

    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be a positive number' },
        { status: 400 }
      )
    }

    const { data: sweet, error: fetchError } = await supabaseAdmin
      .from('sweets')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !sweet) {
      return NextResponse.json(
        { error: 'Sweet not found' },
        { status: 404 }
      )
    }

    const { data: updatedSweet, error: updateError } = await supabaseAdmin
      .from('sweets')
      .update({ quantity: sweet.quantity + quantity })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to restock' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Restock successful',
      sweet: updatedSweet
    })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
