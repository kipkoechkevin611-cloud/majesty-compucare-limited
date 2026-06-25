'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new reset link.')
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('Invalid or missing reset token.')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to reset password.')
      } else {
        setSuccess(true)
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{background:'var(--bg-primary)'}}>
      <div className="max-w-md w-full">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm mb-6 transition" style={{color:'var(--text-low)',fontFamily:'Fira Code,monospace'}} prefetch={true}>
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-slate-900" style={{fontFamily:'Montserrat,sans-serif'}}>Reset Password</h1>
          <p className="mt-2" style={{color:'var(--text-low)'}}>Enter your new password below.</p>
        </div>

        <div className="rounded-xl p-8 glass" style={{border:'1px solid rgba(0,123,255,0.2)'}}>
          {error && (
            <div className="rounded-lg p-4 mb-6 flex items-center gap-2" style={{background:'rgba(255,69,0,0.1)',border:'1px solid rgba(255,69,0,0.3)'}}>
              <AlertCircle className="w-5 h-5 flex-shrink-0" style={{color:'var(--accent-red)'}} />
              <span className="text-sm" style={{color:'var(--accent-red)'}}>{error}</span>
            </div>
          )}

          {success && (
            <div className="rounded-lg p-6 mb-6 flex items-center gap-3" style={{background:'rgba(34,197,94,0.1)',border:'1px solid rgba(34,197,94,0.3)'}}>
              <CheckCircle className="w-6 h-6 flex-shrink-0" style={{color:'var(--accent-green)'}} />
              <span className="text-sm font-medium" style={{color:'var(--accent-green)'}}>Password reset successful! You can now login with your new password.</span>
            </div>
          )}

          {success ? (
            <Link href="/login" className="btn-primary w-full py-3 inline-block text-center" prefetch={true}>
              Go to Login
            </Link>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="newPassword" className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{color:'var(--text-low)',fontFamily:'Fira Code,monospace'}}>
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{color:'var(--accent-blue)'}} />
                  <input
                    type="password" id="newPassword" required minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg text-sm text-slate-900 outline-none transition"
                    style={{background:'rgba(0,123,255,0.06)',border:'1px solid rgba(0,123,255,0.2)'}}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{color:'var(--text-low)',fontFamily:'Fira Code,monospace'}}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{color:'var(--accent-blue)'}} />
                  <input
                    type="password" id="confirmPassword" required minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg text-sm text-slate-900 outline-none transition"
                    style={{background:'rgba(0,123,255,0.06)',border:'1px solid rgba(0,123,255,0.2)'}}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit" disabled={loading || !token}
                className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{background:'var(--bg-primary)'}}>
        <div className="animate-spin rounded-full h-12 w-12" style={{border:'2px solid rgba(0,123,255,0.15)',borderTopColor:'var(--accent-blue)'}} />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
