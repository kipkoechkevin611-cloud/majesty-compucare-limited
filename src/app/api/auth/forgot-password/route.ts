import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { randomBytes } from 'crypto'
import { sendPasswordResetEmail } from '@/lib/email'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })

    if (!user) {
      // Don't reveal if email exists, but return success to prevent enumeration
      return NextResponse.json({ message: 'If the email exists, a reset link has been sent' })
    }

    // Generate secure random token
    const token = randomBytes(32).toString('hex')
    const expiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry,
      },
    })

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.majestycompucarelimited.com'
    const resetUrl = `${baseUrl}/reset-password?token=${token}`

    try {
      await sendPasswordResetEmail(normalizedEmail, resetUrl)
      console.log(`Password reset email sent to ${normalizedEmail}: ${resetUrl}`)
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError)
      return NextResponse.json(
        { error: 'Failed to send reset email. Please try again later.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Reset link sent successfully' })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
