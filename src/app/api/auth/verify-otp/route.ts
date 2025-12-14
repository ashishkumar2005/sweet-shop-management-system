import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const otpCollection = db.collection('otp_verifications')

    const otpRecord = await otpCollection.findOne({ 
      email, 
      otp,
      verified: false 
    })

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      )
    }

    if (new Date() > new Date(otpRecord.expiresAt)) {
      await otpCollection.deleteOne({ _id: otpRecord._id })
      return NextResponse.json(
        { error: 'OTP has expired' },
        { status: 400 }
      )
    }

    await otpCollection.updateOne(
      { _id: otpRecord._id },
      { $set: { verified: true } }
    )

    return NextResponse.json({ 
      message: 'OTP verified successfully',
      verified: true 
    })
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    )
  }
}
