import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { hashPassword } from '@/lib/auth'

export async function POST() {
  try {
    const passwordHash = await hashPassword('admin123')

    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', 'admin@sweetshop.com')
      .single()

    if (existingUser) {
      await supabaseAdmin
        .from('users')
        .update({ password_hash: passwordHash, role: 'admin' })
        .eq('email', 'admin@sweetshop.com')
    } else {
      await supabaseAdmin
        .from('users')
        .insert({
          email: 'admin@sweetshop.com',
          password_hash: passwordHash,
          name: 'Admin User',
          role: 'admin'
        })
    }

    return NextResponse.json({ message: 'Admin user created/updated successfully' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 })
  }
}
