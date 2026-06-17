'use client'

import Link from 'next/link'
import { ArrowRight, Tag, Clock, Zap, Gift, Percent, Phone, MessageCircle, CheckCircle, Star } from 'lucide-react'
import { useState } from 'react'

const deals = [
  {
    id: 1,
    badge: 'HOT DEAL',
    badgeColor: 'bg-red-500',
    title: 'Laptop Service & Tune-Up',
    description: 'Full laptop cleaning, thermal paste replacement, OS optimization, and virus removal — all in one visit.',
    originalPrice: 3500,
    offerPrice: 1999,
    saving: 1501,
    validUntil: 'June 30, 2025',
    icon: '💻',
    highlight: 'Most Popular',
    features: ['Deep cleaning & dust removal', 'Thermal paste replacement', 'Windows optimization', 'Antivirus scan & removal'],
  },
  {
    id: 2,
    badge: 'BUNDLE OFFER',
    badgeColor: 'bg-blue-600',
    title: 'CCTV 4-Camera Package',
    description: 'Complete HD CCTV system — 4 cameras, DVR, cables, and professional installation included.',
    originalPrice: 45000,
    offerPrice: 35000,
    saving: 10000,
    validUntil: 'July 15, 2025',
    icon: '📷',
    highlight: 'Best Value',
    features: ['4 HD cameras (1080p)', 'DVR recorder + hard drive', 'Professional installation', '1-year warranty'],
  },
  {
    id: 3,
    badge: 'SAVE 25%',
    badgeColor: 'bg-green-600',
    title: 'Printer Maintenance Plan',
    description: 'Monthly printer servicing — cleaning, alignment, nozzle check, and ink level management for your office.',
    originalPrice: 4000,
    offerPrice: 3000,
    saving: 1000,
    validUntil: 'Ongoing',
    icon: '🖨️',
    highlight: 'For Businesses',
    features: ['Monthly servicing visit', 'Nozzle cleaning & alignment', 'Ink cartridge check', 'Priority support'],
  },
  {
    id: 4,
    badge: 'NEW OFFER',
    badgeColor: 'bg-purple-600',
    title: 'Network Setup — Home or Office',
    description: 'Professional Wi-Fi and LAN network installation with full configuration, testing, and staff training.',
    originalPrice: 15000,
    offerPrice: 10000,
    saving: 5000,
    validUntil: 'August 1, 2025',
    icon: '📡',
    highlight: 'Includes Training',
    features: ['Router & switch configuration', 'Structured cabling (LAN)', 'Wi-Fi coverage optimization', 'Staff handover training'],
  },
  {
    id: 5,
    badge: 'LIMITED TIME',
    badgeColor: 'bg-orange-500',
    title: 'Free Data Backup with Any Repair',
    description: 'Bring in any laptop or desktop for repair and get a FREE data backup to external drive — worth KES 1,000.',
    originalPrice: 1000,
    offerPrice: 0,
    saving: 1000,
    validUntil: 'While stocks last',
    icon: '💾',
    highlight: 'Free Bonus',
    features: ['Full data backup', 'Organized folder structure', 'External drive transfer', 'Before-repair safety copy'],
  },
  {
    id: 6,
    badge: 'SCHOOL SPECIAL',
    badgeColor: 'bg-teal-600',
    title: 'School ICT Lab Setup Package',
    description: 'Complete computer lab setup for schools — sourcing, installation, networking, and software deployment.',
    originalPrice: null,
    offerPrice: null,
    saving: null,
    validUntil: 'Call for quote',
    icon: '🏫',
    highlight: 'Custom Quote',
    features: ['Bulk laptop/desktop supply', 'Network & server setup', 'Software licensing', 'Staff IT training'],
  },
]

const whyShop = [
  { icon: CheckCircle, text: 'Verified genuine products' },
  { icon: Zap,         text: 'Same-day repair in most cases' },
  { icon: Star,        text: 'Over 5,000 satisfied customers' },
  { icon: Gift,        text: 'Free delivery within Nakuru & Kisumu CBD' },
]

export default function OffersPage() {
  const [claimed, setClaimed] = useState<number | null>(null)

  return (
    <div className="flex flex-col" style={{ background: 'var(--bg-primary)' }}>

      {/* Hero */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs bg-white/20 text-white mb-4" style={{ fontFamily: 'Fira Code,monospace' }}>
            <Percent className="w-3.5 h-3.5" />
            // OFFERS_&amp;_DEALS
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3" style={{ fontFamily: 'Montserrat,sans-serif' }}>
            Exclusive <span className="text-yellow-300">Offers</span> &amp; Deals
          </h1>
          <p className="text-blue-100 text-base max-w-2xl mx-auto mb-6">
            Special discounts on repairs, installations, and ICT packages — available at our Nakuru &amp; Kisumu branches.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="https://wa.me/254716000367" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm bg-green-500 text-white hover:bg-green-600 transition">
              <MessageCircle className="w-4 h-4" /> Claim on WhatsApp
            </a>
            <a href="tel:0716000367"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm bg-white text-blue-700 hover:bg-blue-50 transition">
              <Phone className="w-4 h-4" /> Call: 0716 000 367
            </a>
          </div>
        </div>
      </section>

      {/* Why shop strip */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {whyShop.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <Icon className="w-4 h-4 text-green-600 flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deals grid */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm mb-2 text-blue-600" style={{ fontFamily: 'Fira Code,monospace' }}>// CURRENT_DEALS</p>
          <h2 className="text-2xl font-black text-slate-900 mb-8" style={{ fontFamily: 'Montserrat,sans-serif' }}>Current Deals &amp; Packages</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map(deal => (
              <div key={deal.id}
                className="relative rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition bg-white flex flex-col overflow-hidden group">

                {/* Highlight ribbon */}
                <div className="absolute top-0 right-0 z-10">
                  <div className={`text-white text-[10px] font-black px-3 py-1 rounded-bl-xl ${deal.badgeColor}`}>
                    {deal.highlight}
                  </div>
                </div>

                {/* Top */}
                <div className="p-6 pb-4 flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-4xl">{deal.icon}</span>
                    <span className={`text-[10px] font-black text-white px-2.5 py-1 rounded-full ${deal.badgeColor}`}>
                      {deal.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2 leading-snug" style={{ fontFamily: 'Montserrat,sans-serif' }}>
                    {deal.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{deal.description}</p>

                  {/* Features */}
                  <ul className="space-y-1.5 mb-4">
                    {deal.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price & CTA */}
                <div className="px-6 pb-6 border-t border-slate-100 pt-4">
                  {deal.offerPrice !== null ? (
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-2xl font-black text-green-600" style={{ fontFamily: 'Montserrat,sans-serif' }}>
                        {deal.offerPrice === 0 ? 'FREE' : `KES ${deal.offerPrice.toLocaleString()}`}
                      </span>
                      {deal.originalPrice && (
                        <span className="text-sm line-through text-slate-400">KES {deal.originalPrice.toLocaleString()}</span>
                      )}
                      {deal.saving && deal.saving > 0 && (
                        <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">
                          Save KES {deal.saving.toLocaleString()}
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm font-semibold text-slate-700 mb-3">📞 Call for custom quote</p>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      Valid: {deal.validUntil}
                    </div>
                  </div>

                  {claimed === deal.id ? (
                    <div className="w-full py-2.5 rounded-lg text-sm font-bold text-center bg-green-100 text-green-700 flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Noted! We&apos;ll contact you
                    </div>
                  ) : (
                    <button
                      onClick={() => { setClaimed(deal.id); setTimeout(() => setClaimed(null), 3000) }}
                      className="w-full py-2.5 rounded-lg text-sm font-bold text-white transition hover:opacity-90 flex items-center justify-center gap-2"
                      style={{ background: '#0066cc' }}>
                      <Tag className="w-4 h-4" /> Claim This Offer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-14 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Gift className="w-12 h-12 mx-auto mb-4 text-blue-600" />
          <h2 className="text-2xl font-black text-slate-900 mb-3" style={{ fontFamily: 'Montserrat,sans-serif' }}>
            Want a Custom Deal?
          </h2>
          <p className="text-slate-500 mb-6">
            We offer special packages for businesses, schools, and bulk orders. Talk to us — we&apos;ll find something that fits your budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/254716000367" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm bg-green-500 text-white hover:bg-green-600 transition">
              <MessageCircle className="w-4 h-4" /> WhatsApp: 0716 000 367
            </a>
            <Link href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm border border-blue-600 text-blue-600 hover:bg-blue-50 transition">
              Contact Page <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
