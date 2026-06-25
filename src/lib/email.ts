import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
})

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER
  if (!from) throw new Error('SMTP_FROM or SMTP_USER is not configured')

  await transporter.sendMail({
    from,
    to,
    subject: 'Reset your password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #1f2937;">
        <h2 style="color: #2563eb; margin-bottom: 16px;">Password Reset Request</h2>
        <p style="margin-bottom: 24px;">You requested a password reset for your Majesty Compucare account. Click the button below to set a new password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
        <p style="margin-top: 24px; font-size: 13px; color: #6b7280;">If you did not request this reset, you can safely ignore this email. The link will expire on its own.</p>
        <p style="margin-top: 24px; font-size: 13px; color: #6b7280;">If the button does not work, copy and paste this link into your browser:<br><a href="${resetUrl}">${resetUrl}</a></p>
      </div>
    `,
    text: `Reset your password: ${resetUrl}\n\nThis link expires in 1 hour.`,
  })
}

export async function verifySmtpConfig() {
  return transporter.verify()
}
