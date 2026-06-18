'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, ShoppingCart, User, LogOut, LayoutDashboard, Shield, ChevronDown } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useSession, signOut } from 'next-auth/react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/products', label: 'Products' },
  { href: '/services', label: 'Services' },
  { href: '/shop', label: 'Shop' },
  { href: '/contact', label: 'Contact' },
]

export default function Navigation() {
  const { getCartCount } = useCart()
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.ok ? res.json() : [])
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const cartCount = getCartCount()

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group flex-shrink-0">
            <div className="relative">
              <img src="/logo.jpeg" alt="Majesty Compucare" className="h-10 w-auto object-contain rounded-lg" />
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{boxShadow:'0 0 12px rgba(59,130,246,0.35)'}} />
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200" style={{fontFamily:'Montserrat,sans-serif'}}>Majesty Compucare</p>
              <p className="text-[10px] text-gray-500" style={{fontFamily:'Fira Code,monospace'}}>// Tech Partner Since 2014</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href || (href !== '/' && pathname.startsWith(href))
              return (
                <Link
                  key={href}
                  href={href}
                  className={`nav-link px-4 py-2 text-gray-700 hover:text-blue-600 ${
                    active ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : ''
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </div>

          {/* Right: Cart + User */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/cart" className="relative p-2 rounded-lg text-gray-600 hover:text-blue-600 transition-colors" aria-label="Cart">
              <ShoppingCart className="w-5 h-5" />
              <span
                className={`absolute -top-1 -right-1 text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-bold transition ${
                  cartCount > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'
                }`}
                style={{background:'var(--accent-blue)',color:'#fff',boxShadow:'0 0 8px rgba(0,123,255,0.7)'}}
                aria-hidden={cartCount === 0}
              >
                {cartCount}
              </span>
            </Link>

            {session ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg transition border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-blue-700 bg-blue-100">
                    {(session.user?.name || session.user?.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-900 max-w-[90px] truncate">{session.user?.name || 'Account'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl py-1 z-50 bg-white border border-gray-200 shadow-lg">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-xs uppercase tracking-wide text-gray-500 mb-0.5">Signed in as</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{session.user?.email}</p>
                    </div>
                    <Link href="/dashboard" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition">
                      <LayoutDashboard className="w-4 h-4" /><span>My Dashboard</span>
                    </Link>
                    {session.user?.role === 'ADMIN' && (
                      <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition">
                        <Shield className="w-4 h-4" /><span>Admin Panel</span>
                      </Link>
                    )}
                    <div className="border-t border-gray-100 mt-1">
                      <button onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: '/' }) }}
                        className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition">
                        <LogOut className="w-4 h-4" /><span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-blue-600">Sign In</Link>
                <Link href="/register" className="text-sm px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center space-x-2">
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600" aria-label="Cart">
              <ShoppingCart className="w-5 h-5" />
              <span
                className={`absolute -top-1 -right-1 text-[10px] rounded-full w-[18px] h-[18px] flex items-center justify-center font-bold transition ${
                  cartCount > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'
                }`}
                style={{background:'var(--accent-blue)',color:'#fff',boxShadow:'0 0 8px rgba(0,123,255,0.7)'}}
                aria-hidden={cartCount === 0}
              >
                {cartCount}
              </span>
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600 hover:text-blue-600 transition" aria-label="Toggle menu">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href || (href !== '/' && pathname.startsWith(href))
              return (
                <Link key={href} href={href} onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg font-semibold text-sm transition ${
                    active ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`} style={{fontFamily:'Montserrat,sans-serif'}}>
                  {label}
                </Link>
              )
            })}
            <div className="pt-3 mt-2 border-t border-gray-200 space-y-1">
              {session ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition text-sm">
                    <LayoutDashboard className="w-4 h-4" /><span>My Dashboard</span>
                  </Link>
                  {session.user?.role === 'ADMIN' && (
                    <Link href="/admin" onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition text-sm">
                      <Shield className="w-4 h-4" /><span>Admin Panel</span>
                    </Link>
                  )}
                  <button onClick={() => { setIsOpen(false); signOut({ callbackUrl: '/' }) }}
                    className="flex items-center space-x-3 w-full px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition text-sm">
                    <LogOut className="w-4 h-4" /><span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="flex space-x-3 px-2 pt-1">
                  <Link href="/login" onClick={() => setIsOpen(false)}
                    className="flex-1 text-center py-2.5 rounded-lg text-sm font-semibold text-gray-700 border border-gray-300 hover:border-blue-500 hover:text-gray-900 transition">
                    Sign In
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)} className="flex-1 text-center py-2.5 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 transition">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Category Strip */}
      {categories.length > 0 && (
        <div className="border-b border-gray-100 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 py-2 overflow-x-auto scrollbar-hide">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex-shrink-0" style={{fontFamily:'Fira Code,monospace'}}>Categories:</span>
              {categories.map((cat: any) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="flex-shrink-0 px-3 py-1 rounded-md text-xs font-medium transition border border-gray-200 bg-white text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:shadow-sm"
                  style={{fontFamily:'Montserrat,sans-serif'}}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
