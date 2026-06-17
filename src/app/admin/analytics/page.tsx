'use client'

import { useEffect, useMemo, useState } from 'react'
import { DollarSign, ShoppingCart, Package, Users, RefreshCw, AlertTriangle } from 'lucide-react'

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [summary, setSummary] = useState<{ totalRevenue: number; totalOrders: number; avgOrderValue: number } | null>(null)
  const [salesData, setSalesData] = useState<Array<{ month: string; sales: number; orders: number }>>([])
  const [topProducts, setTopProducts] = useState<Array<{ name: string; sales: number; revenue: number }>>([])
  const [byStatus, setByStatus] = useState<Record<string, number>>({})
  const [recentActivity, setRecentActivity] = useState<Array<{ type: string; message: string; time: string }>>([])

  const load = async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch(`/api/admin/analytics?days=${timeRange}`)
      if (res.ok) {
        const data = await res.json()
        setSummary(data.summary ?? null)
        setSalesData(data.salesData || [])
        setTopProducts(data.topProducts || [])
        setByStatus(data.byStatus || {})
        setRecentActivity(data.recentActivity || [])
      } else {
        setError(true)
      }
    } catch (e) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [timeRange])

  const maxSales = useMemo(() => Math.max(1, ...salesData.map(d => d.sales)), [salesData])
  const maxOrders = useMemo(() => Math.max(1, ...salesData.map(d => d.orders)), [salesData])

  const statCards = [
    { label: 'Total Revenue',       value: loading ? null : `KES ${(summary?.totalRevenue || 0).toLocaleString()}`,       icon: DollarSign, iconBg: 'bg-green-100',  iconColor: 'text-green-600',  border: 'border-l-green-500' },
    { label: 'Total Orders',        value: loading ? null : `${summary?.totalOrders || 0}`,                                icon: ShoppingCart,iconBg: 'bg-blue-100',   iconColor: 'text-blue-600',   border: 'border-l-blue-500' },
    { label: 'Avg Order Value',     value: loading ? null : `KES ${(summary?.avgOrderValue || 0).toLocaleString()}`,      icon: Package,    iconBg: 'bg-purple-100', iconColor: 'text-purple-600', border: 'border-l-purple-500' },
    { label: 'Active Period',       value: loading ? null : `Last ${timeRange} days`,                                      icon: Users,      iconBg: 'bg-orange-100', iconColor: 'text-orange-600', border: 'border-l-orange-500' },
  ]

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button onClick={load} disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-800 text-sm">Could not load analytics. Check MongoDB Atlas Network Access (allow <strong>0.0.0.0/0</strong>).</p>
          </div>
          <button onClick={load} className="text-sm text-red-600 font-semibold hover:underline ml-4">Retry</button>
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
                  {s.value === null
                    ? <div className="h-7 w-24 bg-gray-200 rounded animate-pulse" />
                    : <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  }
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.iconBg}`}>
                  <Icon className={`w-6 h-6 ${s.iconColor}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart — fixed height bar chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">Sales Overview</h2>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div><span className="text-gray-600">Revenue (KES)</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-green-500 rounded-sm"></div><span className="text-gray-600">Orders</span></div>
              </div>
            </div>
            {loading ? (
              <div className="h-52 flex items-end gap-2">
                {[60,80,40,90,55,70].map((h,i) => (
                  <div key={i} className="flex-1 bg-gray-200 rounded-t animate-pulse" style={{height:`${h}%`}} />
                ))}
              </div>
            ) : salesData.length === 0 ? (
              <div className="h-52 flex items-center justify-center text-gray-400 text-sm">No sales data for this period</div>
            ) : (
              <div className="relative h-52">
                {/* Y-axis grid lines */}
                {[0,25,50,75,100].map(pct => (
                  <div key={pct} className="absolute w-full border-t border-gray-100" style={{bottom:`${pct}%`}}>
                    <span className="absolute -left-1 -top-2 text-[10px] text-gray-400 -translate-x-full pr-1">
                      {pct === 0 ? '' : Math.round(maxSales * pct / 100).toLocaleString()}
                    </span>
                  </div>
                ))}
                {/* Bars */}
                <div className="absolute inset-0 flex items-end gap-1 pt-2">
                  {salesData.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                      <div className="w-full flex flex-col justify-end" style={{height:'calc(100% - 20px)'}}>
                        <div className="w-full bg-blue-500 rounded-t-sm transition-all" style={{height:`${Math.max(4, Math.round((d.sales / maxSales) * 100))}%`}} title={`KES ${d.sales.toLocaleString()}`} />
                        <div className="w-full bg-green-500 rounded-b-sm" style={{height:`${Math.max(2, Math.round((d.orders / maxOrders) * 100 * 0.3))}%`}} title={`${d.orders} orders`} />
                      </div>
                      <p className="text-[10px] text-gray-500 text-center">{d.month}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">Recent Activity</h2>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3,4].map(i => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}
              </div>
            ) : recentActivity.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No recent activity</p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'order' ? 'bg-blue-100' :
                      activity.type === 'customer' ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      {activity.type === 'order' && <ShoppingCart className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'customer' && <Users className="w-4 h-4 text-green-600" />}
                      {activity.type === 'product' && <Package className="w-4 h-4 text-purple-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{new Date(activity.time).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">Top Products</h2>
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
            <h2 className="text-base font-bold text-gray-900 mb-4">Orders by Status</h2>
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
