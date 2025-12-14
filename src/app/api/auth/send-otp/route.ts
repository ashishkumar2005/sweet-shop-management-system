import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const otpCollection = db.collection('otp_verifications')
    const usersCollection = db.collection('users')

    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await otpCollection.deleteMany({ email })
    
    await otpCollection.insertOne({
      email,
      otp,
      expiresAt,
      createdAt: new Date(),
      verified: false,
    })

    console.log(`OTP for ${email}: ${otp}`)

    return NextResponse.json({ 
      message: 'OTP sent successfully',
      otp,
      expiresAt 
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    )
  }
}
