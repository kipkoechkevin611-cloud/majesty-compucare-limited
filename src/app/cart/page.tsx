'use client'

import { useCart } from '@/contexts/CartContext'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart()

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 min-h-[60vh]" style={{background:'var(--bg-primary)'}}>
        <ShoppingBag className="w-20 h-20 mb-5" style={{color:'rgba(0,123,255,0.25)'}} />
        <h2 className="text-2xl font-black text-slate-900 mb-2" style={{fontFamily:'Montserrat,sans-serif'}}>Your cart is empty</h2>
        <p className="mb-8" style={{color:'var(--text-low)'}}>Add some products to get started</p>
        <Link href="/products" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col" style={{background:'var(--bg-primary)'}}>
      {/* Header */}
      <section className="py-12 relative overflow-hidden" style={{background:'var(--bg-surface2)',borderBottom:'1px solid rgba(0,123,255,0.15)'}}>
        <div className="absolute inset-0 radial-glow" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-slate-900" style={{fontFamily:'Montserrat,sans-serif'}}>Shopping Cart</h1>
          <p className="mt-1" style={{color:'var(--text-low)',fontFamily:'Fira Code,monospace',fontSize:'0.85rem'}}>{getCartCount()} {getCartCount() === 1 ? 'item' : 'items'} in your cart</p>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <div key={item.id} className="rounded-xl p-4 flex items-center space-x-4 glass" style={{border:'1px solid rgba(0,123,255,0.15)'}}>
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0" style={{background:'var(--bg-surface2)',border:'1px solid rgba(0,123,255,0.15)'}}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = '/images/product-fallback.svg'; e.currentTarget.onerror = null; }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{color:'rgba(0,123,255,0.2)'}}>
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 truncate" style={{fontFamily:'Montserrat,sans-serif'}}>{item.name}</h3>
                    {item.category && (
                      <p className="text-xs capitalize mt-0.5" style={{color:'var(--accent-blue)',fontFamily:'Fira Code,monospace'}}>{item.category}</p>
                    )}
                    <p className="text-base font-black mt-1" style={{color:'var(--accent-green)',fontFamily:'Montserrat,sans-serif'}}>KES {item.price.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition"
                      style={{background:'rgba(0,123,255,0.1)',border:'1px solid rgba(0,123,255,0.2)',color:'var(--text-high)'}}
                      aria-label="Decrease quantity">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-bold text-slate-900" style={{fontFamily:'Fira Code,monospace'}}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition"
                      style={{background:'rgba(0,123,255,0.1)',border:'1px solid rgba(0,123,255,0.2)',color:'var(--text-high)'}}
                      aria-label="Increase quantity">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-base font-black text-slate-900" style={{fontFamily:'Montserrat,sans-serif'}}>
                      KES {(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button onClick={() => removeFromCart(item.id)}
                      className="mt-2 transition" style={{color:'var(--accent-red)'}}
                      aria-label="Remove item">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="rounded-xl p-6 sticky top-24 glass" style={{border:'1px solid rgba(0,123,255,0.2)'}}>
                <div className="space-y-3 mb-6">
                  {[
                    ['Subtotal', `KES ${getCartTotal().toLocaleString()}`],
                    ['Shipping', 'Calculated at checkout'],
                    ['Tax', 'Calculated at checkout'],
                  ].map(([k,v]) => (
                    <div key={k} className="flex justify-between text-sm" style={{color:'var(--text-low)'}}>
                      <span>{k}</span><span>{v}</span>
                    </div>
                  ))}
                  <div className="pt-3" style={{borderTop:'1px solid rgba(0,123,255,0.15)'}}>
                    <div className="flex justify-between font-black text-slate-900" style={{fontFamily:'Montserrat,sans-serif'}}>
                      <span>Total</span>
                      <span style={{color:'var(--accent-green)'}}>KES {getCartTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Link href="/checkout" className="btn-primary block w-full py-3 text-center font-bold">
                  Proceed to Checkout
                </Link>
                <Link href="/products" className="block w-full mt-3 text-center text-sm font-semibold transition" style={{color:'var(--accent-blue)'}}>
                  Continue Shopping
                </Link>

                <div className="mt-5 p-4 rounded-lg" style={{background:'rgba(0,255,0,0.06)',border:'1px solid rgba(0,255,0,0.2)'}}>
                  <p className="text-xs" style={{color:'var(--text-low)',fontFamily:'Fira Code,monospace'}}>
                    <span style={{color:'var(--accent-green)'}}>// </span>Payment Methods: M-Pesa · Cash · Bank Transfer
                  </p>
                  <p className="text-xs mt-1" style={{color:'var(--text-low)',fontFamily:'Fira Code,monospace'}}>
                    <span style={{color:'var(--accent-green)'}}>// </span>M-Pesa Till: <span style={{color:'var(--accent-green)'}}>3745188</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
