'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Search, Filter, Eye, Package, CheckCircle, XCircle, Clock, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import Loading from '@/components/Loading'

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-yellow-100 text-yellow-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-orange-100 text-orange-800',
}

export default function AdminOrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [orders, setOrders] = useState<any[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [statusCounts, setStatusCounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ search: searchQuery, status: statusFilter, limit: '20' })
      const res = await fetch(`/api/admin/orders?${params}`)
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders || [])
        setPagination(data.pagination || null)
        setStatusCounts(data.statusCounts || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') fetchOrders()
  }, [status, session, searchQuery, statusFilter])

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) fetchOrders()
    } catch (e) {
      console.error(e)
    } finally {
      setUpdatingId(null)
    }
  }

  if (status === 'loading' || loading) return <Loading />
  if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
    router.push('/admin')
    return null
  }

  const countFor = (s: string) => statusCounts.find((c: any) => c.status === s)?._count?.status || 0
  const total = pagination?.total || 0

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders</h1>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Total', value: total, color: 'text-gray-900' },
            { label: 'Pending', value: countFor('PENDING'), color: 'text-gray-600' },
            { label: 'Processing', value: countFor('PROCESSING'), color: 'text-yellow-600' },
            { label: 'Shipped', value: countFor('SHIPPED'), color: 'text-purple-600' },
            { label: 'Delivered', value: countFor('DELIVERED'), color: 'text-green-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-gray-500 text-sm">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          {/* Filters */}
          <div className="p-6 border-b flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders, customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Order #</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Customer</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Items</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Total</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Payment</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Date</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Update</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Details</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-blue-600">{order.orderNumber}</td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-900">{order.user?.name || 'N/A'}</p>
                      <p className="text-sm text-gray-500">{order.user?.email}</p>
                      {order.user?.phone && <p className="text-sm text-gray-500">{order.user.phone}</p>}
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-sm">{order.items?.length || 0} item(s)</td>
                    <td className="py-4 px-6 font-medium text-gray-900">KES {order.totalAmount?.toLocaleString()}</td>
                    <td className="py-4 px-6 text-gray-600 text-sm">{order.paymentMethod}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        disabled={updatingId === order.id}
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="REFUNDED">Refunded</option>
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 rounded-lg text-sm font-semibold border border-gray-300 hover:bg-gray-50 transition flex items-center gap-1"
                        aria-label="View order details"
                      >
                        <Eye className="w-4 h-4 text-gray-600" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No orders yet</p>
              <p className="text-gray-400 text-sm mt-1">Orders from customers will appear here</p>
            </div>
          )}
        </div>
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl mx-4">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Order {selectedOrder.orderNumber}</h2>
                    <p className="text-sm text-gray-500">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700">Close</button>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-700"><span className="font-medium">Customer:</span> {selectedOrder.user?.name || 'N/A'} ({selectedOrder.user?.email})</p>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-2 px-4 text-sm font-semibold text-gray-600">Product</th>
                        <th className="text-left py-2 px-4 text-sm font-semibold text-gray-600">Qty</th>
                        <th className="text-left py-2 px-4 text-sm font-semibold text-gray-600">Price</th>
                        <th className="text-left py-2 px-4 text-sm font-semibold text-gray-600">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map((item: any) => (
                        <tr key={item.id} className="border-t">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {item.product?.images?.[0] ? (
                                <img src={item.product.images[0]} alt={item.product.name} className="w-10 h-10 rounded object-cover" />
                              ) : (
                                <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                                  <Package className="w-5 h-5 text-gray-400" />
                                </div>
                              )}
                              <span className="text-sm text-gray-900">{item.product?.name || 'Product'}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700">{item.quantity}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">KES {Number(item.price || 0).toLocaleString()}</td>
                          <td className="py-3 px-4 text-sm text-gray-900 font-medium">KES {Number((item.price || 0) * item.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end mt-4">
                  <p className="text-gray-900 font-semibold">Total: KES {Number(selectedOrder.totalAmount || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}
