'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Calendar, Percent, DollarSign, Tag, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import Loading from '@/components/Loading'

export default function AdminDealsPage() {
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/admin/deals')
      if (response.ok) {
        const data = await response.json()
        setDeals(data.deals || [])
      }
    } catch (error) {
      console.error('Error fetching deals:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDeals()
  }, [])

  const handleDelete = async (deal: any) => {
    setSelectedDeal(deal)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!selectedDeal) return

    try {
      setDeleting(true)
      const response = await fetch(`/api/admin/deals/${selectedDeal.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setShowDeleteModal(false)
        setSelectedDeal(null)
        setDeals(prev => prev.filter(d => d.id !== selectedDeal.id))
      } else {
        alert('Failed to delete deal')
      }
    } catch (error) {
      console.error('Error deleting deal:', error)
      alert('Failed to delete deal')
    } finally {
      setDeleting(false)
    }
  }

  const toggleActive = async (deal: any) => {
    try {
      const response = await fetch(`/api/admin/deals/${deal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !deal.isActive }),
      })

      if (response.ok) {
        setDeals(prev => prev.map(d => 
          d.id === deal.id ? { ...d, isActive: !d.isActive } : d
        ))
      }
    } catch (error) {
      console.error('Error toggling deal:', error)
    }
  }

  const isDealActive = (deal: any) => {
    const now = new Date()
    const startDate = new Date(deal.startDate)
    const endDate = new Date(deal.endDate)
    return deal.isActive && now >= startDate && now <= endDate
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
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
            <h1 className="text-2xl font-bold text-gray-900">Deals & Offers</h1>
          </div>
          <Link
            href="/admin/deals/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Deal</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="bg-white rounded-xl shadow-sm">
          {/* Deals Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Deal</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Type</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Discount</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Duration</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deals.map((deal, index) => (
                  <tr key={deal.id} className="border-b hover:bg-gray-50 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                    <td className="py-4 px-6">
                      <div>
                        <span className="font-medium text-gray-900 transition-colors duration-300 hover:text-blue-600">{deal.title}</span>
                        {deal.description && (
                          <p className="text-sm text-gray-500 mt-1">{deal.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 transition-transform duration-300 hover:scale-110 inline-block">
                        {deal.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {deal.discountType === 'PERCENTAGE' ? (
                          <>
                            <Percent className="w-4 h-4 text-green-600 transition-transform duration-300 hover:scale-125" />
                            <span className="font-semibold text-gray-900 transition-transform duration-300 hover:scale-110">{deal.discountValue}% OFF</span>
                          </>
                        ) : (
                          <>
                            <DollarSign className="w-4 h-4 text-green-600 transition-transform duration-300 hover:scale-125" />
                            <span className="font-semibold text-gray-900 transition-transform duration-300 hover:scale-110">KES {deal.discountValue.toLocaleString()}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 transition-transform duration-300 hover:rotate-12" />
                        <span>{formatDate(deal.startDate)} - {formatDate(deal.endDate)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleActive(deal)}
                          className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                            isDealActive(deal) 
                              ? 'bg-green-100 text-green-600 hover:bg-green-200 hover:shadow-md' 
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:shadow-md'
                          }`}
                          title={isDealActive(deal) ? 'Active' : 'Inactive'}
                        >
                          {isDealActive(deal) ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium transition-transform duration-300 hover:scale-110 inline-block ${
                          isDealActive(deal) 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {isDealActive(deal) ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/deals/${deal.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-md"
                          aria-label="Edit deal"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(deal)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-md"
                          aria-label="Delete deal"
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

          {deals.length === 0 && (
            <div className="text-center py-12">
              <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No deals found</p>
              <Link
                href="/admin/deals/new"
                className="mt-4 inline-block text-blue-600 hover:text-blue-700"
              >
                Create your first deal
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Delete Deal</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{selectedDeal?.title}"? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setSelectedDeal(null)
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
