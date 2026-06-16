'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, ShoppingBag, AlertTriangle, Package, Users, RefreshCw } from 'lucide-react'
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

  const statsData = [
    { label: 'Total Revenue', value: loading ? '—' : `KES ${(stats?.totalRevenue || 0).toLocaleString()}`, change: '+12%', icon: DollarSign, color: 'green' },
    { label: 'Total Orders', value: loading ? '—' : (stats?.totalOrders || 0), change: '+8%', icon: ShoppingBag, color: 'blue' },
    { label: 'Total Products', value: loading ? '—' : (stats?.totalProducts || 0), change: '+3%', icon: Package, color: 'purple' },
    { label: 'Total Customers', value: loading ? '—' : (stats?.totalCustomers || 0), change: '+15%', icon: Users, color: 'orange' },
  ]

  const recentOrders = stats?.recentOrders || []

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <button onClick={fetchStats} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-800 text-sm">Could not connect to database. Check MongoDB Atlas Network Access (allow <strong>0.0.0.0/0</strong>).</p>
          </div>
          <button onClick={fetchStats} className="text-sm text-red-600 font-semibold hover:underline ml-4">Retry</button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span className="text-green-600 text-sm font-medium flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {stat.change}
                </span>
              </div>
              {loading
                ? <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mb-1" />
                : <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              }
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Low Stock Alert */}
      {stats?.lowStockProducts > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 flex items-center">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
          <p className="text-yellow-800">
            <strong>Low Stock Alert:</strong> {stats.lowStockProducts} products have low stock (less than 5 units).
          </p>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
          <Link href="/admin/orders" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Total</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order: any) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{order.orderNumber}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{order.user?.name || order.user?.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">KES {order.totalAmount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">No recent orders</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
