import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

    try {
      await resend.emails.send({
        from: 'Mithai Mahal <onboarding@resend.dev>',
        to: email,
        subject: 'Your OTP for Mithai Mahal Registration',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; }
                .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
                .emoji { font-size: 48px; margin-bottom: 10px; }
                .content { padding: 40px 30px; }
                .otp-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 36px; font-weight: 700; letter-spacing: 8px; padding: 25px; text-align: center; border-radius: 8px; margin: 30px 0; }
                .info { color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0; }
                .footer { background: #f9fafb; padding: 20px 30px; text-align: center; color: #9ca3af; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="emoji">🪷</div>
                  <h1>Mithai Mahal</h1>
                </div>
                <div class="content">
                  <h2 style="color: #111827; margin-top: 0;">Welcome to Mithai Mahal!</h2>
                  <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
                    Thank you for registering! Please use the following One-Time Password (OTP) to verify your email address:
                  </p>
                  <div class="otp-box">${otp}</div>
                  <div class="info">
                    <p><strong>⏱️ This code will expire in 10 minutes.</strong></p>
                    <p>If you didn't request this code, please ignore this email.</p>
                  </div>
                </div>
                <div class="footer">
                  <p>© 2025 Mithai Mahal. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      })
    } catch (emailError) {
      console.error('Email send error:', emailError)
      return NextResponse.json(
        { error: 'Failed to send OTP email. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      message: 'OTP sent successfully to your email',
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