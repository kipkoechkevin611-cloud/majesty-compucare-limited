'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Shield, Clock, Headphones, Award, Star, MessageCircle, ShoppingCart, Monitor, Printer, Video, Wifi, Package, CheckCircle, Phone, MapPin, Mail } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

export default function Home() {
  const { addToCart } = useCart()
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [addedId, setAddedId] = useState<string | null>(null)
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [contactSent, setContactSent] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products?featured=true&limit=4'),
          fetch('/api/categories'),
        ])
        if (productsRes.ok) {
          const d = await productsRes.json()
          setFeaturedProducts(d.products || d || [])
        }
        if (categoriesRes.ok) setCategories(await categoriesRes.json() || [])
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetchData()
  }, [])

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      category: product.category?.name || '',
      image: product.images?.[0] || '',
    })
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault()
    setContactSent(true)
    setContactForm({ name: '', email: '', message: '' })
    setTimeout(() => setContactSent(false), 4000)
  }

  const services = [
    { icon: Monitor, title: 'Computer Repair', desc: 'Expert repair services for all computer brands and models', color: 'bg-blue-500' },
    { icon: Printer, title: 'Printer Maintenance', desc: 'Regular maintenance and repair for all printer types', color: 'bg-purple-500' },
    { icon: Video, title: 'CCTV Installation', desc: 'Professional security camera installation and setup', color: 'bg-red-500' },
    { icon: Wifi, title: 'Network Setup', desc: 'Complete networking solutions for homes and businesses', color: 'bg-green-500' },
    { icon: Shield, title: 'Data Recovery', desc: 'Secure data recovery from damaged storage devices', color: 'bg-orange-500' },
    { icon: Headphones, title: 'IT Support', desc: '24/7 technical support for all your IT needs', color: 'bg-teal-500' },
  ]

  const testimonials = [
    { name: 'Alice Wambui', role: 'Business Owner, Nakuru', text: 'Excellent service! They installed our CCTV system professionally and the support has been outstanding. Highly recommend!' },
    { name: 'John Kamau', role: 'IT Manager', text: 'Fast delivery and genuine products. I\'ve been buying laptops and networking equipment from them for 3 years now.' },
    { name: 'Grace Muthoni', role: 'Teacher, Nakuru', text: 'They repaired my laptop quickly and at a fair price. Very professional team. Will definitely come back!' },
  ]

  return (
    <div className="flex flex-col" style={{background:'var(--bg-primary)'}}>

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center bg-gradient-to-br from-slate-50 via-blue-50 to-white">
        <div className="absolute inset-0">
          <img src="/hero.jpeg" alt="Majesty Compucare - Technology Solutions"
            className="w-full h-full object-cover opacity-25 md:opacity-35 blur-sm md:blur" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/30" />
        </div>
        <div className="absolute inset-0 pattern-subtle" />
        {/* Decorative blobs */}
        <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] rounded-full animate-pulse" style={{background:'radial-gradient(circle,rgba(0,102,204,0.08) 0%,transparent 70%)'}} />
        <div className="absolute bottom-[-5%] left-[5%] w-[400px] h-[400px] rounded-full" style={{background:'radial-gradient(circle,rgba(22,163,74,0.05) 0%,transparent 70%)'}} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs bg-blue-100 text-blue-700" style={{fontFamily:'Fira Code,monospace'}}>
                <span className="w-2 h-2 rounded-full animate-pulse bg-green-500" />
                // NAKURU &amp; KISUMU — TRUSTED TECH PARTNER SINCE 2014
              </div>
              <h1 style={{fontFamily:'Montserrat,sans-serif',fontWeight:900,lineHeight:1.05}} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-slate-900">
                PREMIUM<br />
                <span className="text-blue-600">TECH SALES</span><br />
                <span className="text-3xl sm:text-4xl md:text-5xl text-green-600">& REPAIR</span>
              </h1>
              <p className="text-lg max-w-lg leading-relaxed text-slate-600">
                Computers · Laptops · Printers · CCTV · Networking · IT Services — all under one roof. Fast. Genuine. Trusted.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products" className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:px-8 sm:py-4 sm:text-base">
                  <ShoppingCart className="w-5 h-5" /> Shop Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/services" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:px-8 sm:py-4 sm:text-base rounded-lg font-semibold transition bg-white text-slate-700 border border-green-200 hover:border-green-300 shadow-sm">
                  Our Services <ArrowRight className="w-4 h-4 opacity-60" />
                </Link>
              </div>
              {/* Stats */}
              <div className="flex items-center gap-6 md:gap-8 pt-2">
                {[['10+','Years'],['5,000+','Customers'],['24/7','Support'],['100%','Genuine']].map(([val,lbl])=>(
                  <div key={lbl} className="text-center">
                    <p className="text-2xl font-black text-blue-600" style={{fontFamily:'Montserrat,sans-serif'}}>{val}</p>
                    <p className="text-[10px] mt-0.5 uppercase tracking-widest text-slate-500" style={{fontFamily:'Fira Code,monospace'}}>{lbl}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-5 flex-wrap">
                {[{icon:Shield,t:'Warranty on all products'},{icon:CheckCircle,t:'Same-day repair'}].map(({icon:Ic,t})=>(
                  <div key={t} className="flex items-center gap-2 text-sm text-slate-600">
                    <Ic className="w-4 h-4 flex-shrink-0 text-green-600" />{t}
                  </div>
                ))}
              </div>
            </div>

            {/* Image cards */}
            <div className="hidden lg:flex flex-col gap-4">
              <div className="relative rounded-2xl overflow-hidden h-52 group shadow-lg border border-slate-200">
                <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=85&auto=format&fit=crop"
                  alt="Laptops" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <p className="text-blue-400 text-xs mb-1" style={{fontFamily:'Fira Code,monospace'}}>// FEATURED</p>
                  <p className="text-xl font-black text-white" style={{fontFamily:'Montserrat,sans-serif'}}>Laptops & Computers</p>
                  <p className="text-sm mt-0.5 text-slate-300">HP · Dell · Lenovo & more</p>
                </div>
                <div className="absolute top-4 right-4 px-3 py-1 rounded text-xs font-bold bg-blue-600 text-white shadow-md">50+ Models</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {src:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=85&auto=format&fit=crop',title:'CCTV & Security',sub:'HD & 4K systems'},
                  {src:'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=85&auto=format&fit=crop',title:'Networking & IT',sub:'Routers · Switches'},
                ].map(({src,title,sub})=>(
                  <div key={title} className="relative rounded-2xl overflow-hidden h-44 group shadow-md border border-slate-200">
                    <img src={src} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4">
                      <p className="text-sm font-bold text-white" style={{fontFamily:'Montserrat,sans-serif'}}>{title}</p>
                      <p className="text-xs mt-0.5 text-slate-300">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Floating badge */}
              <div className="absolute top-[24%] right-[2.5%] bg-white px-4 py-3 flex items-center gap-3 rounded-xl shadow-lg border border-green-200">
                <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-600" />
                <div>
                  <p className="text-xs font-bold text-slate-900" style={{fontFamily:'Montserrat,sans-serif'}}>Repair Done ✓</p>
                  <p className="text-[10px] text-slate-500" style={{fontFamily:'Fira Code,monospace'}}>same-day · guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom border line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
      </section>

      {/* ═══ CATEGORY STRIP ═══ */}
      {categories.length > 0 && (
        <section className="bg-slate-100 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto gap-2 py-3 scrollbar-hide">
              {categories.map((cat: any) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="flex-shrink-0 px-5 py-2 rounded-full text-xs font-semibold transition border border-blue-200 bg-blue-50 text-slate-600 hover:text-green-600 hover:border-green-300 hover:shadow-sm"
                  style={{
                    fontFamily: 'Montserrat,sans-serif',
                    letterSpacing: '0.05em',
                  }}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ FEATURED PRODUCTS ═══ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-blue-600 text-sm mb-2" style={{fontFamily:'Fira Code,monospace'}}>// TOP_PICKS</p>
              <h2 className="text-3xl text-slate-900" style={{fontFamily:'Montserrat,sans-serif',fontWeight:800}}>Featured Products</h2>
            </div>
            <Link href="/products" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="rounded-xl overflow-hidden animate-pulse bg-slate-100">
                  <div className="h-48 bg-slate-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 rounded w-3/4 bg-slate-200" />
                    <div className="h-3 rounded w-1/2 bg-slate-200" />
                    <div className="h-8 rounded mt-3 bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16 rounded-xl bg-slate-50 border border-slate-200">
              <Package className="w-16 h-16 mx-auto mb-4 text-blue-300" />
              <p className="font-semibold text-slate-900">No featured products yet</p>
              <p className="text-sm mt-1 text-slate-500">Add products via the admin panel</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="glow-card rounded-xl overflow-hidden group bg-slate-50 border border-slate-200">
                  <Link href={`/products/${product.id}`} className="block">
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-blue-200">
                          <Package className="w-16 h-16" />
                        </div>
                      )}
                      {product.salePrice && product.salePrice < product.price && (
                        <span className="absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded bg-red-500 shadow-sm">
                          {Math.round((1 - product.salePrice / product.price) * 100)}% OFF
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs mb-1 text-blue-600" style={{fontFamily:'Fira Code,monospace'}}>{product.category?.name}</p>
                      <h3 className="text-sm font-semibold leading-snug mb-3 line-clamp-2 text-slate-900 group-hover:text-blue-600 transition" style={{fontFamily:'Montserrat,sans-serif'}}>{product.name}</h3>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-lg font-black text-green-600" style={{fontFamily:'Montserrat,sans-serif'}}>KES {(product.salePrice || product.price).toLocaleString()}</span>
                        {product.salePrice && <span className="text-xs line-through text-slate-400">KES {product.price.toLocaleString()}</span>}
                      </div>
                    </div>
                  </Link>
                  <div className="px-4 pb-4">
                    <button onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}
                      className="w-full py-2.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2"
                      style={addedId === product.id
                        ? {background:'#dcfce7',color:'#16a34a',border:'1px solid #16a34a'}
                        : {background:'#0066cc',color:'#fff'}}>
                      {addedId === product.id ? <><CheckCircle className="w-4 h-4" /> Added!</> : <><ShoppingCart className="w-4 h-4" /> Add to Cart</>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link href="/products" className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-bold transition border border-blue-600 text-blue-600 hover:bg-blue-50"
              style={{fontFamily:'Montserrat,sans-serif'}}>
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ NEW ARRIVALS ═══ */}
      <section className="py-16 bg-gradient-to-br from-blue-700 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")"}} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-blue-200 text-sm mb-1" style={{fontFamily:'Fira Code,monospace'}}>// JUST_ARRIVED</p>
              <h2 className="text-3xl text-white" style={{fontFamily:'Montserrat,sans-serif',fontWeight:800}}>New Arrivals</h2>
              <p className="text-blue-100 text-sm mt-1">Fresh stock — just landed at our Nakuru &amp; Kisumu branches</p>
            </div>
            <Link href="/products" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-white/80 hover:text-white transition">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {emoji:'💻', name:'Laptops', sub:'HP, Dell, Lenovo', slug:'laptops'},
              {emoji:'🖨️', name:'Printers', sub:'Epson, Canon, HP', slug:'printers'},
              {emoji:'📷', name:'CCTV', sub:'HD & 4K Systems', slug:'cctv-systems'},
              {emoji:'🌐', name:'Networking', sub:'Routers, Switches', slug:'networking'},
              {emoji:'📱', name:'Phone Acc.', sub:'Chargers, Headsets', slug:'phone-accessories'},
              {emoji:'🖥️', name:'Monitors', sub:'Full HD Displays', slug:'accessories'},
            ].map(item => (
              <Link key={item.slug} href={`/products?category=${item.slug}`}
                className="group flex flex-col items-center rounded-xl p-4 text-center border border-white/10 bg-white/10 hover:bg-white/20 transition backdrop-blur-sm">
                <span className="text-4xl mb-2">{item.emoji}</span>
                <p className="text-sm font-black text-white leading-tight" style={{fontFamily:'Montserrat,sans-serif'}}>{item.name}</p>
                <p className="text-[10px] text-blue-200 mt-0.5">{item.sub}</p>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ═══ OFFERS & DEALS ═══ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-blue-600 text-sm mb-1" style={{fontFamily:'Fira Code,monospace'}}>// SPECIAL_OFFERS</p>
              <h2 className="text-3xl text-slate-900" style={{fontFamily:'Montserrat,sans-serif',fontWeight:800}}>Current Offers &amp; Deals</h2>
              <p className="mt-1 text-slate-500 text-sm">Limited-time packages for repairs, installations &amp; ICT bundles</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {emoji:'💻',badge:'HOT DEAL',badgeColor:'bg-red-500',title:'Laptop Service & Tune-Up',desc:'Full cleaning, thermal paste, OS optimization &amp; virus removal — all in one visit.',originalPrice:3500,offerPrice:1999,features:['Deep cleaning & dust removal','Thermal paste replacement','Windows optimization','Antivirus removal']},
              {emoji:'📷',badge:'BUNDLE OFFER',badgeColor:'bg-blue-600',title:'CCTV 4-Camera Package',desc:'4 HD cameras, DVR, cables &amp; professional installation included.',originalPrice:45000,offerPrice:35000,features:['4 HD cameras (1080p)','DVR recorder + hard drive','Professional installation','1-year warranty']},
              {emoji:'🖨️',badge:'SAVE 25%',badgeColor:'bg-green-600',title:'Printer Maintenance Plan',desc:'Monthly servicing — cleaning, alignment &amp; nozzle check for your office.',originalPrice:4000,offerPrice:3000,features:['Monthly servicing visit','Nozzle cleaning & alignment','Ink cartridge check','Priority support']},
              {emoji:'📡',badge:'NEW OFFER',badgeColor:'bg-purple-600',title:'Network Setup — Office',desc:'Professional Wi-Fi &amp; LAN installation with configuration &amp; training.',originalPrice:15000,offerPrice:10000,features:['Router & switch config','Structured cabling','Wi-Fi optimization','Staff training']},
              {emoji:'💾',badge:'FREE BONUS',badgeColor:'bg-orange-500',title:'Free Data Backup with Repair',desc:'Bring any device for repair and get a FREE data backup — worth KES 1,000.',originalPrice:1000,offerPrice:0,features:['Full data backup','Organized folder structure','External drive transfer','Before-repair safety copy']},
              {emoji:'🏫',badge:'SCHOOLS',badgeColor:'bg-teal-600',title:'School ICT Lab Package',desc:'Complete computer lab setup — supply, networking, software &amp; staff training.',originalPrice:null,offerPrice:null,features:['Bulk laptop/desktop supply','Network & server setup','Software licensing','Staff IT training']},
            ].map((deal,i)=>(
              <div key={i} className="relative rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition bg-white flex flex-col overflow-hidden">
                <div className="absolute top-0 right-0 z-10">
                  <div className={`text-white text-[10px] font-black px-3 py-1 rounded-bl-xl ${deal.badgeColor}`}>{deal.badge}</div>
                </div>
                <div className="p-6 pb-4 flex-1">
                  <span className="text-4xl mb-3 block">{deal.emoji}</span>
                  <h3 className="text-base font-black text-slate-900 mb-2 leading-snug" style={{fontFamily:'Montserrat,sans-serif'}}>{deal.title}</h3>
                  <p className="text-xs text-slate-500 mb-3 leading-relaxed" dangerouslySetInnerHTML={{__html:deal.desc}} />
                  <ul className="space-y-1">
                    {deal.features.map(f=>(
                      <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-6 pb-5 pt-3 border-t border-slate-100">
                  {deal.offerPrice !== null ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-green-600" style={{fontFamily:'Montserrat,sans-serif'}}>
                        {deal.offerPrice === 0 ? 'FREE' : `KES ${deal.offerPrice.toLocaleString()}`}
                      </span>
                      {deal.originalPrice && <span className="text-xs line-through text-slate-400">KES {deal.originalPrice.toLocaleString()}</span>}
                    </div>
                  ) : (
                    <p className="text-sm font-semibold text-slate-600">📞 Call for quote</p>
                  )}
                  <a href="https://wa.me/254716000367" target="_blank" rel="noopener noreferrer"
                    className="mt-3 w-full py-2 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-2 transition hover:opacity-90"
                    style={{background:'#25D366'}}>
                    <MessageCircle className="w-3.5 h-3.5" /> Claim on WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BLOG ═══ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-blue-600 text-sm mb-1" style={{fontFamily:'Fira Code,monospace'}}>// TECH_BLOG</p>
            <h2 className="text-3xl text-slate-900" style={{fontFamily:'Montserrat,sans-serif',fontWeight:800}}>Tech Tips &amp; Insights</h2>
            <p className="mt-1 text-slate-500 text-sm">Expert advice from the Majesty Compucare team</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {img:'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80&auto=format&fit=crop',cat:'Tips & Tricks',catColor:'bg-blue-100 text-blue-700',title:'How to Maintain Your Laptop for Longer Life',excerpt:'Simple habits that keep your laptop running fast — cleaning vents, updating drivers, and knowing when to bring it in.',date:'June 10, 2025',read:'4 min'},
              {img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop',cat:'Security',catColor:'bg-red-100 text-red-700',title:'Why Every Business Needs a CCTV System',excerpt:'Security cameras reduce theft, improve accountability, and lower insurance costs. Here\'s what you need to know.',date:'May 28, 2025',read:'5 min'},
              {img:'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&q=80&auto=format&fit=crop',cat:'Buying Guide',catColor:'bg-green-100 text-green-700',title:'Best Printers for Small Offices — 2025 Guide',excerpt:'Epson, Canon or HP? We break down the top printers, running costs, and which is best for your business.',date:'May 15, 2025',read:'6 min'},
              {img:'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80&auto=format&fit=crop',cat:'Networking',catColor:'bg-purple-100 text-purple-700',title:'Networking Basics Every Business Owner Should Know',excerpt:'Routers, switches, Wi-Fi extenders — what your business actually needs explained in plain language.',date:'Apr 30, 2025',read:'5 min'},
              {img:'https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=600&q=80&auto=format&fit=crop',cat:'Tips & Tricks',catColor:'bg-blue-100 text-blue-700',title:'Never Lose Your Data Again — Backup Guide',excerpt:'Hard drives fail without warning. Set up automatic backups using cloud and external drives before it\'s too late.',date:'Apr 18, 2025',read:'4 min'},
              {img:'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=600&q=80&auto=format&fit=crop',cat:'Repair',catColor:'bg-orange-100 text-orange-700',title:'7 Signs Your Computer Needs a Professional Repair',excerpt:'Slow performance, crashes, overheating — know when to stop Googling and bring your machine to the experts.',date:'Mar 22, 2025',read:'3 min'},
            ].map((post,i)=>(
              <article key={i} className="group rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition bg-white flex flex-col">
                <div className="relative h-44 overflow-hidden flex-shrink-0">
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${post.catColor}`}>{post.cat}</span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-2" style={{fontFamily:'Fira Code,monospace'}}>
                    <span>{post.read} read</span><span>·</span><span>{post.date}</span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 mb-2 leading-snug flex-1" style={{fontFamily:'Montserrat,sans-serif'}}>{post.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{post.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY CHOOSE US ═══ */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-blue-600 text-sm mb-2" style={{fontFamily:'Fira Code,monospace'}}>// WHY_US</p>
            <h2 className="text-3xl text-slate-900" style={{fontFamily:'Montserrat,sans-serif',fontWeight:800}}>Why Choose Majesty Compucare</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {icon:Award,title:'Genuine Products',desc:'Only authentic, high-quality tech products',color:'text-blue-600',bg:'bg-blue-100'},
              {icon:Clock,title:'Fast Service',desc:'Quick turnaround on repairs & deliveries',color:'text-green-600',bg:'bg-green-100'},
              {icon:Headphones,title:'Expert Support',desc:'Professional technicians always ready to help',color:'text-blue-600',bg:'bg-blue-100'},
              {icon:Shield,title:'Full Warranty',desc:'Comprehensive warranty on all products',color:'text-green-600',bg:'bg-green-100'},
            ].map(({icon:Icon,title,desc,color,bg})=>(
              <div key={title} className="glow-card rounded-xl p-6 text-center bg-white border border-slate-200 shadow-sm">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 ${bg}`}>
                  <Icon className={`w-7 h-7 ${color}`} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2" style={{fontFamily:'Montserrat,sans-serif'}}>{title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section className="py-20 relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-blue-600 text-sm mb-2" style={{fontFamily:'Fira Code,monospace'}}>// WHAT_WE_DO</p>
            <h2 className="text-3xl text-slate-900" style={{fontFamily:'Montserrat,sans-serif',fontWeight:800}}>Our Services</h2>
            <p className="mt-2 max-w-xl mx-auto text-slate-500">Comprehensive IT solutions to keep you running smoothly</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(({icon:Icon,title,desc})=>(
              <div key={title} className="glow-card rounded-xl p-6 bg-slate-50 border border-slate-200 group hover:shadow-md transition">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-blue-100 border border-blue-200">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition" style={{fontFamily:'Montserrat,sans-serif'}}>{title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/services" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
              Explore All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-blue-600 text-sm mb-2" style={{fontFamily:'Fira Code,monospace'}}>// CLIENT_FEEDBACK</p>
            <h2 className="text-3xl text-slate-900" style={{fontFamily:'Montserrat,sans-serif',fontWeight:800}}>What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({name,role,text})=>(
              <div key={name} className="glow-card rounded-xl p-6 bg-white border border-slate-200 shadow-sm">
                <div className="flex mb-4 gap-0.5">
                  {[1,2,3,4,5].map(s=><Star key={s} className="w-4 h-4 fill-current text-yellow-400" />)}
                </div>
                <p className="text-sm leading-relaxed mb-5 text-slate-600">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 bg-blue-600 text-white" style={{fontFamily:'Montserrat,sans-serif'}}>
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900" style={{fontFamily:'Montserrat,sans-serif'}}>{name}</p>
                    <p className="text-xs text-green-600" style={{fontFamily:'Fira Code,monospace'}}>{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-blue-600 text-sm mb-2" style={{fontFamily:'Fira Code,monospace'}}>// GET_IN_TOUCH</p>
              <h2 className="text-3xl text-slate-900 mb-4" style={{fontFamily:'Montserrat,sans-serif',fontWeight:800}}>We're Here to Help</h2>
              <p className="mb-8 text-slate-500">Have questions or need a quote? Reach out — we respond fast.</p>
              <div className="space-y-5">
                {[
                  {icon:MessageCircle,label:'WhatsApp',value:'0716 000 367',href:'https://wa.me/254716000367',color:'text-green-600',bg:'bg-green-100',border:'border-green-200'},
                  {icon:Phone,label:'Phone',value:'0716 000 367 / 0722 717 846',href:'tel:0716000367',color:'text-blue-600',bg:'bg-blue-100',border:'border-blue-200'},
                  {icon:Mail,label:'Email',value:'sales.compucare111@gmail.com',href:'mailto:sales.compucare111@gmail.com',color:'text-blue-600',bg:'bg-blue-100',border:'border-blue-200'},
                  {icon:MapPin,label:'Nakuru HQ',value:'Nyakinyua Building, Kangei, Nakuru',href:null,color:'text-red-600',bg:'bg-red-100',border:'border-red-200'},
                  {icon:MapPin,label:'Kisumu Branch',value:'Mega Plaza, GF, Oginga Odinga St',href:null,color:'text-green-600',bg:'bg-green-100',border:'border-green-200'},
                ].map(({icon:Icon,label,value,href,color,bg,border})=>(
                  <div key={label} className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${bg} ${border} border`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest mb-0.5 text-slate-500" style={{fontFamily:'Fira Code,monospace'}}>{label}</p>
                      {href ? <a href={href} className="text-sm font-medium text-slate-900 hover:text-blue-600 transition">{value}</a>
                        : <p className="text-sm font-medium text-slate-900">{value}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl p-8 bg-slate-50 border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6" style={{fontFamily:'Montserrat,sans-serif'}}>Send a Message</h3>
              {contactSent ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <CheckCircle className="w-14 h-14 mb-3 text-green-600" />
                  <p className="font-bold text-slate-900" style={{fontFamily:'Montserrat,sans-serif'}}>Message Sent!</p>
                  <p className="text-sm mt-1 text-slate-500">We'll get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleContact} className="space-y-4">
                  {[
                    {lbl:'Name',type:'text',key:'name',ph:'Your full name'},
                    {lbl:'Email',type:'email',key:'email',ph:'you@example.com'},
                  ].map(({lbl,type,key,ph})=>(
                    <div key={key}>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider text-slate-500" style={{fontFamily:'Fira Code,monospace'}}>{lbl}</label>
                      <input type={type} required value={(contactForm as any)[key]}
                        onChange={e=>setContactForm({...contactForm,[key]:e.target.value})}
                        className="w-full px-4 py-3 rounded-lg text-sm text-slate-900 outline-none transition bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        style={{fontFamily:'Roboto,sans-serif'}}
                        placeholder={ph} />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider text-slate-500" style={{fontFamily:'Fira Code,monospace'}}>Message</label>
                    <textarea required rows={4} value={contactForm.message}
                      onChange={e=>setContactForm({...contactForm,message:e.target.value})}
                      className="w-full px-4 py-3 rounded-lg text-sm text-slate-900 outline-none transition resize-none bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      style={{fontFamily:'Roboto,sans-serif'}}
                      placeholder="How can we help you?" />
                  </div>
                  <button type="submit" className="btn-primary w-full py-3">Send Message</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp FAB */}
      <a href="https://wa.me/254716000367" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center z-50 transition-transform hover:scale-110"
        style={{background:'#25D366',boxShadow:'0 0 20px rgba(37,211,102,0.5)'}}
        aria-label="Chat on WhatsApp">
        <MessageCircle className="w-7 h-7 text-white" />
      </a>
    </div>
  )
}
