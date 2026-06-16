'use client'

import { useState, useEffect } from 'react'
import { DollarSign, ShoppingBag, AlertTriangle, Package, Users, RefreshCw, Plus, Eye, BarChart3, Settings, Folder, CheckCircle, Clock, Truck, XCircle, TrendingUp, MapPin, Phone, Mail } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchStats = async () => {
    setLoading(true)
    setError(false)
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        setError(true)
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const recentOrders = stats?.recentOrders || []

  const statCards = [
    { label: 'Total Revenue',  value: `KES ${(stats?.totalRevenue || 0).toLocaleString()}`,  icon: DollarSign, iconBg: 'bg-green-100',  iconColor: 'text-green-600',  border: 'border-l-green-500' },
    { label: 'Total Orders',   value: stats?.totalOrders   || 0,                              icon: ShoppingBag,iconBg: 'bg-blue-100',   iconColor: 'text-blue-600',   border: 'border-l-blue-500' },
    { label: 'Total Products', value: stats?.totalProducts  || 0,                             icon: Package,    iconBg: 'bg-purple-100', iconColor: 'text-purple-600', border: 'border-l-purple-500' },
    { label: 'Customers',      value: stats?.totalCustomers || 0,                             icon: Users,      iconBg: 'bg-orange-100', iconColor: 'text-orange-600', border: 'border-l-orange-500' },
  ]

  const quickActions = [
    { label: 'Add Product',  href: '/admin/products/new', icon: Plus,     bg: 'bg-blue-600 hover:bg-blue-700' },
    { label: 'View Orders',  href: '/admin/orders',       icon: Eye,      bg: 'bg-green-600 hover:bg-green-700' },
    { label: 'Analytics',    href: '/admin/analytics',    icon: BarChart3,bg: 'bg-purple-600 hover:bg-purple-700' },
    { label: 'Categories',   href: '/admin/categories',   icon: Folder,   bg: 'bg-orange-600 hover:bg-orange-700' },
    { label: 'Customers',    href: '/admin/customers',    icon: Users,    bg: 'bg-teal-600 hover:bg-teal-700' },
    { label: 'Settings',     href: '/admin/settings',     icon: Settings, bg: 'bg-gray-600 hover:bg-gray-700' },
  ]

  const statusStyle: Record<string, string> = {
    DELIVERED:  'bg-green-100 text-green-800',
    PROCESSING: 'bg-yellow-100 text-yellow-800',
    SHIPPED:    'bg-blue-100 text-blue-800',
    CONFIRMED:  'bg-indigo-100 text-indigo-800',
    CANCELLED:  'bg-red-100 text-red-800',
    REFUNDED:   'bg-orange-100 text-orange-800',
    PENDING:    'bg-gray-100 text-gray-700',
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-sm text-gray-500 mt-0.5">Majesty Compucare Limited &mdash; Nakuru, Kenya</p>
        </div>
        <button onClick={fetchStats} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-800 text-sm">Could not connect to database. In MongoDB Atlas &rarr; Network Access, add IP <strong>0.0.0.0/0</strong> to allow all connections.</p>
          </div>
          <button onClick={fetchStats} className="text-sm text-red-600 font-semibold hover:underline ml-4 flex-shrink-0">Retry</button>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className={`bg-white rounded-xl shadow-sm p-5 border-l-4 ${s.border}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{s.label}</p>
                  {loading
                    ? <div className="h-7 w-20 bg-gray-200 rounded animate-pulse" />
                    : <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  }
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.iconBg}`}>
                  <Icon className={`w-6 h-6 ${s.iconColor}`} />
                </div>
              </div>
              {!loading && (
                <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3 h-3" /> Live data from database
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Low Stock + Quick Actions row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickActions.map((a) => {
              const Icon = a.icon
              return (
                <Link key={a.label} href={a.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white transition ${a.bg}`}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {a.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Store Info */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-base font-bold text-gray-900 mb-4">Store Info</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Nyakinyua Building, Kangei, Nakuru</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="text-gray-700">0716 000 367 / 0722 717 846</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-gray-700 text-xs">sales.compucare111@gmail.com</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link href="/" target="_blank"
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
              <Eye className="w-4 h-4" /> View Live Store
            </Link>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {!loading && stats?.lowStockProducts > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <p className="text-yellow-800 text-sm">
              <strong>Low Stock Alert:</strong> {stats.lowStockProducts} product{stats.lowStockProducts > 1 ? 's have' : ' has'} fewer than 5 units remaining.
            </p>
          </div>
          <Link href="/admin/products" className="text-sm text-yellow-700 font-semibold hover:underline flex-shrink-0 ml-4">Manage &rarr;</Link>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">Recent Orders</h3>
          <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            View All <span>&rarr;</span>
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? recentOrders.map((order: any) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="py-3 px-3 text-sm font-mono text-blue-700">{order.orderNumber}</td>
                    <td className="py-3 px-3 text-sm text-gray-700">{order.user?.name || order.user?.email || '—'}</td>
                    <td className="py-3 px-3 text-sm font-semibold text-gray-900">KES {(order.totalAmount || 0).toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[order.status] || 'bg-gray-100 text-gray-700'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-KE', { day:'numeric', month:'short', year:'numeric' })}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-400 text-sm">No orders yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}
