'use client'

import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, Monitor, Printer, Video, Wifi, Smartphone, Package, PenTool, ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import ProductCard from '@/components/ProductCard'

export default function ProductsPage() {
  const { addToCart, getCartCount } = useCart()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [showFilters, setShowFilters] = useState(true)
  const [products, setProducts] = useState<any[]>([])
  const [dbCategories, setDbCategories] = useState<any[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const uiCategories = [
    { id: 'all', name: 'All Products', icon: Package },
    { id: 'laptops', name: 'Laptops', icon: Monitor },
    { id: 'printers', name: 'Printers', icon: Printer },
    { id: 'cctv-systems', name: 'CCTV', icon: Video },
    { id: 'networking', name: 'Networking', icon: Wifi },
    { id: 'accessories', name: 'Accessories', icon: Smartphone },
  ]

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: '24' })
      if (searchQuery) params.set('search', searchQuery)
      if (selectedCategory !== 'all') params.set('category', selectedCategory)

      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`/api/products?${params}`),
        fetch('/api/categories'),
      ])

      if (productsRes.ok) {
        const data = await productsRes.json()
        let filtered = data.products || []
        if (priceRange !== 'all') {
          filtered = filtered.filter((p: any) =>
            priceRange === 'low' ? p.price < 10000 :
            priceRange === 'medium' ? p.price >= 10000 && p.price < 50000 :
            p.price >= 50000
          )
        }
        setProducts(filtered)
        setPagination(data.pagination || null)
      }
      if (categoriesRes.ok) setDbCategories(await categoriesRes.json())
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [searchQuery, selectedCategory, priceRange])

  const handleAddToCart = (product: any) => {
    try {
      addToCart({
        id: product.id.toString(),
        name: product.name,
        price: product.salePrice || product.price,
        category: product.category?.name || '',
        image: product.images?.[0] || '',
      })
      alert(`${product.name} added to cart!`)
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const selectSty = {background:'var(--bg-surface2)',border:'1px solid rgba(0,123,255,0.2)',color:'var(--text-low)'}

  return (
    <div className="flex flex-col" style={{background:'var(--bg-primary)'}}>
      {/* Hero */}
      <section className="py-12 sm:py-16 relative overflow-hidden" style={{background:'var(--bg-surface2)',borderBottom:'1px solid rgba(0,123,255,0.15)'}}>
        <div className="absolute inset-0 radial-glow" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3" style={{fontFamily:'Montserrat,sans-serif'}}>Our Products</h1>
          <p className="text-lg max-w-3xl" style={{color:'var(--text-low)'}}>Browse our wide range of quality technology products for home and business</p>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="sticky top-16 z-40" style={{background:'var(--bg-surface2)',borderBottom:'1px solid rgba(0,123,255,0.12)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{color:'var(--accent-blue)'}} />
              <input type="text" placeholder="Search products..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-slate-900 outline-none"
                style={{background:'rgba(0,123,255,0.06)',border:'1px solid rgba(0,123,255,0.2)'}} />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition"
              style={{border:'1px solid rgba(0,123,255,0.2)',color:'var(--text-low)'}}>
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>
          {showFilters && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{color:'var(--text-low)',fontFamily:'Fira Code,monospace'}}>Category</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none" style={selectSty}>
                  <option value="all">All Products</option>
                  {dbCategories.map(cat => <option key={cat.id} value={cat.slug}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{color:'var(--text-low)',fontFamily:'Fira Code,monospace'}}>Price Range</label>
                <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none" style={selectSty}>
                  <option value="all">All Prices</option>
                  <option value="low">Under KES 10,000</option>
                  <option value="medium">KES 10,000 - 50,000</option>
                  <option value="high">KES 50,000+</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Category Tabs */}
      <section style={{background:'var(--bg-surface2)',borderBottom:'1px solid rgba(0,123,255,0.1)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-2 py-3">
            {uiCategories.map(({ id, name, icon: Icon }) => (
              <button key={id} onClick={() => setSelectedCategory(id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition"
                style={selectedCategory === id
                  ? {background:'var(--accent-blue)',color:'#fff',boxShadow:'0 0 10px rgba(0,123,255,0.35)'}
                  : {background:'rgba(0,123,255,0.08)',color:'var(--text-low)',border:'1px solid rgba(0,123,255,0.15)'}}>
                <Icon className="w-3.5 h-3.5" />
                {name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-xs" style={{color:'var(--text-low)',fontFamily:'Fira Code,monospace'}}>
              // {loading ? 'Loading...' : `Showing ${products.length}${pagination ? ` of ${pagination.total}` : ''} product${products.length === 1 ? '' : 's'}`}
            </p>
            <div className="flex items-center gap-2 text-xs" style={{color:'var(--text-low)',fontFamily:'Fira Code,monospace'}}>
              <ShoppingCart className="w-4 h-4" style={{color:'var(--accent-blue)'}} />
              Cart ({getCartCount()})
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12" style={{border:'2px solid rgba(0,123,255,0.15)',borderTopColor:'var(--accent-blue)'}} />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  className="animate-fade-slide-up"
                  style={{ animationDelay: `${(index % 8) * 75}ms` } as any}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="w-16 h-16 mx-auto mb-4" style={{color:'rgba(0,123,255,0.15)'}} />
              <h3 className="text-lg font-black text-slate-900 mb-2" style={{fontFamily:'Montserrat,sans-serif'}}>No products found</h3>
              <p className="text-sm" style={{color:'var(--text-low)'}}>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
