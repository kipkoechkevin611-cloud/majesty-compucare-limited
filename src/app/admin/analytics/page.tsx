'use client'

import { useEffect, useMemo, useState } from 'react'
import { BarChart3, TrendingUp, DollarSign, ShoppingCart, Package, Users, Calendar, Download } from 'lucide-react'
import Link from 'next/link'
import Loading from '@/components/Loading'

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30')
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<{ totalRevenue: number; totalOrders: number; avgOrderValue: number } | null>(null)
  const [salesData, setSalesData] = useState<Array<{ month: string; sales: number; orders: number }>>([])
  const [topProducts, setTopProducts] = useState<Array<{ name: string; sales: number; revenue: number }>>([])
  const [byStatus, setByStatus] = useState<Record<string, number>>({})
  const [recentActivity, setRecentActivity] = useState<Array<{ type: string; message: string; time: string }>>([])

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      setLoading(true)
      try {
        const res = await fetch(`/api/admin/analytics?days=${timeRange}`, { signal: controller.signal })
        if (res.ok) {
          const data = await res.json()
          setSummary(data.summary)
          setSalesData(data.salesData || [])
          setTopProducts(data.topProducts || [])
          setByStatus(data.byStatus || {})
          setRecentActivity(data.recentActivity || [])
        }
      } catch (e) {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [timeRange])

  if (loading) return <Loading />

  const stats = summary ? [
    { label: 'Total Revenue', value: `KES ${summary.totalRevenue.toLocaleString()}`, change: '', icon: DollarSign, color: 'green' },
    { label: 'Total Orders', value: `${summary.totalOrders}`, change: '', icon: ShoppingCart, color: 'blue' },
    { label: 'Average Order Value', value: `KES ${summary.avgOrderValue.toLocaleString()}`, change: '', icon: Package, color: 'purple' },
  ] : []

  const maxSales = useMemo(() => Math.max(1, ...salesData.map(d => d.sales)), [salesData])
  const maxOrders = useMemo(() => Math.max(1, ...salesData.map(d => d.orders)), [salesData])

  if (loading) return <Loading />

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <span className="text-gray-500 text-xs font-medium">Last {timeRange} days</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Sales Overview</h2>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-600">Sales</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="text-gray-600">Orders</span>
                </div>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between space-x-4">
              {salesData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col space-y-1">
                    <div
                      className="w-full bg-blue-600 rounded-t"
                      style={{ height: `${(data.sales / maxSales) * 100}%`, minHeight: '10px' }}
                    ></div>
                    <div
                      className="w-full bg-green-600 rounded-b"
                      style={{ height: `${(data.orders / maxOrders) * 100}%`, minHeight: '6px' }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{data.month}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${activity.type === 'order' ? 'bg-blue-100' :
                    activity.type === 'customer' ? 'bg-green-100' :
                      'bg-purple-100'
                    }`}>
                    {activity.type === 'order' && <ShoppingCart className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'customer' && <Users className="w-4 h-4 text-green-600" />}
                    {activity.type === 'product' && <Package className="w-4 h-4 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{new Date(activity.time).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Top Products</h2>
            <div className="space-y-4">
              {topProducts.length > 0 ? topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.sales} sold</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">KES {product.revenue.toLocaleString()}</p>
                </div>
              )) : (
                <p className="text-gray-500">No products found for this period.</p>
              )}
            </div>
          </div>

          {/* Orders by Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Orders by Status</h2>
            <div className="space-y-4">
              {Object.keys(byStatus).length > 0 ? (
                Object.entries(byStatus).map(([status, count]) => {
                  const total = Object.values(byStatus).reduce((a, b) => a + b, 0) || 1
                  const percentage = Math.round((count / total) * 100)
                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">{status}</span>
                        <span className="text-sm font-medium text-gray-900">{count} orders</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-gray-500">No orders in this period.</p>
              )}
            </div>
          </div>
        </div>
    </div>
  )
}
