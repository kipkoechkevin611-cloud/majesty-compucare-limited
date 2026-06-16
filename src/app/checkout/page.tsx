'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { ShoppingBag, CreditCard, Smartphone, Truck, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

type MpesaState = 'idle' | 'sending' | 'waiting' | 'success' | 'failed'

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [savedOrderNumber, setSavedOrderNumber] = useState('')
  const [mpesaState, setMpesaState] = useState<MpesaState>('idle')
  const [mpesaError, setMpesaError] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Nakuru',
    paymentMethod: 'mpesa',
    mpesaPhone: '',
  })

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ShoppingBag className="w-24 h-24 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some products before checkout</p>
        <Link href="/products" className="text-blue-600 hover:text-blue-700 font-medium">
          Continue Shopping
        </Link>
      </div>
    )
  }

  const getTotal = () => getCartTotal() + 500 + Math.round(getCartTotal() * 0.16)

  const saveOrder = async (paymentMethod: string) => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        items: cart.map(item => ({ id: item.id, productId: item.id, name: item.name, quantity: item.quantity, price: item.price })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          street: formData.address,
          city: formData.city,
          country: 'Kenya',
        },
        paymentMethod,
        totalAmount: getTotal(),
      }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to create order')
    return data.order
  }

  const pollPaymentStatus = async (checkoutRequestID: string): Promise<boolean> => {
    const maxAttempts = 12
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(r => setTimeout(r, 5000))
      try {
        const res = await fetch('/api/mpesa/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ checkoutRequestID }),
        })
        const data = await res.json()
        if (data.ResultCode === '0' || data.ResultCode === 0) return true
        if (data.ResultCode !== undefined && data.ResultCode !== '1032') return false
      } catch {}
    }
    return false
  }

  const handleMpesaPayment = async () => {
    const phone = formData.mpesaPhone || formData.phone
    if (!phone) {
      setMpesaError('Please enter your M-Pesa phone number')
      return
    }

    setMpesaError('')
    setMpesaState('sending')

    try {
      const stkRes = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          amount: getTotal(),
          orderNumber: `ORD-${Date.now().toString(36).toUpperCase()}`,
        }),
      })
      const stkData = await stkRes.json()

      if (!stkRes.ok || !stkData.success) {
        setMpesaState('failed')
        setMpesaError(stkData.error || 'Failed to send STK Push. Check your phone number and try again.')
        return
      }

      setMpesaState('waiting')
      const checkoutRequestID = stkData.data?.CheckoutRequestID
      const paid = await pollPaymentStatus(checkoutRequestID)

      if (paid) {
        setMpesaState('success')
        const order = await saveOrder('mpesa')
        setSavedOrderNumber(order?.orderNumber || '')
        clearCart()
        setStep(3)
      } else {
        setMpesaState('failed')
        setMpesaError('Payment not confirmed. Check your phone and try again, or use a different payment method.')
      }
    } catch (err: any) {
      setMpesaState('failed')
      setMpesaError(err.message || 'An error occurred. Please try again.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.paymentMethod === 'mpesa') {
      await handleMpesaPayment()
      return
    }
    setLoading(true)
    try {
      const order = await saveOrder(formData.paymentMethod)
      setSavedOrderNumber(order?.orderNumber || '')
      clearCart()
      setStep(3)
    } catch (err: any) {
      alert(err.message || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full px-4 py-3 rounded-lg text-sm text-slate-900 outline-none transition"
  const inputSty = {background:'rgba(0,123,255,0.06)',border:'1px solid rgba(0,123,255,0.2)'}
  const labelCls = "block text-xs font-semibold mb-2 uppercase tracking-wider"
  const labelSty = {color:'var(--text-low)',fontFamily:'Fira Code,monospace'}

  const OrderSummaryPanel = () => (
    <div className="rounded-xl p-6 sticky top-24 glass" style={{border:'1px solid rgba(0,123,255,0.2)'}}>
      <p className="section-label mb-4">// ORDER_SUMMARY</p>
      {step === 1 && (
        <div className="space-y-2 mb-4">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between text-xs" style={{color:'var(--text-low)'}}>
              <span>{item.name} ×{item.quantity}</span>
              <span style={{color:'var(--text-high)'}}>KES {(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
      <div className="space-y-2 pt-3" style={{borderTop:'1px solid rgba(0,123,255,0.15)'}}>
        {[['Subtotal', `KES ${getCartTotal().toLocaleString()}`],['Shipping','KES 500'],[`Tax (16%)`,`KES ${Math.round(getCartTotal()*0.16).toLocaleString()}`]].map(([k,v])=>(
          <div key={k} className="flex justify-between text-xs" style={{color:'var(--text-low)'}}><span>{k}</span><span>{v}</span></div>
        ))}
        <div className="flex justify-between font-black pt-2" style={{borderTop:'1px solid rgba(0,123,255,0.1)',fontFamily:'Montserrat,sans-serif'}}>
          <span className="text-slate-900">Total</span>
          <span style={{color:'var(--accent-green)'}}>KES {(getCartTotal()+500+Math.round(getCartTotal()*0.16)).toLocaleString()}</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col" style={{background:'var(--bg-primary)'}}>
      {/* Header */}
      <section className="py-12 relative overflow-hidden" style={{background:'var(--bg-surface2)',borderBottom:'1px solid rgba(0,123,255,0.15)'}}>
        <div className="absolute inset-0 radial-glow" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-label mb-2">// CHECKOUT</p>
          <h1 className="text-4xl font-black text-slate-900" style={{fontFamily:'Montserrat,sans-serif'}}>Checkout</h1>
          <p className="mt-1 text-sm" style={{color:'var(--text-low)'}}>Complete your order securely</p>
        </div>
      </section>

      {/* Progress Steps */}
      <section style={{background:'var(--bg-surface2)',borderBottom:'1px solid rgba(0,123,255,0.1)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-center space-x-4">
            {[1,2,3].map((s) => (
              <div key={s} className="flex items-center">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm transition"
                  style={step >= s
                    ? {background:'var(--accent-blue)',color:'#fff',boxShadow:'0 0 12px rgba(0,123,255,0.4)'}
                    : {background:'rgba(0,123,255,0.1)',color:'var(--text-low)',border:'1px solid rgba(0,123,255,0.2)'}}>
                  {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                </div>
                {s < 3 && <div className="w-16 h-px" style={{background: step > s ? 'var(--accent-blue)' : 'rgba(0,123,255,0.15)'}} />}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 space-x-14 text-xs font-semibold" style={{fontFamily:'Fira Code,monospace'}}>
            {['Shipping','Payment','Confirmation'].map((label,i) => (
              <span key={label} style={{color: step >= i+1 ? 'var(--accent-blue)' : 'var(--text-low)'}}>{label}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {step === 1 && (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="rounded-xl p-6 glass" style={{border:'1px solid rgba(0,123,255,0.2)'}}>
                  <p className="section-label mb-5">// SHIPPING_INFO</p>
                  <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className={labelCls} style={labelSty}>Full Name *</label>
                        <input type="text" required value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className={inputCls} style={inputSty} placeholder="John Doe" />
                      </div>
                      <div>
                        <label className={labelCls} style={labelSty}>Email *</label>
                        <input type="email" required value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={inputCls} style={inputSty} placeholder="john@example.com" />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className={labelCls} style={labelSty}>Phone Number *</label>
                        <input type="tel" required value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={inputCls} style={inputSty} placeholder="07XX XXX XXX" />
                      </div>
                      <div>
                        <label className={labelCls} style={labelSty}>City *</label>
                        <input type="text" required value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className={inputCls} style={inputSty} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls} style={labelSty}>Delivery Address *</label>
                      <textarea required rows={3} value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className={inputCls + ' resize-none'} style={inputSty}
                        placeholder="Enter your full delivery address" />
                    </div>
                    <button type="submit" className="btn-primary w-full py-3">Continue to Payment</button>
                  </form>
                </div>
              </div>
              <div className="lg:col-span-1"><OrderSummaryPanel /></div>
            </div>
          )}

          {step === 2 && (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="rounded-xl p-6 glass" style={{border:'1px solid rgba(0,123,255,0.2)'}}>
                  <p className="section-label mb-5">// PAYMENT</p>

                  <div className="space-y-3 mb-6">
                    {[
                      {val:'mpesa', icon:Smartphone, iconColor:'var(--accent-green)', title:'M-Pesa',         sub:'Pay via M-Pesa STK Push'},
                      {val:'till',  icon:CreditCard,  iconColor:'var(--accent-blue)',  title:'M-Pesa Buy Goods', sub:'Pay to Till Number 3745188'},
                      {val:'cash',  icon:Truck,        iconColor:'var(--text-low)',     title:'Cash on Delivery', sub:'Pay when you receive your order'},
                    ].map(({val,icon:Icon,iconColor,title,sub}) => (
                      <label key={val} className="flex items-center p-4 rounded-lg cursor-pointer transition"
                        style={formData.paymentMethod === val
                          ? {border:'1px solid var(--accent-blue)',background:'rgba(0,123,255,0.08)'}
                          : {border:'1px solid rgba(0,123,255,0.15)',background:'rgba(0,123,255,0.03)'}}>
                        <input type="radio" name="payment" checked={formData.paymentMethod === val}
                          onChange={() => setFormData({ ...formData, paymentMethod: val })} className="mr-3" style={{accentColor:'var(--accent-blue)'}} />
                        <Icon className="w-5 h-5 mr-3 flex-shrink-0" style={{color:iconColor}} />
                        <div>
                          <p className="font-bold text-sm text-slate-900" style={{fontFamily:'Montserrat,sans-serif'}}>{title}</p>
                          <p className="text-xs" style={{color:'var(--text-low)'}}>{sub}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {formData.paymentMethod === 'mpesa' && (
                    <div className="mb-6 p-5 rounded-xl space-y-3" style={{background:'rgba(0,255,0,0.05)',border:'1px solid rgba(0,255,0,0.2)'}}>
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" style={{color:'var(--accent-green)'}} />
                        <p className="font-bold text-sm" style={{color:'var(--accent-green)',fontFamily:'Montserrat,sans-serif'}}>M-Pesa STK Push</p>
                      </div>
                      <div>
                        <label className={labelCls} style={labelSty}>M-Pesa Phone Number *</label>
                        <input type="tel" value={formData.mpesaPhone}
                          onChange={(e) => { setFormData({ ...formData, mpesaPhone: e.target.value }); setMpesaError(''); setMpesaState('idle') }}
                          className={inputCls} style={inputSty} placeholder="07XX XXX XXX or 2547XXXXXXXX" />
                        <p className="text-xs mt-1.5" style={{color:'var(--text-low)'}}>Leave blank to use your shipping phone number</p>
                      </div>

                      {mpesaState === 'sending' && (
                        <div className="flex items-center gap-3 p-3 rounded-xl" style={{background:'rgba(0,123,255,0.08)',border:'1px solid rgba(0,123,255,0.2)'}}>
                          <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" style={{color:'var(--accent-blue)'}} />
                          <div>
                            <p className="text-sm font-bold text-slate-900">Sending STK Push...</p>
                            <p className="text-xs" style={{color:'var(--text-low)'}}>Please wait while we contact Safaricom</p>
                          </div>
                        </div>
                      )}

                      {mpesaState === 'waiting' && (
                        <div className="flex items-center gap-3 p-4 rounded-xl" style={{background:'rgba(0,255,0,0.08)',border:'1px solid rgba(0,255,0,0.25)'}}>
                          <Loader2 className="w-6 h-6 animate-spin flex-shrink-0" style={{color:'var(--accent-green)'}} />
                          <div>
                            <p className="text-sm font-black" style={{color:'var(--accent-green)',fontFamily:'Montserrat,sans-serif'}}>Check your phone now!</p>
                            <p className="text-xs" style={{color:'var(--text-low)'}}>An M-Pesa prompt has been sent. Enter your PIN to complete payment.</p>
                            <p className="text-xs mt-1" style={{color:'var(--text-low)'}}>Amount: <strong style={{color:'var(--accent-green)'}}>KES {getTotal().toLocaleString()}</strong></p>
                          </div>
                        </div>
                      )}

                      {mpesaState === 'failed' && mpesaError && (
                        <div className="flex items-start gap-3 p-3 rounded-xl" style={{background:'rgba(255,69,0,0.08)',border:'1px solid rgba(255,69,0,0.25)'}}>
                          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{color:'var(--accent-red)'}} />
                          <p className="text-sm" style={{color:'var(--accent-red)'}}>{mpesaError}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <button onClick={() => setStep(1)} disabled={mpesaState === 'sending' || mpesaState === 'waiting'}
                      className="flex-1 py-3 rounded-lg font-bold text-sm transition disabled:opacity-50"
                      style={{border:'1px solid rgba(0,123,255,0.2)',color:'var(--text-low)'}}>
                      Back
                    </button>
                    <button onClick={formData.paymentMethod === 'mpesa' ? handleMpesaPayment : handleSubmit}
                      disabled={loading || mpesaState === 'sending' || mpesaState === 'waiting'}
                      className="btn-primary flex-1 py-3 disabled:opacity-50 flex items-center justify-center gap-2">
                      {(loading || mpesaState === 'sending' || mpesaState === 'waiting') ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> {mpesaState === 'waiting' ? 'Waiting for payment...' : 'Processing...'}</>
                      ) : (
                        formData.paymentMethod === 'mpesa' ? '📱 Send M-Pesa Push' : 'Place Order'
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1"><OrderSummaryPanel /></div>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-2xl mx-auto">
              <div className="rounded-xl p-10 text-center glass" style={{border:'1px solid rgba(0,255,0,0.25)'}}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{background:'rgba(0,255,0,0.1)',border:'1px solid rgba(0,255,0,0.3)',boxShadow:'0 0 24px rgba(0,255,0,0.2)'}}>
                  <CheckCircle className="w-10 h-10" style={{color:'var(--accent-green)'}} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4" style={{fontFamily:'Montserrat,sans-serif'}}>Order Placed Successfully!</h2>
                <p className="mb-6 text-sm" style={{color:'var(--text-low)'}}>
                  Thank you for your order. You will receive an email confirmation shortly with your order details.
                </p>
                <div className="rounded-lg p-4 mb-6" style={{background:'rgba(0,123,255,0.06)',border:'1px solid rgba(0,123,255,0.15)'}}>
                  <p className="text-xs mb-1" style={{color:'var(--text-low)',fontFamily:'Fira Code,monospace'}}>// ORDER_NUMBER</p>
                  <p className="text-xl font-black text-slate-900" style={{fontFamily:'Fira Code,monospace'}}>{savedOrderNumber || 'Confirmed'}</p>
                </div>
                <div className="space-y-3">
                  <Link href="/" className="btn-primary block w-full py-3 text-center">Continue Shopping</Link>
                  <Link href="/contact" className="block w-full py-3 rounded-lg font-bold text-sm transition text-center"
                    style={{border:'1px solid rgba(0,123,255,0.2)',color:'var(--text-low)'}}>
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
