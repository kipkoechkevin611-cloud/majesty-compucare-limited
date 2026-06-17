import Link from 'next/link'
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{background:'var(--bg-surface2)',borderTop:'1px solid rgba(0,123,255,0.15)'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src="/logo.jpeg" alt="Majesty Compucare Logo" className="h-10 w-auto object-contain rounded-lg" />
              <div>
                <h3 className="text-base font-black" style={{fontFamily:'Montserrat,sans-serif',color:'var(--text-high)'}}>Majesty Compucare</h3>
                <p className="text-[10px]" style={{fontFamily:'Fira Code,monospace',color:'var(--accent-green)'}}>// Tech Partner Since 2014</p>
              </div>
            </div>
            <p className="text-xs italic mb-1 font-semibold" style={{color:'var(--accent-blue)',fontFamily:'Montserrat,sans-serif'}}>&ldquo;Reliable Tech Solutions for Everyday Needs.&rdquo;</p>
            <p className="text-sm leading-relaxed mb-5" style={{color:'var(--text-low)'}}>
              Trusted ICT solutions provider in Nakuru — specializing in computer sales, repairs, CCTV, networking, and IT support.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Facebook','Twitter','Instagram','LinkedIn'].map(s => (
                <a key={s} href="#" className="footer-social-link">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-black mb-5 uppercase tracking-widest" style={{fontFamily:'Montserrat,sans-serif',color:'var(--text-high)'}}>
              <span style={{color:'var(--accent-blue)'}}>// </span>Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[['/', 'Home'],['/about','About Us'],['/products','Products'],['/services','Services'],['/shop','Shop'],['/contact','Contact']].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm transition flex items-center gap-2 group" style={{color:'var(--text-low)'}}>
                    <span className="w-0 group-hover:w-3 h-px transition-all duration-200" style={{background:'var(--accent-green)'}} />
                    <span className="group-hover:text-slate-900 transition-colors">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-sm font-black mb-5 uppercase tracking-widest" style={{fontFamily:'Montserrat,sans-serif',color:'var(--text-high)'}}>
              <span style={{color:'var(--accent-blue)'}}>// </span>Products
            </h4>
            <ul className="space-y-2.5">
              {[
                ['/products?category=laptops','Laptops & Desktops'],
                ['/products?category=printers','Printers (Epson, Canon, HP)'],
                ['/products?category=cctv-systems','CCTV & Security'],
                ['/products?category=networking','Networking Equipment'],
                ['/products?category=accessories','Monitors & Accessories'],
                ['/products?category=phone-accessories','Phone Accessories'],
                ['/products?category=stationery','Office Stationery'],
                ['/products?category=toners-ink','Toners & Ink'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm transition flex items-center gap-2 group" style={{color:'var(--text-low)'}}>
                    <span className="w-0 group-hover:w-3 h-px transition-all duration-200" style={{background:'var(--accent-green)'}} />
                    <span className="group-hover:text-slate-900 transition-colors">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-black mb-5 uppercase tracking-widest" style={{fontFamily:'Montserrat,sans-serif',color:'var(--text-high)'}}>
              <span style={{color:'var(--accent-blue)'}}>// </span>Contact Us
            </h4>

            {/* Nakuru */}
            <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{color:'var(--accent-blue)',fontFamily:'Fira Code,monospace'}}>🏢 Nakuru HQ</p>
            <ul className="space-y-2 mb-5">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{color:'var(--accent-blue)'}} />
                <span className="text-xs" style={{color:'var(--text-low)'}}>Nyakinyua Building, Kangei, Nakuru</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{color:'var(--accent-blue)'}} />
                <div className="text-xs" style={{color:'var(--text-low)',fontFamily:'Fira Code,monospace'}}>
                  <p>0716 000 367</p>
                  <p>0722 717 846</p>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{color:'var(--accent-blue)'}} />
                <a href="mailto:sales.compucare111@gmail.com" className="text-xs transition hover:text-slate-900 break-all" style={{color:'var(--text-low)'}}>
                  sales.compucare111@gmail.com
                </a>
              </li>
            </ul>

            {/* Kisumu */}
            <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{color:'var(--accent-green)',fontFamily:'Fira Code,monospace'}}>🌊 Kisumu Branch</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{color:'var(--accent-green)'}} />
                <span className="text-xs" style={{color:'var(--text-low)'}}>Mega Plaza, GF, Oginga Odinga St, Kisumu</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{color:'var(--accent-green)'}} />
                <div className="text-xs" style={{color:'var(--text-low)',fontFamily:'Fira Code,monospace'}}>
                  <p>0111 543 714 (Seth)</p>
                  <p>0702 881 106 (Christine)</p>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 flex-shrink-0" style={{color:'var(--accent-green)'}} />
                <a href="https://wa.me/254111543714" target="_blank" rel="noopener noreferrer" className="text-xs transition hover:text-slate-900" style={{color:'var(--text-low)'}}>
                  WhatsApp Kisumu
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-10 pt-8" style={{borderTop:'1px solid rgba(0,123,255,0.1)'}}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-xs mb-3 uppercase tracking-widest" style={{color:'var(--text-low)',fontFamily:'Fira Code,monospace'}}>// Payment Methods</p>
              <div className="flex items-center space-x-3">
                <div className="px-4 py-1.5 rounded text-xs font-bold" style={{background:'rgba(0,255,0,0.12)',border:'1px solid rgba(0,255,0,0.3)',color:'var(--accent-green)',fontFamily:'Montserrat,sans-serif'}}>
                  M-Pesa
                </div>
                {['Cash','Bank Transfer'].map(m => (
                  <div key={m} className="px-4 py-1.5 rounded text-xs font-semibold" style={{background:'rgba(0,123,255,0.08)',border:'1px solid rgba(0,123,255,0.2)',color:'var(--text-low)',fontFamily:'Montserrat,sans-serif'}}>
                    {m}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-xs" style={{color:'var(--text-low)',fontFamily:'Fira Code,monospace'}}>
                M-Pesa Till: <span className="font-bold" style={{color:'var(--accent-green)'}}>3745188</span>
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 text-center" style={{borderTop:'1px solid rgba(0,123,255,0.08)'}}>
          <p className="text-xs" style={{color:'var(--text-low)',fontFamily:'Fira Code,monospace'}}>
            © {new Date().getFullYear()} <span style={{color:'var(--accent-blue)'}}>Majesty Compucare Limited</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
