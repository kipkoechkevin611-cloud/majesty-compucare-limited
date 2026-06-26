'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, ShoppingCart, User, LogOut, LayoutDashboard, Shield, ChevronDown, Monitor, Printer, Video, Wifi, Smartphone, Package, ChevronRight, ArrowRight } from 'lucide-react'
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

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  laptops: Monitor,
  desktops: Monitor,
  printers: Printer,
  'cctv-systems': Video,
  networking: Wifi,
  accessories: Smartphone,
  software: Package,
  electronics: Package,
  'phone-accessories': Smartphone,
  stationery: Package,
  'toners-ink': Printer,
}

const laptopBrands = [
  { name: 'HP', slug: 'hp', image: 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=200&h=150&fit=crop' },
  { name: 'Dell', slug: 'dell', image: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=200&h=150&fit=crop' },
  { name: 'Lenovo', slug: 'lenovo', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&h=150&fit=crop' },
  { name: 'Asus', slug: 'asus', image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=200&h=150&fit=crop' },
  { name: 'Acer', slug: 'acer', image: 'https://images.unsplash.com/photo-1527011046414-4781f1f94f0c?w=200&h=150&fit=crop' },
  { name: 'Apple', slug: 'apple', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=200&h=150&fit=crop' },
]

export default function Navigation() {
  const { getCartCount } = useCart()
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const categoryTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleCategoryEnter = (slug: string) => {
    if (categoryTimerRef.current) clearTimeout(categoryTimerRef.current)
    setHoveredCategory(slug)
  }

  const handleCategoryLeave = () => {
    categoryTimerRef.current = setTimeout(() => setHoveredCategory(null), 150)
  }

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
              <p className="text-[10px] text-gray-500" style={{fontFamily:'Fira Code,monospace'}}>// Tech Partner Since 2016</p>
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
                  prefetch={href === '/' ? true : undefined}
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
        <div className="relative border-b border-blue-200 bg-white" style={{boxShadow:'0 2px 10px rgba(0,0,0,0.04)'}}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
              <span className="hidden lg:flex items-center gap-1 text-xs font-bold text-blue-900 uppercase tracking-wider flex-shrink-0 mr-2" style={{fontFamily:'Fira Code,monospace'}}>
                Categories
              </span>
              {categories.map((cat: any) => {
                const Icon = categoryIcons[cat.slug] || Package
                const isLaptops = cat.slug === 'laptops'
                return (
                  <div
                    key={cat.id}
                    className="relative group"
                    onMouseEnter={() => handleCategoryEnter(cat.slug)}
                    onMouseLeave={handleCategoryLeave}
                  >
                    <Link
                      href={`/products?category=${cat.slug}`}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 border border-transparent ${
                        hoveredCategory === cat.slug
                          ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-blue-700'
                      }`}
                      style={{fontFamily:'Montserrat,sans-serif'}}
                    >
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="whitespace-nowrap">{cat.name}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${hoveredCategory === cat.slug ? 'rotate-180' : ''}`} />
                    </Link>

                    {/* Dropdown / Mega Menu */}
                    {hoveredCategory === cat.slug && (
                      <div className="absolute top-full left-0 z-50 pt-2 animate-fade-slide-up" style={{ animationDelay: '0ms', animationDuration: '0.2s' }}>
                        {isLaptops ? (
                          <div className="w-[min(720px,calc(100vw-48px))] rounded-xl bg-white border border-slate-200 shadow-2xl overflow-hidden p-5">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                                  <Monitor className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-900" style={{fontFamily:'Montserrat,sans-serif'}}>Laptops</p>
                                  <p className="text-xs text-slate-500">Genuine laptops for work, school & gaming</p>
                                </div>
                              </div>
                              <Link href="/products?category=laptops"
                                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all hover:shadow-lg">
                                Shop All Laptops <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              {laptopBrands.map((brand) => (
                                <Link key={brand.slug} href={`/products?category=laptops&search=${brand.name}`}
                                  className="group/brand flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-blue-300 hover:bg-blue-50 transition-all">
                                  <div className="w-16 h-12 rounded-md overflow-hidden bg-slate-100 flex-shrink-0">
                                    <img src={brand.image} alt={brand.name} className="w-full h-full object-cover group-hover/brand:scale-105 transition-transform duration-300" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-slate-900 group-hover/brand:text-blue-700 transition-colors">{brand.name}</p>
                                    <p className="text-[10px] text-slate-500">Shop {brand.name} laptops</p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100">
                              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-white border border-blue-100">
                                <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=120&h=80&fit=crop" alt="Featured laptop"
                                  className="w-28 h-16 object-cover rounded-md" />
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-slate-900">Featured: Business & Student Laptops</p>
                                  <p className="text-xs text-slate-500 mt-0.5">Reliable, budget-friendly options with warranty.</p>
                                </div>
                                <Link href="/products?category=laptops"
                                  className="px-4 py-2 rounded-lg text-xs font-bold text-blue-700 border border-blue-200 hover:bg-blue-100 transition">
                                  Explore
                                </Link>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="w-64 rounded-xl bg-white border border-slate-200 shadow-2xl overflow-hidden p-4">
                            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
                              <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900" style={{fontFamily:'Montserrat,sans-serif'}}>{cat.name}</p>
                                <p className="text-xs text-slate-500">Browse {cat.name.toLowerCase()}</p>
                              </div>
                            </div>
                            <Link href={`/products?category=${cat.slug}`}
                              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                              View all {cat.name} <ChevronRight className="w-4 h-4" />
                            </Link>
                            <Link href="/products"
                              className="mt-2 flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                              Browse all products <ChevronRight className="w-4 h-4" />
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
