'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, Package, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Loading from '@/components/Loading'

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [products, setProducts] = useState<any[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        category: categoryFilter,
        status: statusFilter,
        page: page.toString(),
        limit: '10',
      })

      const response = await fetch(`/api/admin/products?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
        setPagination(data.pagination || null)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [searchQuery, categoryFilter, statusFilter, page])

  const handleDelete = async (product: any) => {
    setSelectedProduct(product)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!selectedProduct) return

    try {
      setDeleting(true)
      setDeleteError(null)
      const response = await fetch(`/api/admin/products/${selectedProduct.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ softDelete: false }),
      })

      if (response.ok) {
        setShowDeleteModal(false)
        setSelectedProduct(null)
        // Optimistically remove the product from the current list
        setProducts(prev => prev.filter(p => p.id !== selectedProduct.id))
        // Refresh from server in background
        fetchProducts()
      } else {
        let message = 'Failed to delete product'
        try {
          const err = await response.json()
          message = err?.error || message
        } catch {}
        setDeleteError(message)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      setDeleteError('Failed to delete product')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <Loading />
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
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          </div>
          <Link
            href="/admin/products/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="bg-white rounded-xl shadow-sm">
          {/* Search Bar */}
          <div className="p-6 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Product</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Category</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Price</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Stock</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{product.category?.name || 'N/A'}</td>
                    <td className="py-4 px-6 text-gray-900 font-medium">
                      KES {product.price.toLocaleString()}
                      {product.salePrice && (
                        <span className="ml-2 text-sm text-green-600">
                          Sale: KES {product.salePrice.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-600">{product.stock}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        product.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                          product.status === 'OUT_OF_STOCK' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          aria-label="Edit product"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          aria-label="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No products found</p>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="p-6 border-t flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Delete Product</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
              </p>
              {deleteError && (
                <p className="text-sm text-red-600 mb-4">{deleteError}</p>
              )}
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setSelectedProduct(null)
                    setDeleteError(null)
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
