import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAuth, requireAdmin } from '@/lib/middleware'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: sweet, error } = await supabaseAdmin
      .from('sweets')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !sweet) {
      return NextResponse.json(
        { error: 'Sweet not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ sweet })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = requireAuth(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const { id } = await params
    const updates = await request.json()

    const { data: sweet, error } = await supabaseAdmin
      .from('sweets')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error || !sweet) {
      return NextResponse.json(
        { error: 'Sweet not found or failed to update' },
        { status: 404 }
      )
    }

    return NextResponse.json({ sweet })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const { id } = await params

    const { error } = await supabaseAdmin
      .from('sweets')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete sweet' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Sweet deleted successfully' })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
