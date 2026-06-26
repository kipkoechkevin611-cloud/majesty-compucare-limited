'use client'

import Link from 'next/link'
import { Package, ShoppingCart, Eye } from 'lucide-react'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug?: string
    description?: string
    shortDescription?: string
    brand?: string
    price: number
    salePrice?: number
    stock: number
    category?: { name: string; slug: string }
    images?: string[]
    featured?: boolean
  }
  onAddToCart?: (product: ProductCardProps['product']) => void
  showAddToCart?: boolean
  added?: boolean
  className?: string
  imageHeight?: string
  style?: React.CSSProperties
}

export default function ProductCard({
  product,
  onAddToCart,
  showAddToCart = true,
  added = false,
  className = '',
  imageHeight = 'h-[300px]',
  style,
}: ProductCardProps) {
  const displayPrice = product.salePrice || product.price
  const originalPrice = product.salePrice ? product.price : null
  const discount = originalPrice
    ? Math.round((1 - product.salePrice! / originalPrice) * 100)
    : 0

  const stockText =
    product.stock > 10
      ? 'In Stock'
      : product.stock > 0
        ? `Only ${product.stock} left`
        : 'Out of Stock'

  const stockColor =
    product.stock > 10
      ? 'text-green-600'
      : product.stock > 0
        ? 'text-yellow-600'
        : 'text-red-600'

  return (
    <div
      className={`product-card group relative flex flex-col rounded-[12px] overflow-hidden bg-white border border-gray-200 ${className}`}
      style={style}
    >
      {/* Image */}
      <Link href={`/products/${product.id}`} className="block relative overflow-hidden" style={{ aspectRatio: '4 / 3' }}>
        <div className={`relative w-full ${imageHeight} min-h-[300px] overflow-hidden bg-slate-100`}>
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="product-card-image w-full h-full object-cover transition-transform duration-500 ease-out"
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).src = '/images/product-fallback.svg'
                ;(e.currentTarget as HTMLImageElement).onerror = null
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-blue-200">
              <Package className="w-20 h-20" />
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.featured && (
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-blue-600 text-white shadow-sm">
              Featured
            </span>
          )}
        </div>
        {discount > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-red-500 text-white shadow-sm">
              {discount}% OFF
            </span>
          </div>
        )}

        {/* Hover overlay with View Product button */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center z-20">
          <div className="product-card-view-btn opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-blue-700 text-sm font-bold shadow-lg hover:bg-blue-50 transition-colors">
              <Eye className="w-4 h-4" /> View Product
            </span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <div className="flex-1">
          <p className="text-[11px] sm:text-xs font-semibold mb-1.5 uppercase tracking-wider text-blue-600" style={{ fontFamily: 'Fira Code, monospace' }}>
            {product.category?.name || 'General'}
          </p>
          <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 mb-2 flex-wrap">
            <span className="text-lg sm:text-xl font-black text-slate-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              KES {displayPrice.toLocaleString()}
            </span>
            {originalPrice && (
              <span className="text-xs sm:text-sm line-through text-slate-400">
                KES {originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <p className={`text-xs font-semibold ${stockColor}`}>{stockText}</p>
        </div>

        {/* Buttons */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
          {showAddToCart && onAddToCart && (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onAddToCart(product)
              }}
              disabled={product.stock === 0}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                added
                  ? 'bg-green-100 text-green-700 border border-green-500'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              {added ? (
                <>Added</>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </>
              )}
            </button>
          )}
          <Link
            href={`/products/${product.id}`}
            className="px-3 py-2.5 rounded-lg text-xs sm:text-sm font-bold border border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 whitespace-nowrap"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  )
}
