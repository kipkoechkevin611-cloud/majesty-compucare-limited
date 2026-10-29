'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Package, ShoppingCart, Heart, Star, CheckCircle, Truck, Shield, RotateCcw, User, Send, ThumbsUp, Share2, ArrowRight, Minus, Plus, Info, Box, Monitor, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import ProductGallery from '@/components/ProductGallery'
import ProductVariantSelector from '@/components/ProductVariantSelector'

export default function ProductDetailPage() {
  const params = useParams()
  const productId = Array.isArray(params.id) ? params.id[0] : (params as any).id
  const { data: session } = useSession()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showWishlistSuccess, setShowWishlistSuccess] = useState(false)
  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [frequentlyBoughtTogether, setFrequentlyBoughtTogether] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState<Record<string, string>>({})
  const [showCartPreview, setShowCartPreview] = useState(false)
  const [recommendedAccessories, setRecommendedAccessories] = useState<any[]>([])

  // Reviews state
  const [reviews, setReviews] = useState<any[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [reviewSuccess, setReviewSuccess] = useState('')

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async (excludeId?: string) => {
    try {
      const response = await fetch(`/api/products?limit=8`)
      if (response.ok) {
        const data = await response.json()
        const list = Array.isArray(data) ? data : (data.products || [])
        const currentId = excludeId || (product?.id || productId)
        const filtered = list.filter((p: any) => p.id !== currentId).slice(0, 4)
        setRelatedProducts(filtered)
      } else {
        console.error('Failed to fetch related products')
      }
    } catch (error) {
      console.error('Error fetching related products:', error)
    }
  }

  const fetchFrequentlyBoughtTogether = async (excludeId?: string) => {
    try {
      const response = await fetch(`/api/products?limit=4&category=${product?.category?.slug || ''}`)
      if (response.ok) {
        const data = await response.json()
        const list = Array.isArray(data) ? data : (data.products || [])
        const currentId = excludeId || (product?.id || productId)
        const filtered = list.filter((p: any) => p.id !== currentId).slice(0, 3)
        setFrequentlyBoughtTogether(filtered)
      }
    } catch (error) {
      console.error('Error fetching frequently bought together:', error)
    }
  }

  const fetchRecommendedAccessories = async () => {
    try {
      const response = await fetch('/api/products?limit=4&category=accessories')
      if (response.ok) {
        const data = await response.json()
        const list = Array.isArray(data) ? data : (data.products || [])
        setRecommendedAccessories(list.slice(0, 4))
      }
    } catch (error) {
      console.error('Error fetching accessories:', error)
    }
  }

  const fetchReviews = async (targetProductId?: string) => {
    try {
      const pid = targetProductId || (product?.id || productId)
      const response = await fetch(`/api/reviews?productId=${pid}&limit=10`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
        setAverageRating(data.averageRating || 0)
        setTotalReviews(data.totalReviews || 0)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user) {
      setReviewError('Please sign in to leave a review')
      return
    }
    setSubmittingReview(true)
    setReviewError('')
    setReviewSuccess('')

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product?.id || productId,
          rating: newRating,
          comment: newComment
        })
      })

      const data = await response.json()
      if (response.ok) {
        setReviewSuccess('Review submitted successfully!')
        setNewComment('')
        setNewRating(5)
        fetchReviews()
      } else {
        setReviewError(data.error || 'Failed to submit review')
      }
    } catch (error) {
      setReviewError('Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  useEffect(() => {
    if (product?.id) {
      fetchRelatedProducts(product.id)
      fetchReviews(product.id)
      fetchFrequentlyBoughtTogether(product.id)
      fetchRecommendedAccessories()
    }
  }, [product?.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Product not found</h2>
          <Link href="/products" className="text-blue-600 hover:text-blue-700">Back to Products</Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.salePrice || product.price,
        category: product.category?.name || 'General',
        image: product.images?.[0] || '',
        variant: selectedVariant,
      })
    }
    setShowCartPreview(true)
    setTimeout(() => setShowCartPreview(false), 3000)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    window.location.href = '/checkout'
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        text: product.shortDescription || product.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const handleWishlist = () => {
    setShowWishlistSuccess(true)
    setTimeout(() => setShowWishlistSuccess(false), 2000)
  }

  const discount = product.salePrice
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : 0

  return (
    <div className="flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* Breadcrumb */}
      <section className="py-4 border-b" style={{ background: 'var(--bg-surface2)', borderColor: 'rgba(0,123,255,0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="hover:text-blue-600 transition" style={{ color: 'var(--text-low)' }}>Home</Link>
            <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-low)' }} />
            <Link href="/products" className="hover:text-blue-600 transition" style={{ color: 'var(--text-low)' }}>Products</Link>
            <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-low)' }} />
            <span className="font-semibold" style={{ color: 'var(--text-high)' }}>{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Product Gallery */}
            <div>
              <ProductGallery 
                images={product.images || []} 
                productName={product.name} 
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Brand & Category */}
              <div className="flex items-center gap-3">
                {product.brand && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: 'rgba(0,123,255,0.1)', color: 'var(--accent-blue)', fontFamily: 'Fira Code, monospace' }}>
                    {product.brand}
                  </span>
                )}
                <span className="text-sm font-medium" style={{ color: 'var(--text-low)' }}>{product.category?.name || 'General'}</span>
              </div>

              {/* Product Name */}
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm" style={{ color: 'var(--text-low)' }}>({totalReviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black" style={{ color: 'var(--accent-blue)', fontFamily: 'Montserrat, sans-serif' }}>
                  KES {(product.salePrice || product.price).toLocaleString()}
                </span>
                {product.salePrice && (
                  <>
                    <span className="text-xl text-slate-400 line-through">
                      KES {product.price.toLocaleString()}
                    </span>
                    {discount > 0 && (
                      <span className="px-3 py-1 rounded-full text-sm font-bold bg-red-500 text-white">
                        {discount}% OFF
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-medium)' }}>
                  {product.shortDescription}
                </p>
              )}

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                <span className={`font-semibold ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left in stock` : 'Out of Stock'}
                </span>
              </div>

              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <ProductVariantSelector
                  variants={product.variants}
                  onVariantChange={setSelectedVariant}
                />
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold" style={{ color: 'var(--text-high)' }}>Quantity:</span>
                <div className="flex items-center border-2 rounded-xl overflow-hidden" style={{ borderColor: 'rgba(0,123,255,0.2)' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-16 text-center font-bold text-lg" style={{ fontFamily: 'Fira Code, monospace' }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 py-4 rounded-xl font-bold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ background: 'var(--accent-blue)', fontFamily: 'Montserrat, sans-serif' }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 py-4 rounded-xl font-bold transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ background: 'var(--text-high)', color: '#fff', fontFamily: 'Montserrat, sans-serif' }}
                >
                  Buy Now
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={handleWishlist}
                  className="p-4 rounded-xl border-2 transition-all hover:border-red-300 hover:bg-red-50 flex items-center justify-center"
                  style={{ borderColor: 'rgba(0,123,255,0.2)' }}
                >
                  <Heart className="w-5 h-5" style={{ color: 'var(--text-low)' }} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-4 rounded-xl border-2 transition-all hover:border-blue-300 hover:bg-blue-50 flex items-center justify-center"
                  style={{ borderColor: 'rgba(0,123,255,0.2)' }}
                >
                  <Share2 className="w-5 h-5" style={{ color: 'var(--text-low)' }} />
                </button>
              </div>

              {/* Cart Preview */}
              {showCartPreview && (
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 animate-fade-slide-up">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Added to cart!</span>
                  </div>
                  {recommendedAccessories.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <p className="text-sm text-green-700 mb-2">Recommended accessories:</p>
                      <div className="flex gap-2 overflow-x-auto">
                        {recommendedAccessories.slice(0, 3).map((acc) => (
                          <Link
                            key={acc.id}
                            href={`/products/${acc.id}`}
                            className="flex-shrink-0 px-3 py-2 bg-white rounded-lg text-xs font-medium text-green-700 hover:bg-green-100 transition"
                          >
                            {acc.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Delivery & Warranty Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t" style={{ borderColor: 'rgba(0,123,255,0.1)' }}>
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'var(--bg-surface2)' }}>
                  <div className="p-2 rounded-lg" style={{ background: 'rgba(0,123,255,0.1)' }}>
                    <Truck className="w-5 h-5" style={{ color: 'var(--accent-blue)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-high)' }}>Free Delivery</p>
                    <p className="text-xs" style={{ color: 'var(--text-low)' }}>Nakuru & Kisumu</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'var(--bg-surface2)' }}>
                  <div className="p-2 rounded-lg" style={{ background: 'rgba(0,123,255,0.1)' }}>
                    <Shield className="w-5 h-5" style={{ color: 'var(--accent-blue)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-high)' }}>Warranty</p>
                    <p className="text-xs" style={{ color: 'var(--text-low)' }}>{product.warrantyInfo || '1 Year'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'var(--bg-surface2)' }}>
                  <div className="p-2 rounded-lg" style={{ background: 'rgba(0,123,255,0.1)' }}>
                    <RotateCcw className="w-5 h-5" style={{ color: 'var(--accent-blue)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-high)' }}>7 Day Returns</p>
                    <p className="text-xs" style={{ color: 'var(--text-low)' }}>Easy returns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>Product Description</h2>
            <div className="prose max-w-none" style={{ color: 'var(--text-medium)' }}>
              <div className="whitespace-pre-line leading-relaxed">
                {product.longDescription || product.description}
              </div>
            </div>
          </div>

          {/* What's Included */}
          {product.whatsIncluded && product.whatsIncluded.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>What's in the Box</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.whatsIncluded.map((item: string, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-surface2)' }}>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span style={{ color: 'var(--text-medium)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ideal For / Use Cases */}
          {product.idealFor && product.idealFor.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>Ideal For</h2>
              <div className="flex flex-wrap gap-3">
                {product.idealFor.map((useCase: string, index: number) => (
                  <span key={index} className="px-4 py-2 rounded-full text-sm font-semibold" style={{ background: 'rgba(0,123,255,0.1)', color: 'var(--accent-blue)', fontFamily: 'Fira Code, monospace' }}>
                    {useCase}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Specifications */}
          {product.specifications && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>Technical Specifications</h2>
              <div className="rounded-xl p-6" style={{ background: 'var(--bg-surface2)' }}>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 border-b" style={{ borderColor: 'rgba(0,123,255,0.1)' }}>
                      <span className="font-medium" style={{ color: 'var(--text-low)' }}>{key}</span>
                      <span style={{ color: 'var(--text-high)' }}>{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

            {/* Rating Summary */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                <div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">{totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</p>
                </div>
              </div>
            </div>

            {/* Write a Review */}
            <div className="bg-white border rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
              {session?.user ? (
                <form onSubmit={submitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-8 h-8 transition ${star <= newRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">{newRating} out of 5</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your experience with this product..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={4}
                    />
                  </div>
                  {reviewError && (
                    <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg">{reviewError}</div>
                  )}
                  {reviewSuccess && (
                    <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg">{reviewSuccess}</div>
                  )}
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-4">Please sign in to leave a review</p>
                  <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                    Sign In
                  </Link>
                </div>
              )}
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</p>
                          <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-gray-700">{review.comment}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                </div>
              )}
            </div>
          </div>

          {/* Frequently Bought Together */}
          {frequentlyBoughtTogether.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>Frequently Bought Together</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {frequentlyBoughtTogether.map((item) => (
                  <Link
                    key={item.id}
                    href={`/products/${item.id}`}
                    className="group p-4 rounded-xl border-2 transition-all hover:border-blue-400 hover:shadow-lg animate-fade-slide-up"
                    style={{ background: 'var(--bg-surface2)', borderColor: 'rgba(0,123,255,0.1)' }}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-slate-100">
                      {item.images && item.images[0] ? (
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                    <p className="font-bold" style={{ color: 'var(--accent-blue)' }}>KES {(item.salePrice || item.price).toLocaleString()}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/products/${relatedProduct.id}`}
                    className="group p-4 rounded-xl border-2 transition-all hover:border-blue-400 hover:shadow-lg animate-fade-slide-up"
                    style={{ background: 'var(--bg-surface2)', borderColor: 'rgba(0,123,255,0.1)' }}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-slate-100">
                      {relatedProduct.images && relatedProduct.images[0] ? (
                        <img src={relatedProduct.images[0]} alt={relatedProduct.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{relatedProduct.name}</h3>
                    <p className="font-bold" style={{ color: 'var(--accent-blue)' }}>KES {(relatedProduct.salePrice || relatedProduct.price).toLocaleString()}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
