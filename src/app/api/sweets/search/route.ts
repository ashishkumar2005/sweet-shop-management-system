import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''

    const { data, error } = await supabase
      .from('sweets')
      .select('*')
      .or(`name.ilike.%${query}%,category.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ sweets: data || [] })
  } catch {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
