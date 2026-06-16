'use client'

import { useState, useEffect } from 'react'
import { Search, Mail, Phone, MapPin, Calendar, ShoppingCart, Users } from 'lucide-react'
import Link from 'next/link'
import Loading from '@/components/Loading'

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [customers, setCustomers] = useState<any[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ search: searchQuery, limit: '20' })
      const res = await fetch(`/api/admin/customers?${params}`)
      if (res.ok) {
        const data = await res.json()
        setCustomers(data.customers || [])
        setPagination(data.pagination || null)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [searchQuery])

  if (loading) return <Loading />

  const totalSpentAll = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0)
  const avgValue = customers.length > 0 ? Math.round(totalSpentAll / customers.length) : 0

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Customers</h1>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Customers', value: pagination?.total || 0, color: 'text-gray-900' },
            { label: 'Shown', value: customers.length, color: 'text-blue-600' },
            { label: 'Total Spent', value: `KES ${totalSpentAll.toLocaleString()}`, color: 'text-green-600' },
            { label: 'Avg. Value', value: `KES ${avgValue.toLocaleString()}`, color: 'text-purple-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-gray-500 text-sm">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Customer</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Contact</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Location</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Orders</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Total Spent</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Joined</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-bold text-sm">
                            {(customer.name || customer.email || '?').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{customer.name || '—'}</p>
                          <p className="text-sm text-gray-500">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        {customer.phone && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{customer.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{customer.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {customer.city ? (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="text-sm">{customer.city}</span>
                        </div>
                      ) : <span className="text-gray-400 text-sm">—</span>}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span className="font-medium">{customer._count?.orders || 0}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-900">
                      KES {(customer.totalSpent || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-sm">{new Date(customer.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {customers.length === 0 && (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No customers yet</p>
              <p className="text-gray-400 text-sm mt-1">Registered customers will appear here</p>
            </div>
          )}
        </div>
    </div>
  )
}
