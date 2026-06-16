'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        const { getSession } = await import('next-auth/react')
        const session = await getSession()
        if (session?.user?.role === 'ADMIN') {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
        router.refresh()
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{background:'var(--bg-primary)'}}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <p className="section-label mb-3">// ACCESS_PORTAL</p>
          <h1 className="text-4xl font-black text-slate-900" style={{fontFamily:'Montserrat,sans-serif'}}>Welcome Back</h1>
          <p className="mt-2" style={{color:'var(--text-low)'}}>Sign in to your account</p>
        </div>

        <div className="rounded-xl p-8 glass" style={{border:'1px solid rgba(0,123,255,0.2)'}}>
          {error && (
            <div className="rounded-lg p-4 mb-6 flex items-center gap-2" style={{background:'rgba(255,69,0,0.1)',border:'1px solid rgba(255,69,0,0.3)'}}>
              <AlertCircle className="w-5 h-5 flex-shrink-0" style={{color:'var(--accent-red)'}} />
              <span className="text-sm" style={{color:'var(--accent-red)'}}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{color:'var(--text-low)',fontFamily:'Fira Code,monospace'}}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{color:'var(--accent-blue)'}} />
                <input
                  type="email" id="email" required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-sm text-slate-900 outline-none transition"
                  style={{background:'rgba(0,123,255,0.06)',border:'1px solid rgba(0,123,255,0.2)'}}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{color:'var(--text-low)',fontFamily:'Fira Code,monospace'}}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{color:'var(--accent-blue)'}} />
                <input
                  type="password" id="password" required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-sm text-slate-900 outline-none transition"
                  style={{background:'rgba(0,123,255,0.06)',border:'1px solid rgba(0,123,255,0.2)'}}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="h-4 w-4 rounded" style={{accentColor:'var(--accent-blue)'}} />
                <label htmlFor="remember" className="text-sm" style={{color:'var(--text-low)'}}>Remember me</label>
              </div>
              <Link href="/forgot-password" className="text-sm transition" style={{color:'var(--accent-blue)'}}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit" disabled={loading}
              className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p style={{color:'var(--text-low)',fontSize:'0.875rem'}}>
              Don't have an account?{' '}
              <Link href="/register" className="font-semibold transition" style={{color:'var(--accent-green)'}}>
                Register
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm transition" style={{color:'var(--text-low)',fontFamily:'Fira Code,monospace'}}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
