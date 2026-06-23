'use client'

import { signOut, useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, BarChart3, LogOut, Folder, Loader2 } from 'lucide-react'
import Link from 'next/link'

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, href: '/admin' },
  { id: 'products', label: 'Products', icon: Package, href: '/admin/products' },
  { id: 'categories', label: 'Categories', icon: Folder, href: '/admin/categories' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, href: '/admin/orders' },
  { id: 'customers', label: 'Customers', icon: Users, href: '/admin/customers' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/login')
    }
  }, [status, session, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-sm text-gray-600">Checking access...</p>
        </div>
      </div>
    )
  }

  if (session?.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition">Admin Dashboard</Link>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => signOut({ callbackUrl: '/login' })} className="text-red-600 hover:text-red-700 flex items-center space-x-2">
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
