import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import { hashPassword } from '@/lib/auth'

export async function POST() {
  try {
    await connectDB()
    
    const passwordHash = await hashPassword('admin123')

    const existingUser = await User.findOne({ email: 'admin@sweetshop.com' })

    if (existingUser) {
      existingUser.password = passwordHash
      existingUser.role = 'admin'
      await existingUser.save()
    } else {
      await User.create({
        email: 'admin@sweetshop.com',
        password: passwordHash,
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
