'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, Phone, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Registration failed')
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {background:'rgba(0,123,255,0.06)',border:'1px solid rgba(0,123,255,0.2)'}
  const fields = [
    {id:'name',label:'Full Name',type:'text',icon:User,key:'name',placeholder:'John Doe'},
    {id:'email',label:'Email Address',type:'email',icon:Mail,key:'email',placeholder:'you@example.com'},
    {id:'phone',label:'Phone Number',type:'tel',icon:Phone,key:'phone',placeholder:'07XX XXX XXX'},
    {id:'password',label:'Password',type:'password',icon:Lock,key:'password',placeholder:'••••••••'},
    {id:'confirmPassword',label:'Confirm Password',type:'password',icon:Lock,key:'confirmPassword',placeholder:'••••••••'},
  ]

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{background:'var(--bg-primary)'}}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-slate-900" style={{fontFamily:'Montserrat,sans-serif'}}>Create Account</h1>
          <p className="mt-2" style={{color:'var(--text-low)'}}>Join Majesty Compucare Limited</p>
        </div>

        <div className="rounded-xl p-8 glass" style={{border:'1px solid rgba(0,123,255,0.2)'}}>
          {error && (
            <div className="rounded-lg p-4 mb-5 flex items-center gap-2" style={{background:'rgba(255,69,0,0.1)',border:'1px solid rgba(255,69,0,0.3)'}}>
              <AlertCircle className="w-5 h-5 flex-shrink-0" style={{color:'var(--accent-red)'}} />
              <span className="text-sm" style={{color:'var(--accent-red)'}}>{error}</span>
            </div>
          )}

          {success && (
            <div className="rounded-lg p-4 mb-5 flex items-center gap-2" style={{background:'rgba(0,255,0,0.08)',border:'1px solid rgba(0,255,0,0.3)'}}>
              <CheckCircle className="w-5 h-5 flex-shrink-0" style={{color:'var(--accent-green)'}} />
              <span className="text-sm" style={{color:'var(--accent-green)'}}>Registration successful! Redirecting to login...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({id,label,type,icon:Icon,key,placeholder}) => (
              <div key={id}>
                <label htmlFor={id} className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{color:'var(--text-low)',fontFamily:'Fira Code,monospace'}}>
                  {label}
                </label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{color:'var(--accent-blue)'}} />
                  <input
                    type={type} id={id} required
                    value={(formData as any)[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-lg text-sm text-slate-900 outline-none transition"
                    style={inputStyle}
                    placeholder={placeholder}
                  />
                </div>
              </div>
            ))}

            <button
              type="submit" disabled={loading || success}
              className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p style={{color:'var(--text-low)',fontSize:'0.875rem'}}>
              Already have an account?{' '}
              <Link href="/login" className="font-semibold transition" style={{color:'var(--accent-green)'}}>
                Sign In
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
