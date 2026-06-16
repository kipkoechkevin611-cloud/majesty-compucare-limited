'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Search, AlertTriangle, Package, TrendingUp, TrendingDown, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import Loading from '@/components/Loading'

export default function AdminInventoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [stockFilter, setStockFilter] = useState('all')

  if (status === 'loading') {
    return <Loading />
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
    router.push('/admin')
    return null
  }

  const mockInventory = [
    { id: 1, name: 'HP Laptop 15.6"', category: 'laptops', stock: 15, minStock: 5, maxStock: 50, status: 'In Stock', lastRestocked: '2024-01-10' },
    { id: 2, name: 'Dell Desktop Tower', category: 'laptops', stock: 3, minStock: 5, maxStock: 30, status: 'Low Stock', lastRestocked: '2024-01-05' },
    { id: 3, name: 'Epson L3250 Printer', category: 'printers', stock: 20, minStock: 10, maxStock: 100, status: 'In Stock', lastRestocked: '2024-01-15' },
    { id: 4, name: 'Canon PIXMA G3010', category: 'printers', stock: 0, minStock: 10, maxStock: 50, status: 'Out of Stock', lastRestocked: '2024-01-01' },
    { id: 5, name: 'Hikvision 4MP Camera', category: 'cctv', stock: 30, minStock: 15, maxStock: 100, status: 'In Stock', lastRestocked: '2024-01-18' },
    { id: 6, name: 'TP-Link Router', category: 'networking', stock: 25, minStock: 20, maxStock: 80, status: 'In Stock', lastRestocked: '2024-01-20' },
    { id: 7, name: 'Wireless Mouse', category: 'accessories', stock: 8, minStock: 25, maxStock: 200, status: 'Low Stock', lastRestocked: '2024-01-12' },
    { id: 8, name: 'USB Keyboard', category: 'accessories', stock: 45, minStock: 30, maxStock: 150, status: 'In Stock', lastRestocked: '2024-01-22' },
  ]

  const filteredInventory = mockInventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStock = stockFilter === 'all' ||
      (stockFilter === 'low' && item.stock <= item.minStock) ||
      (stockFilter === 'out' && item.stock === 0) ||
      (stockFilter === 'in' && item.stock > item.minStock)
    return matchesSearch && matchesStock
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800'
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800'
      case 'Out of Stock': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStockPercentage = (stock: number, maxStock: number) => {
    return Math.min((stock / maxStock) * 100, 100)
  }

  const getStockColor = (stock: number, minStock: number) => {
    if (stock === 0) return 'bg-red-500'
    if (stock <= minStock) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add Stock</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Inventory Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <Package className="w-8 h-8 text-blue-600" />
              <span className="text-green-600 text-sm font-medium flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +5%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{mockInventory.length}</p>
            <p className="text-gray-600 text-sm">Total Products</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <Package className="w-8 h-8 text-green-600" />
              <span className="text-green-600 text-sm font-medium flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{mockInventory.reduce((sum, i) => sum + i.stock, 0)}</p>
            <p className="text-gray-600 text-sm">Total Stock</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
              <span className="text-red-600 text-sm font-medium flex items-center">
                <TrendingDown className="w-4 h-4 mr-1" />
                -2
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{mockInventory.filter(i => i.stock <= i.minStock).length}</p>
            <p className="text-gray-600 text-sm">Low Stock Items</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <span className="text-red-600 text-sm font-medium">Critical</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{mockInventory.filter(i => i.stock === 0).length}</p>
            <p className="text-gray-600 text-sm">Out of Stock</p>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-xl shadow-sm">
          {/* Filters */}
          <div className="p-6 border-b flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Stock Levels</option>
              <option value="in">In Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Product</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Category</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Stock Level</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Min/Max</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Last Restocked</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-400" />
                        </div>
                        <span className="font-medium text-gray-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 capitalize">{item.category}</td>
                    <td className="py-4 px-6">
                      <div className="w-full max-w-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{item.stock} units</span>
                          <span className="text-xs text-gray-500">{getStockPercentage(item.stock, item.maxStock)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getStockColor(item.stock, item.minStock)}`}
                            style={{ width: `${getStockPercentage(item.stock, item.maxStock)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      <span className="text-sm">{item.minStock} / {item.maxStock}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{item.lastRestocked}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition" title="Increase Stock">
                          <Plus className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition" title="Decrease Stock">
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredInventory.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No inventory items found</p>
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        {mockInventory.filter(i => i.stock <= i.minStock).length > 0 && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-yellow-900 mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2" />
              Low Stock Alerts
            </h2>
            <div className="space-y-3">
              {mockInventory.filter(i => i.stock <= i.minStock).map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-white rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">Current: {item.stock} | Minimum: {item.minStock}</p>
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                    Restock
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
