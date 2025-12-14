import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { generateToken, hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    const passwordHash = await hashPassword(password)

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        password: passwordHash,
        name,
        role: 'user'
      })
      .select()
      .single()

    if (error) throw error

    const token = generateToken(user)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    })
  } catch {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
