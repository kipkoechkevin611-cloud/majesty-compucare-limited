import { Monitor, Printer, Video, Wifi, Shield, Headphones, Cpu, HardDrive, Database, Wrench, Settings, Smartphone } from 'lucide-react'

export default function ServicesPage() {
  const services = [
    {
      icon: Monitor,
      title: 'Computer & Laptop Repair',
      description: 'Expert diagnosis and repair services for all computer brands and models. We handle hardware and software issues, virus removal, and system optimization.',
      features: ['Hardware repair', 'Software troubleshooting', 'Virus removal', 'System optimization']
    },
    {
      icon: Printer,
      title: 'Printer Repair & Maintenance',
      description: 'Comprehensive printer services including installation, maintenance, and repair for HP, Epson, Canon, and other major brands.',
      features: ['Installation & setup', 'Regular maintenance', 'Cartridge replacement', 'Troubleshooting']
    },
    {
      icon: Video,
      title: 'CCTV Installation & Maintenance',
      description: 'Professional security camera installation and maintenance services for homes and businesses. We provide complete surveillance solutions.',
      features: ['Camera installation', 'Remote monitoring', 'Maintenance contracts', 'System upgrades']
    },
    {
      icon: Wifi,
      title: 'Network Setup & Support',
      description: 'Complete networking solutions including router configuration, switch setup, wireless network installation, and network security.',
      features: ['Router configuration', 'Wireless setup', 'Network security', 'Troubleshooting']
    },
    {
      icon: Shield,
      title: 'Data Recovery & Backup',
      description: 'Secure data recovery from damaged storage devices and comprehensive backup solutions to protect your important information.',
      features: ['Data recovery', 'Cloud backup', 'Local backup solutions', 'Data migration']
    },
    {
      icon: Headphones,
      title: 'Software Installation & Support',
      description: 'Professional software installation, configuration, and ongoing support for operating systems and business applications.',
      features: ['OS installation', 'Application setup', 'License management', 'Technical support']
    },
    {
      icon: Cpu,
      title: 'System Maintenance',
      description: 'Regular preventive maintenance to keep your systems running smoothly and extend the lifespan of your equipment.',
      features: ['Cleaning services', 'Performance tuning', 'Hardware upgrades', 'System health checks']
    },
    {
      icon: Database,
      title: 'IT Consultancy',
      description: 'Expert IT consulting services to help businesses make informed technology decisions and optimize their IT infrastructure.',
      features: ['Technology planning', 'Infrastructure design', 'Cost optimization', 'Strategic advice']
    },
    {
      icon: Smartphone,
      title: 'Mobile Device Support',
      description: 'Support for smartphones and tablets including setup, repair, and optimization services.',
      features: ['Device setup', 'App installation', 'Data transfer', 'Troubleshooting']
    }
  ]

  return (
    <div className="flex flex-col" style={{background:'var(--bg-primary)'}}>
      {/* Hero */}
      <section className="py-12 sm:py-20 relative overflow-hidden" style={{background:'var(--bg-surface2)',borderBottom:'1px solid rgba(0,123,255,0.15)'}}>
        <div className="absolute inset-0 radial-glow" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4" style={{fontFamily:'Montserrat,sans-serif'}}>Our Services</h1>
          <p className="text-lg max-w-3xl mx-auto" style={{color:'var(--text-low)'}}>
            Comprehensive IT solutions to keep your business and personal technology running smoothly
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {services.map((service, index) => (
              <div key={index} className="rounded-xl p-6 glass glow-card" style={{border:'1px solid rgba(0,123,255,0.15)'}}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{background:'rgba(0,123,255,0.12)',border:'1px solid rgba(0,123,255,0.25)'}}>
                  <service.icon className="w-6 h-6" style={{color:'var(--accent-blue)'}} />
                </div>
                <h3 className="text-base font-black text-slate-900 mb-2" style={{fontFamily:'Montserrat,sans-serif'}}>{service.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{color:'var(--text-low)'}}>{service.description}</p>
                <ul className="space-y-1.5">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-xs gap-2" style={{color:'var(--text-low)'}}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background:'var(--accent-green)'}} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-16" style={{background:'var(--bg-surface2)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900" style={{fontFamily:'Montserrat,sans-serif'}}>Why Choose Our Services</h2>
            <p className="mt-2 text-sm" style={{color:'var(--text-low)'}}>We deliver excellence in every aspect of our service delivery</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Wrench,     title: 'Expert Technicians', desc: 'Certified and experienced professionals' },
              { icon: Settings,   title: 'Quick Response',     desc: 'Fast turnaround times for all services' },
              { icon: Shield,     title: 'Quality Guarantee',  desc: 'Warranty on all repair services' },
              { icon: Headphones, title: '24/7 Support',       desc: 'Round-the-clock technical assistance' },
            ].map((f, i) => (
              <div key={i} className="text-center rounded-xl p-6 glass" style={{border:'1px solid rgba(0,123,255,0.15)'}}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4" style={{background:'rgba(0,255,0,0.08)',border:'1px solid rgba(0,255,0,0.2)'}}>
                  <f.icon className="w-7 h-7" style={{color:'var(--accent-green)'}} />
                </div>
                <h3 className="text-sm font-black text-slate-900 mb-1" style={{fontFamily:'Montserrat,sans-serif'}}>{f.title}</h3>
                <p className="text-xs" style={{color:'var(--text-low)'}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900" style={{fontFamily:'Montserrat,sans-serif'}}>Our Service Process</h2>
            <p className="mt-2 text-sm" style={{color:'var(--text-low)'}}>Simple and efficient process to get your technology working</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { step: '01', title: 'Contact Us', desc: 'Reach out via phone, email, or visit our store' },
              { step: '02', title: 'Diagnosis',  desc: 'Our experts assess your issue and provide a quote' },
              { step: '03', title: 'Service',    desc: 'We perform the necessary repairs or installations' },
              { step: '04', title: 'Follow-up',  desc: 'We ensure everything works perfectly' },
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-black" style={{background:'var(--accent-blue)',color:'#fff',boxShadow:'0 0 18px rgba(0,123,255,0.4)',fontFamily:'Fira Code,monospace'}}>
                  {item.step}
                </div>
                <h3 className="text-sm font-black text-slate-900 mb-1" style={{fontFamily:'Montserrat,sans-serif'}}>{item.title}</h3>
                <p className="text-xs" style={{color:'var(--text-low)'}}>{item.desc}</p>
                {i < 3 && <div className="hidden md:block absolute top-8 left-full w-full h-px -translate-x-1/2" style={{background:'rgba(0,123,255,0.2)'}} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16" style={{background:'var(--bg-surface2)',borderTop:'1px solid rgba(0,123,255,0.15)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-4" style={{fontFamily:'Montserrat,sans-serif'}}>Need IT Services?</h2>
          <p className="mb-8 max-w-2xl mx-auto text-sm" style={{color:'var(--text-low)'}}>
            Contact us today for professional IT solutions. Our team is ready to help you with all your technology needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:0716000367" className="btn-primary inline-flex items-center justify-center px-8 py-4">
              Call Now: 0716 000 367
            </a>
            <a href="https://wa.me/254716000367" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-bold transition"
              style={{border:'1px solid var(--accent-green)',color:'var(--accent-green)'}}>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
