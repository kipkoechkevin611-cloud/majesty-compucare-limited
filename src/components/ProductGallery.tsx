'use client'

import { useState } from 'react'
import { ZoomIn, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react'

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
  }

  const handlePrevious = () => {
    setImageLoaded(false)
    setImageError(false)
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const handleNext = () => {
    setImageLoaded(false)
    setImageError(false)
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(true)
  }

  const currentImage = images[selectedIndex] || '/images/product-fallback.svg'

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden cursor-zoom-in"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setIsLightboxOpen(true)}
      >
        {/* Loading skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse" />
        )}

        <img
          src={currentImage}
          alt={`${productName} - Image ${selectedIndex + 1}`}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isZoomed ? 'scale-150' : 'scale-100'
          } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }
              : undefined
          }
          onLoad={() => setImageLoaded(true)}
          onError={handleImageError}
        />

        {/* Error fallback */}
        {imageError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <div className="w-16 h-16 rounded-full bg-slate-300 flex items-center justify-center mb-3">
              <ZoomIn className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-sm text-slate-500">Image not available</p>
          </div>
        )}

        {/* Zoom indicator */}
        {!imageError && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm">
            <Maximize2 className="w-4 h-4 text-slate-600" />
          </div>
        )}

        {/* Navigation arrows */}
        {images.length > 1 && !imageError && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); handlePrevious() }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm hover:bg-white transition"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext() }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm hover:bg-white transition"
            >
              <ChevronRight className="w-5 h-5 text-slate-700" />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`aspect-square rounded-xl overflow-hidden border-2 transition-all relative bg-gradient-to-br from-slate-50 to-slate-100 ${
                selectedIndex === index
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-transparent hover:border-slate-300'
              }`}
            >
              <img
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = '/images/product-fallback.svg'
                  e.currentTarget.onerror = null
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full p-2 transition"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <img
              src={currentImage}
              alt={`${productName} - Full size`}
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                e.currentTarget.src = '/images/product-fallback.svg'
                e.currentTarget.onerror = null
              }}
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrevious() }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3 transition"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNext() }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3 transition"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
