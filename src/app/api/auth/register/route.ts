import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import { hashPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    await connectDB()

    const existingUser = await User.findOne({ email: email.toLowerCase() })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    const passwordHash = await hashPassword(password)

    const newUser = await User.create({
      email: email.toLowerCase(),
      password: passwordHash,
      name,
      role: 'user'
    })

    const token = generateToken({
      id: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    })

    return NextResponse.json({
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      },
      token
    })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
