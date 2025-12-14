import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/middleware'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const { id } = await params
    const body = await request.json()
    const { name, category, price, quantity, image_url, description } = body

    const { data, error } = await supabaseAdmin
      .from('sweets')
      .update({
        name,
        category,
        price,
        quantity,
        image_url,
        description
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ sweet: data })
  } catch {
    return NextResponse.json({ error: 'Failed to update sweet' }, { status: 500 })
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

    if (error) throw error

    return NextResponse.json({ message: 'Sweet deleted' })
  } catch {
    return NextResponse.json({ error: 'Failed to delete sweet' }, { status: 500 })
  }
}
