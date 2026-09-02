'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Upload, X } from 'lucide-react'
import Link from 'next/link'

export default function EditDealPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'MONTHLY',
    discountType: 'PERCENTAGE',
    discountValue: '',
    startDate: '',
    endDate: '',
    isActive: true,
    productIds: [] as string[],
    categoryIds: [] as string[],
    minPurchase: '',
    maxUses: '',
    imageUrl: '',
    bannerText: '',
  })
  const [imagePreview, setImagePreview] = useState<string>('')

  useEffect(() => {
    if (params.id) {
      fetchDeal()
    }
  }, [params.id])

  const fetchDeal = async () => {
    try {
      const response = await fetch(`/api/admin/deals/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setFormData({
          title: data.title || '',
          description: data.description || '',
          type: data.type || 'MONTHLY',
          discountType: data.discountType || 'PERCENTAGE',
          discountValue: data.discountValue?.toString() || '',
          startDate: data.startDate ? new Date(data.startDate).toISOString().slice(0, 16) : '',
          endDate: data.endDate ? new Date(data.endDate).toISOString().slice(0, 16) : '',
          isActive: data.isActive !== undefined ? data.isActive : true,
          productIds: data.productIds || [],
          categoryIds: data.categoryIds || [],
          minPurchase: data.minPurchase?.toString() || '',
          maxUses: data.maxUses?.toString() || '',
          imageUrl: data.imageUrl || '',
          bannerText: data.bannerText || '',
        })
        setImagePreview(data.imageUrl || '')
      }
    } catch (error) {
      console.error('Error fetching deal:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const uploadData = new FormData()
      uploadData.append('file', file)

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        })

        if (response.ok) {
          const data = await response.json()
          setImagePreview(data.url)
          setFormData(prev => ({ ...prev, imageUrl: data.url }))
        } else {
          alert('Failed to upload image')
        }
      } catch (error) {
        alert('Failed to upload image')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/deals/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('Deal updated successfully!')
        router.push('/admin/deals')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update deal')
      }
    } catch (error) {
      console.error('Error updating deal:', error)
      alert('Failed to update deal')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/deals" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Edit Deal</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deal Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
                    placeholder="e.g., Epson Printer Special Offer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-black placeholder-gray-400"
                    placeholder="Describe the deal (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Banner Text</label>
                  <input
                    type="text"
                    value={formData.bannerText}
                    onChange={(e) => setFormData({ ...formData, bannerText: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
                    placeholder="e.g., Limited Time Offer!"
                  />
                </div>
              </div>
            </div>

            {/* Deal Type */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Deal Type</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  >
                    <option value="MONTHLY">Monthly Deal</option>
                    <option value="FLASH_SALE">Flash Sale</option>
                    <option value="SEASONAL">Seasonal Offer</option>
                    <option value="BUNDLE">Bundle Deal</option>
                    <option value="CLEARANCE">Clearance</option>
                  </select>
                </div>
                <div className="flex items-center pt-8">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Active Deal</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Discount */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Discount</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type *</label>
                  <select
                    required
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (KES)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Value *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step={formData.discountType === 'PERCENTAGE' ? '1' : '0.01'}
                    max={formData.discountType === 'PERCENTAGE' ? '100' : undefined}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
                    placeholder={formData.discountType === 'PERCENTAGE' ? 'e.g., 20' : 'e.g., 1000'}
                  />
                </div>
              </div>
            </div>

            {/* Duration */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Duration</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  />
                </div>
              </div>
            </div>

            {/* Restrictions */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Restrictions (Optional)</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Purchase (KES)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.minPurchase}
                    onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
                    placeholder="e.g., 5000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Uses</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
                    placeholder="e.g., 100"
                  />
                </div>
              </div>
            </div>

            {/* Deal Image */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Deal Image</h2>
              <div className="border-2 border-dashed border-blue-300 rounded-xl p-12 text-center bg-blue-50/50 hover:bg-blue-50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="deal-image-upload"
                />
                <label
                  htmlFor="deal-image-upload"
                  className="cursor-pointer block"
                >
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-10 h-10 text-blue-600" />
                  </div>
                  <p className="text-gray-900 font-medium mb-1">Click to upload deal image</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                </label>
              </div>
              {imagePreview && (
                <div className="mt-4 relative">
                  <img
                    src={imagePreview}
                    alt="Deal preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('')
                      setFormData(prev => ({ ...prev, imageUrl: '' }))
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-6 border-t">
              <Link
                href="/admin/deals"
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center disabled:opacity-50"
              >
                {saving ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Update Deal
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
