import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      // Don't reveal if email exists, but return success to prevent enumeration
      return NextResponse.json({ message: 'If the email exists, a code has been sent' })
    }

    // Generate 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString()

    // Store code with expiry (5 minutes)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetCode: code,
        resetCodeExpiry: new Date(Date.now() + 5 * 60 * 1000),
      },
    })

    // In production, send email here with the code
    // For now, log it to console (remove in production)
    console.log(`Password reset code for ${email}: ${code}`)

    // TODO: Integrate with email service (Resend, SendGrid, etc.)
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'noreply@yourdomain.com',
    //   to: email,
    //   subject: 'Password Reset Code',
    //   html: `<p>Your password reset code is: <strong>${code}</strong></p><p>This code expires in 5 minutes.</p>`,
    // })

    return NextResponse.json({ message: 'Code sent successfully' })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Failed to send code' }, { status: 500 })
  }
}
