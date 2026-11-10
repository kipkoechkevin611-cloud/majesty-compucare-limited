'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, X, Upload, Plus } from 'lucide-react'
import Link from 'next/link'
import Loading from '@/components/Loading'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    longDescription: '',
    categoryId: '',
    brand: '',
    price: '',
    salePrice: '',
    stock: '0',
    sku: '',
    featured: false,
    status: 'ACTIVE',
    images: [] as string[],
    warrantyInfo: '',
    whatsIncluded: [] as string[],
    useCases: [] as string[],
    compatibility: '',
    idealFor: [] as string[],
  })
  const [whatsIncludedInput, setWhatsIncludedInput] = useState('')
  const [useCasesInput, setUseCasesInput] = useState('')
  const [idealForInput, setIdealForInput] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchProduct()
      fetchCategories()
    }
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setFormData({
          name: data.name || '',
          description: data.description || '',
          shortDescription: data.shortDescription || '',
          longDescription: data.longDescription || '',
          categoryId: data.categoryId || '',
          brand: data.brand || '',
          price: data.price?.toString() || '',
          salePrice: data.salePrice?.toString() || '',
          stock: data.stock?.toString() || '0',
          sku: data.sku || '',
          featured: data.featured || false,
          status: data.status || 'ACTIVE',
          images: data.images || [],
          warrantyInfo: data.warrantyInfo || '',
          whatsIncluded: data.whatsIncluded || [],
          useCases: data.useCases || [],
          compatibility: data.compatibility || '',
          idealFor: data.idealFor || [],
        })
        setImagePreviews(data.images || [])
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setUploadError(null)
      const uploadPromises = Array.from(files).map(async (file) => {
        const uploadData = new FormData()
        uploadData.append('file', file)

        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: uploadData,
          })

          if (response.ok) {
            const data = await response.json()
            return data.url as string
          } else {
            let message = 'Failed to upload image'
            try {
              const err = await response.json()
              message = err?.error || message
              if (err?.hint) message += ` — ${err.hint}`
            } catch {}
            setUploadError(message)
            return null
          }
        } catch (err: any) {
          setUploadError(err?.message || 'Failed to upload image')
          return null
        }
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      const validUrls = uploadedUrls.filter((url): url is string => url !== null)

      setImagePreviews(prev => [...prev, ...validUrls])
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...validUrls],
      }))
    }
  }

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('Product updated successfully!')
        router.push('/admin/products')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/products" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
                    placeholder="Brief product description for product cards"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Enter product description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Long Description</label>
                  <textarea
                    rows={8}
                    value={formData.longDescription}
                    onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Enter detailed long description with product overview, features, specifications, etc."
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Category & Brand</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
                    placeholder="Enter brand name"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Inventory</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (KES) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sale Price (KES)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
                    placeholder="Enter SKU (optional)"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Status</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="DRAFT">Draft</option>
                    <option value="OUT_OF_STOCK">Out of Stock</option>
                  </select>
                </div>
                <div className="flex items-center pt-8">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured Product</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h2>
              <div className="border-2 border-dashed border-blue-300 rounded-xl p-12 text-center bg-blue-50/50 hover:bg-blue-50 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer block"
                >
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-10 h-10 text-blue-600" />
                  </div>
                  <p className="text-gray-900 font-medium mb-1">Click to upload images</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 5MB each</p>
                </label>
              </div>
              {uploadError && (
                <p className="mt-2 text-sm text-red-600">{uploadError}</p>
              )}
              {imagePreviews.length > 0 && (
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg"
                        onError={(e) => { e.currentTarget.src = '/images/product-fallback.svg'; e.currentTarget.onerror = null; }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Warranty Information</label>
                  <input
                    type="text"
                    value={formData.warrantyInfo}
                    onChange={(e) => setFormData({ ...formData, warrantyInfo: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
                    placeholder="e.g., 1 Year Manufacturer Warranty"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Compatibility</label>
                  <input
                    type="text"
                    value={formData.compatibility}
                    onChange={(e) => setFormData({ ...formData, compatibility: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
                    placeholder="e.g., Compatible with Windows 10/11, macOS"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">What's Included</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={whatsIncludedInput}
                      onChange={(e) => setWhatsIncludedInput(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
                      placeholder="e.g., Power adapter, USB cable"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && whatsIncludedInput.trim()) {
                          e.preventDefault()
                          setFormData({ ...formData, whatsIncluded: [...formData.whatsIncluded, whatsIncludedInput.trim()] })
                          setWhatsIncludedInput('')
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (whatsIncludedInput.trim()) {
                          setFormData({ ...formData, whatsIncluded: [...formData.whatsIncluded, whatsIncludedInput.trim()] })
                          setWhatsIncludedInput('')
                        }
                      }}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  {formData.whatsIncluded.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.whatsIncluded.map((item, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                        >
                          {item}
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, whatsIncluded: formData.whatsIncluded.filter((_, i) => i !== index) })}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Use Cases</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={useCasesInput}
                      onChange={(e) => setUseCasesInput(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
                      placeholder="e.g., Office work, Gaming"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && useCasesInput.trim()) {
                          e.preventDefault()
                          setFormData({ ...formData, useCases: [...formData.useCases, useCasesInput.trim()] })
                          setUseCasesInput('')
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (useCasesInput.trim()) {
                          setFormData({ ...formData, useCases: [...formData.useCases, useCasesInput.trim()] })
                          setUseCasesInput('')
                        }
                      }}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  {formData.useCases.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.useCases.map((item, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                        >
                          {item}
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, useCases: formData.useCases.filter((_, i) => i !== index) })}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ideal For</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={idealForInput}
                      onChange={(e) => setIdealForInput(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
                      placeholder="e.g., Business, Students, Designers"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && idealForInput.trim()) {
                          e.preventDefault()
                          setFormData({ ...formData, idealFor: [...formData.idealFor, idealForInput.trim()] })
                          setIdealForInput('')
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (idealForInput.trim()) {
                          setFormData({ ...formData, idealFor: [...formData.idealFor, idealForInput.trim()] })
                          setIdealForInput('')
                        }
                      }}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  {formData.idealFor.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.idealFor.map((item, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                        >
                          {item}
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, idealFor: formData.idealFor.filter((_, i) => i !== index) })}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex space-x-4 pt-6 border-t">
              <Link
                href="/admin/products"
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
                    Update Product
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
