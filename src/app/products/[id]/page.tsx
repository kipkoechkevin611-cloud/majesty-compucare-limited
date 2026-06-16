'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Package, ShoppingCart, Heart, Star, CheckCircle, Truck, Shield, RotateCcw, User, Send, ThumbsUp } from 'lucide-react'
import Link from 'next/link'

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
  const [loading, setLoading] = useState(true)

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
      })
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
    <div className="flex flex-col">
      {/* Breadcrumb */}
      <section className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center mb-4 overflow-hidden">
                {product.images && product.images[selectedImage] ? (
                  <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-32 h-32 text-gray-400" />
                )}
              </div>
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((_: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`bg-gray-100 rounded-lg h-24 flex items-center justify-center overflow-hidden ${selectedImage === i ? 'ring-2 ring-blue-500' : ''
                        }`}
                    >
                      <img src={product.images[i]} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                <span className="text-sm text-blue-600 font-medium capitalize">{product.category?.name || 'General'}</span>
                <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-blue-600">
                  KES {(product.salePrice || product.price).toLocaleString()}
                </span>
                {product.salePrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      KES {product.price.toLocaleString()}
                    </span>
                    {discount > 0 && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                        {discount}% OFF
                      </span>
                    )}
                  </>
                )}
              </div>

              <p className="text-gray-600 mb-6">{product.description}</p>

              <div className="flex items-center space-x-4 mb-6">
                <span className={`font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                </span>
                {product.stock > 0 && <CheckCircle className="w-5 h-5 text-green-600" />}
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 transition"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={handleWishlist}
                  className="p-3 border rounded-lg hover:bg-gray-50 transition"
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {showWishlistSuccess && (
                <div className="bg-green-50 text-green-800 px-4 py-2 rounded-lg mb-4">
                  Added to wishlist!
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Truck className="w-5 h-5" />
                  <span>Free Delivery</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="w-5 h-5" />
                  <span>1 Year Warranty</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <RotateCcw className="w-5 h-5" />
                  <span>7 Day Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          {product.specifications && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 border-b">
                      <span className="text-gray-600 font-medium">{key}</span>
                      <span className="text-gray-900">{String(value)}</span>
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

          {/* Related Products */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.id}`}
                  className="bg-gray-50 rounded-xl p-4 hover:shadow-lg transition"
                >
                  <div className="bg-gray-200 rounded-lg h-40 flex items-center justify-center mb-4">
                    {relatedProduct.images && relatedProduct.images[0] ? (
                      <img src={relatedProduct.images[0]} alt={relatedProduct.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Package className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{relatedProduct.name}</h3>
                  <p className="text-blue-600 font-bold">KES {(relatedProduct.salePrice || relatedProduct.price).toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
