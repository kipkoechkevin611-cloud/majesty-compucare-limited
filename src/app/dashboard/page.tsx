'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { User, ShoppingBag, Heart, MapPin, LogOut, Package, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import Loading from '@/components/Loading'

const statusColors: Record<string, {bg:string,color:string}> = {
  PENDING:    {bg:'rgba(255,200,0,0.12)',   color:'#FFD700'},
  CONFIRMED:  {bg:'rgba(0,123,255,0.12)',   color:'#007BFF'},
  PROCESSING: {bg:'rgba(138,43,226,0.12)',  color:'#9B59B6'},
  SHIPPED:    {bg:'rgba(0,123,255,0.15)',   color:'#00BFFF'},
  DELIVERED:  {bg:'rgba(0,255,0,0.10)',     color:'#00FF00'},
  CANCELLED:  {bg:'rgba(255,69,0,0.12)',    color:'#FF4500'},
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState<any[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return
    fetch('/api/orders')
      .then(r => r.ok ? r.json() : { orders: [] })
      .then(d => setOrders(d.orders || []))
      .finally(() => setOrdersLoading(false))
  }, [status])

  if (status === 'loading') return <Loading />
  if (status === 'unauthenticated' || !session) return null

  const tabs = [
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
  ]

  const initial = (session.user?.name || session.user?.email || 'U').charAt(0).toUpperCase()

  const inputStyle = {background:'rgba(0,123,255,0.06)',border:'1px solid rgba(0,123,255,0.2)'}

  return (
    <div className="flex flex-col min-h-screen" style={{background:'var(--bg-primary)'}}>
      {/* Header */}
      <section className="py-12 relative overflow-hidden" style={{background:'var(--bg-surface2)',borderBottom:'1px solid rgba(0,123,255,0.15)'}}>
        <div className="absolute inset-0 radial-glow" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0" style={{background:'var(--accent-green)',color:'var(--bg-primary)',fontFamily:'Montserrat,sans-serif',boxShadow:'0 0 20px rgba(0,255,0,0.35)'}}>
            {initial}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900" style={{fontFamily:'Montserrat,sans-serif'}}>Welcome back, {session.user?.name || 'there'}!</h1>
            <p className="text-sm mt-0.5" style={{color:'var(--text-low)',fontFamily:'Fira Code,monospace'}}>{session.user?.email}</p>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="rounded-xl overflow-hidden glass" style={{border:'1px solid rgba(0,123,255,0.2)'}}>
                <div className="p-5" style={{borderBottom:'1px solid rgba(0,123,255,0.12)'}}>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-base flex-shrink-0" style={{background:'var(--accent-blue)',color:'#fff',boxShadow:'0 0 10px rgba(0,123,255,0.4)',fontFamily:'Montserrat,sans-serif'}}>
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate text-sm" style={{fontFamily:'Montserrat,sans-serif'}}>{session.user?.name || 'Customer'}</p>
                      <p className="text-[10px] truncate" style={{color:'var(--text-low)',fontFamily:'Fira Code,monospace'}}>{session.user?.email}</p>
                    </div>
                  </div>
                </div>
                <nav className="p-3 space-y-1">
                  {tabs.map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => setActiveTab(id)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition"
                      style={activeTab === id
                        ? {background:'rgba(0,255,0,0.08)',color:'var(--accent-green)',border:'1px solid rgba(0,255,0,0.2)'}
                        : {color:'var(--text-low)',border:'1px solid transparent'}}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </nav>
                <div className="p-3" style={{borderTop:'1px solid rgba(0,123,255,0.12)'}}>
                  <button onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition"
                    style={{color:'var(--accent-red)'}}>
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">

              {/* Orders */}
              {activeTab === 'orders' && (
                <div className="rounded-xl p-6 glass" style={{border:'1px solid rgba(0,123,255,0.2)'}}>
                  {ordersLoading ? (
                    <div className="space-y-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="animate-pulse rounded-xl p-4" style={{background:'var(--bg-surface2)'}}>
                          <div className="flex justify-between mb-3">
                            <div className="h-4 rounded w-32" style={{background:'var(--bg-surface)'}} />
                            <div className="h-6 rounded-full w-20" style={{background:'var(--bg-surface)'}} />
                          </div>
                          <div className="h-3 rounded w-1/2" style={{background:'var(--bg-surface)'}} />
                        </div>
                      ))}
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="rounded-xl p-5 transition" style={{border:'1px solid rgba(0,123,255,0.15)',background:'rgba(0,123,255,0.03)'}}>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-bold text-slate-900" style={{fontFamily:'Fira Code,monospace'}}>{order.orderNumber}</p>
                              <p className="text-xs mt-0.5" style={{color:'var(--text-low)'}}>{new Date(order.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            </div>
                            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{background:(statusColors[order.status]||statusColors.PENDING).bg,color:(statusColors[order.status]||statusColors.PENDING).color}}>
                              {order.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {order.items?.slice(0, 3).map((item: any) => (
                              <span key={item.id} className="text-xs px-2 py-1 rounded" style={{background:'rgba(0,123,255,0.08)',color:'var(--text-low)',fontFamily:'Fira Code,monospace'}}>
                                {item.product?.name} ×{item.quantity}
                              </span>
                            ))}
                            {order.items?.length > 3 && (
                              <span className="text-xs" style={{color:'var(--text-low)'}}>+{order.items.length - 3} more</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between pt-3" style={{borderTop:'1px solid rgba(0,123,255,0.1)'}}>
                            <p className="font-black" style={{color:'var(--accent-green)',fontFamily:'Montserrat,sans-serif'}}>KES {order.totalAmount.toLocaleString()}</p>
                            <span className="text-xs" style={{color:'var(--text-low)',fontFamily:'Fira Code,monospace'}}>{order.paymentMethod}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <ShoppingBag className="w-16 h-16 mx-auto mb-4" style={{color:'rgba(0,123,255,0.2)'}} />
                      <p className="font-bold text-slate-900" style={{fontFamily:'Montserrat,sans-serif'}}>No orders yet</p>
                      <p className="text-sm mt-1 mb-6" style={{color:'var(--text-low)'}}>Your order history will appear here</p>
                      <Link href="/products" className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm">
                        <ShoppingCart className="w-4 h-4" /> Start Shopping
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Profile */}
              {activeTab === 'profile' && (
                <div className="rounded-xl p-6 glass" style={{border:'1px solid rgba(0,123,255,0.2)'}}>
                  <form className="space-y-5" onSubmit={e => e.preventDefault()}>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{color:'var(--text-low)',fontFamily:'Fira Code,monospace'}}>Full Name</label>
                        <input type="text" defaultValue={session.user?.name || ''} className="w-full px-4 py-3 rounded-lg text-sm text-slate-900 outline-none" style={inputStyle} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{color:'var(--text-low)',fontFamily:'Fira Code,monospace'}}>Email</label>
                        <input type="email" defaultValue={session.user?.email || ''} disabled className="w-full px-4 py-3 rounded-lg text-sm cursor-not-allowed" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(0,123,255,0.1)',color:'var(--text-low)'}} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{color:'var(--text-low)',fontFamily:'Fira Code,monospace'}}>Phone Number</label>
                      <input type="tel" placeholder="07XX XXX XXX" className="w-full px-4 py-3 rounded-lg text-sm text-slate-900 outline-none" style={inputStyle} />
                    </div>
                    <button type="submit" className="btn-primary px-6 py-3 text-sm">Save Changes</button>
                  </form>
                </div>
              )}

              {/* Addresses */}
              {activeTab === 'addresses' && (
                <div className="rounded-xl p-6 glass" style={{border:'1px solid rgba(0,123,255,0.2)'}}>
                  <div className="text-center py-16">
                    <MapPin className="w-16 h-16 mx-auto mb-4" style={{color:'rgba(0,123,255,0.2)'}} />
                    <p className="font-bold text-slate-900" style={{fontFamily:'Montserrat,sans-serif'}}>No saved addresses</p>
                    <p className="text-sm mt-1 mb-6" style={{color:'var(--text-low)'}}>Addresses you save at checkout will appear here</p>
                    <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition" style={{border:'1px solid var(--accent-blue)',color:'var(--accent-blue)'}}>
                      Browse Products
                    </Link>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
