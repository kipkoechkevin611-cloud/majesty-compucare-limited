'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, MessageCircle, Clock } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('Thank you for your message! We will get back to you soon.')
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to send message')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setError('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full px-4 py-3 rounded-lg text-sm text-slate-900 outline-none transition"
  const inputSty = {background:'rgba(0,123,255,0.06)',border:'1px solid rgba(0,123,255,0.2)'}
  const labelCls = "block text-xs font-semibold mb-2 uppercase tracking-wider"
  const labelSty = {color:'var(--text-low)',fontFamily:'Fira Code,monospace'}

  return (
    <div className="flex flex-col" style={{background:'var(--bg-primary)'}}>
      {/* Hero */}
      <section className="py-12 sm:py-20 relative overflow-hidden" style={{background:'var(--bg-surface2)',borderBottom:'1px solid rgba(0,123,255,0.15)'}}>
        <div className="absolute inset-0 radial-glow" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-label mb-4">// CONTACT_US</p>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4" style={{fontFamily:'Montserrat,sans-serif'}}>Contact Us</h1>
          <p className="text-lg max-w-3xl mx-auto" style={{color:'var(--text-low)'}}>
            Get in touch with us for any inquiries, support, or to discuss your technology needs
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <p className="section-label mb-3">// GET_IN_TOUCH</p>
                <h2 className="text-xl font-black text-slate-900 mb-3" style={{fontFamily:'Montserrat,sans-serif'}}>Get In Touch</h2>
                <p className="text-sm leading-relaxed" style={{color:'var(--text-low)'}}>
                  Have questions or need assistance? We're here to help. Reach out to us through any of the following channels.
                </p>
              </div>

              {[
                { icon: MapPin,        color:'var(--accent-blue)',  label:'Location',  lines:['Nyakinyua Building, Kangei, Nakuru, Kenya'] },
                { icon: Phone,         color:'var(--accent-blue)',  label:'Phone',     lines:['0716 000 367','0722 717 846'] },
                { icon: Mail,          color:'var(--accent-blue)',  label:'Email',     lines:['sales.compucare111@gmail.com'] },
                { icon: MessageCircle, color:'var(--accent-green)', label:'WhatsApp',  lines:['0716 000 367'] },
                { icon: Clock,         color:'var(--accent-blue)',  label:'Hours',     lines:['Mon–Fri: 8:00 AM – 6:00 PM','Sat: 9:00 AM – 4:00 PM','Sunday: Closed'] },
              ].map(({icon:Icon,color,label,lines}) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:'rgba(0,123,255,0.1)',border:'1px solid rgba(0,123,255,0.2)'}}>
                    <Icon className="w-5 h-5" style={{color}} />
                  </div>
                  <div>
                    <p className="text-xs font-bold mb-1" style={{color:'var(--text-high)',fontFamily:'Montserrat,sans-serif'}}>{label}</p>
                    {lines.map((l,i) => <p key={i} className="text-xs" style={{color:'var(--text-low)'}}>{l}</p>)}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="rounded-xl p-8 glass" style={{border:'1px solid rgba(0,123,255,0.2)'}}>
                <p className="section-label mb-4">// SEND_MESSAGE</p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className={labelCls} style={labelSty}>Full Name *</label>
                      <input type="text" id="name" required value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={inputCls} style={inputSty} placeholder="John Doe" />
                    </div>
                    <div>
                      <label htmlFor="email" className={labelCls} style={labelSty}>Email Address *</label>
                      <input type="email" id="email" required value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={inputCls} style={inputSty} placeholder="john@example.com" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="phone" className={labelCls} style={labelSty}>Phone Number</label>
                      <input type="tel" id="phone" value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={inputCls} style={inputSty} placeholder="07XX XXX XXX" />
                    </div>
                    <div>
                      <label htmlFor="subject" className={labelCls} style={labelSty}>Subject *</label>
                      <select id="subject" required value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className={inputCls} style={{...inputSty,color:'var(--text-low)'}}>
                        <option value="">Select a subject</option>
                        <option value="sales">Sales Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="service">Service Request</option>
                        <option value="quote">Request a Quote</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className={labelCls} style={labelSty}>Message *</label>
                    <textarea id="message" required rows={6} value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={inputCls + ' resize-none'} style={inputSty}
                      placeholder="Tell us about your inquiry..." />
                  </div>

                  {error && (
                    <div className="px-4 py-3 rounded-lg text-sm" style={{background:'rgba(255,69,0,0.1)',border:'1px solid rgba(255,69,0,0.3)',color:'var(--accent-red)'}}>
                      {error}
                    </div>
                  )}

                  <button type="submit" disabled={loading}
                    className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-16" style={{background:'var(--bg-surface2)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="section-label mb-3">// FIND_US</p>
            <h2 className="text-3xl font-black text-slate-900" style={{fontFamily:'Montserrat,sans-serif'}}>Find Us</h2>
            <p className="mt-2 text-sm" style={{color:'var(--text-low)'}}>Visit our store in Nakuru for in-person assistance</p>
          </div>
          <div className="rounded-xl overflow-hidden h-64 sm:h-72 lg:h-80 flex items-center justify-center" style={{background:'rgba(0,123,255,0.05)',border:'1px solid rgba(0,123,255,0.15)'}}>
            <div className="text-center">
              <MapPin className="w-14 h-14 mx-auto mb-3" style={{color:'rgba(0,123,255,0.3)'}} />
              <p className="font-bold text-slate-900" style={{fontFamily:'Montserrat,sans-serif'}}>Map Integration</p>
              <p className="text-sm mt-1" style={{color:'var(--text-low)',fontFamily:'Fira Code,monospace'}}>Nyakinyua Building, Kangei, Nakuru, Kenya</p>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-12 sm:py-16" style={{borderTop:'1px solid rgba(0,255,0,0.15)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-label mb-4">// WHATSAPP</p>
          <h2 className="text-3xl font-black text-slate-900 mb-4" style={{fontFamily:'Montserrat,sans-serif'}}>Chat with us on WhatsApp</h2>
          <p className="mb-8 max-w-2xl mx-auto text-sm" style={{color:'var(--text-low)'}}>
            Get instant responses to your questions. Our team is available on WhatsApp to assist you.
          </p>
          <a href="https://wa.me/254716000367" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-bold transition"
            style={{background:'rgba(0,255,0,0.1)',border:'1px solid rgba(0,255,0,0.35)',color:'var(--accent-green)',boxShadow:'0 0 18px rgba(0,255,0,0.12)'}}>
            <MessageCircle className="w-5 h-5" />
            Start WhatsApp Chat
          </a>
        </div>
      </section>
    </div>
  )
}
