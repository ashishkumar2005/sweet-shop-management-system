import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAuth } from '@/lib/middleware'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = requireAuth(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const { id } = await params
    const { quantity = 1 } = await request.json()

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

    if (sweet.quantity < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      )
    }

    const { data: updatedSweet, error: updateError } = await supabaseAdmin
      .from('sweets')
      .update({ quantity: sweet.quantity - quantity })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to process purchase' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Purchase successful',
      sweet: updatedSweet
    })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
