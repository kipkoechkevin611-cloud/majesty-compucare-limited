'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { TrendingUp, DollarSign, ShoppingBag, AlertTriangle, Package, Users } from 'lucide-react'
import Link from 'next/link'
import Loading from '@/components/Loading'
import { notFound } from 'next/navigation'

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchStats()
    }
  }, [status, session])

  if (status === 'loading' || loading) {
    return <Loading />
  }

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  if (session?.user?.role !== 'ADMIN') {
    notFound()
  }

  const statsData = stats ? [
    { label: 'Total Revenue', value: `KES ${(stats.totalRevenue || 0).toLocaleString()}`, change: '+12%', icon: DollarSign, color: 'green' },
    { label: 'Total Orders', value: stats.totalOrders || 0, change: '+8%', icon: ShoppingBag, color: 'blue' },
    { label: 'Total Products', value: stats.totalProducts || 0, change: '+3%', icon: Package, color: 'purple' },
    { label: 'Total Customers', value: stats.totalCustomers || 0, change: '+15%', icon: Users, color: 'orange' },
  ] : []

  const recentOrders = stats?.recentOrders || []

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h2>

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
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
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
