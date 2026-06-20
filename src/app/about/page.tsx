import { Award, Users, Target, CheckCircle, MapPin, Phone, Mail, Monitor, Printer, Video, Wifi, Smartphone, Package, Wrench, Shield, Database, HardDrive, MessageCircle } from 'lucide-react'

export default function AboutPage() {
  const stats = [
    { icon: Award,       num: '10+',   label: 'Years Experience' },
    { icon: Users,       num: '5000+', label: 'Happy Customers' },
    { icon: Target,      num: '1000+', label: 'Projects Completed' },
    { icon: CheckCircle, num: '98%',   label: 'Satisfaction Rate' },
  ]
  const values = [
    { title: 'Integrity',       desc: 'We conduct business with honesty and transparency' },
    { title: 'Excellence',      desc: 'We strive for the highest quality in everything we do' },
    { title: 'Innovation',      desc: 'We embrace new technologies and creative solutions' },
    { title: 'Customer Focus',  desc: 'Our customers are at the heart of our business' },
  ]
  const team = [
    { initials: 'BB', name: 'Brian Bartoo',     role: 'Manager & Founder',  desc: 'Leading the company with vision and dedication to customer satisfaction' },
    { initials: 'TM', name: 'Technical Manager', role: 'Technical Lead',     desc: 'Expert in hardware and software solutions' },
    { initials: 'CS', name: 'Customer Service',  role: 'Support Team',       desc: 'Dedicated to providing excellent customer support' },
  ]
  const contacts = [
    { icon: MapPin, label: 'Location', value: 'Nyakinyua Building, Kangei, Nakuru, Kenya' },
    { icon: Phone,  label: 'Phone',    value: '0716 000 367 / 0722 717 846' },
    { icon: Mail,   label: 'Email',    value: 'sales.compucare111@gmail.com' },
  ]
  const branches = [
    {
      city: 'Nakuru — HQ',
      flag: '🏢',
      address: 'Nyakinyua Building, Kangei, Nakuru',
      phone1: '0716 000 367',
      phone2: '0722 717 846',
      email: 'sales.compucare111@gmail.com',
      whatsapp: '254716000367',
      manager: null,
      color: 'border-blue-500',
      badge: 'bg-blue-100 text-blue-700',
    },
    {
      city: 'Kisumu Branch',
      flag: '🌊',
      address: 'Mega Plaza, Ground Floor, Oginga Odinga Street, Kisumu',
      phone1: '0111 543 714',
      phone2: '0702 881 106',
      email: 'sales.compucare111@gmail.com',
      whatsapp: '254111543714',
      manager: 'Seth Awuoth (Manager)',
      secretary: 'Christine Ochang (Secretary)',
      color: 'border-green-500',
      badge: 'bg-green-100 text-green-700',
    },
  ]

  const products = [
    { icon: Monitor,    label: 'Laptops & Desktop Computers' },
    { icon: Printer,    label: 'Printers (Epson, Canon, HP)' },
    { icon: Video,      label: 'CCTV Cameras & Security Systems' },
    { icon: Monitor,    label: 'Monitors & Computer Accessories' },
    { icon: Wifi,       label: 'Networking Equipment (Routers, Switches)' },
    { icon: Smartphone, label: 'Phone Accessories (Chargers, Headsets, Smartwatches)' },
    { icon: Package,    label: 'Office Stationery' },
    { icon: Package,    label: 'Toners & Ink Cartridges' },
  ]
  const services = [
    { icon: Wrench,    label: 'Computer & Laptop Repair' },
    { icon: Printer,   label: 'Printer Repair & Maintenance' },
    { icon: Video,     label: 'CCTV Installation & Maintenance' },
    { icon: HardDrive, label: 'Software Installation & Troubleshooting' },
    { icon: Wifi,      label: 'Network Setup & Support' },
    { icon: Database,  label: 'Data Backup & System Optimization' },
  ]

  return (
    <div className="flex flex-col" style={{background:'var(--bg-primary)'}}>

      {/* Hero */}
      <section className="py-20 relative overflow-hidden" style={{background:'var(--bg-surface2)',borderBottom:'1px solid rgba(0,123,255,0.15)'}}>
        <div className="absolute inset-0 radial-glow" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4" style={{fontFamily:'Montserrat,sans-serif'}}>
            About <span style={{color:'var(--accent-blue)'}}>Majesty</span> Compucare
          </h1>
          <p className="text-xl font-semibold max-w-2xl mx-auto mb-3" style={{color:'var(--accent-blue)',fontFamily:'Montserrat,sans-serif'}}>
            &ldquo;Reliable Tech Solutions for Everyday Needs.&rdquo;
          </p>
          <p className="text-base max-w-3xl mx-auto" style={{color:'var(--text-low)'}}>
            Trusted ICT solutions provider based in Nakuru — serving businesses, institutions, and individuals since 2016
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-6" style={{fontFamily:'Montserrat,sans-serif'}}>Our Story</h2>
              {[
                'Majesty Compucare Limited is a trusted ICT solutions provider based in Nakuru, specializing in the sale, repair, and maintenance of computers, printers, and office equipment.',
                'We are committed to delivering reliable technology solutions, quality products, and exceptional customer service to businesses, institutions, and individuals across Kenya.',
                'Located in Nyakinyua Building, Kangei, Nakuru, our team of certified technicians and IT professionals are dedicated to providing the best tech experience — fast, genuine, and trusted.',
              ].map((p, i) => (
                <p key={i} className="mb-4 text-sm leading-relaxed" style={{color:'var(--text-low)'}}>{p}</p>
              ))}
            </div>
            <div className="rounded-2xl p-8 glass" style={{border:'1px solid rgba(0,123,255,0.2)'}}>
              <div className="grid grid-cols-2 gap-6">
                {stats.map(({icon: Icon, num, label}) => (
                  <div key={label} className="text-center">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3" style={{background:'rgba(0,123,255,0.12)',border:'1px solid rgba(0,123,255,0.2)'}}>
                      <Icon className="w-7 h-7" style={{color:'var(--accent-blue)'}} />
                    </div>
                    <p className="text-3xl font-black text-slate-900" style={{fontFamily:'Montserrat,sans-serif'}}>{num}</p>
                    <p className="text-xs mt-1" style={{color:'var(--text-low)'}}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16" style={{background:'var(--bg-surface2)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {label:'// MISSION', title:'Our Mission', text:'To provide innovative, reliable, and affordable technology solutions that empower businesses and individuals to achieve their goals. We are committed to delivering exceptional service, quality products, and unmatched technical support to our valued customers across Kenya.'},
              {label:'// VISION',  title:'Our Vision',  text:'To be the leading technology solutions provider in Kenya, recognized for excellence, innovation, and customer-centric approach. We aim to bridge the digital divide by making technology accessible and affordable for everyone.'},
            ].map(({label,title,text}) => (
              <div key={title} className="rounded-xl p-8 glass" style={{border:'1px solid rgba(0,123,255,0.2)'}}>
                <h3 className="text-2xl font-black text-slate-900 mb-4" style={{fontFamily:'Montserrat,sans-serif'}}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{color:'var(--text-low)'}}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900" style={{fontFamily:'Montserrat,sans-serif'}}>Our Core Values</h2>
            <p className="mt-2 text-sm" style={{color:'var(--text-low)'}}>The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="text-center rounded-xl p-6 glass glow-card" style={{border:'1px solid rgba(0,123,255,0.15)'}}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4" style={{background:'rgba(0,255,0,0.08)',border:'1px solid rgba(0,255,0,0.2)'}}>
                  <CheckCircle className="w-7 h-7" style={{color:'var(--accent-green)'}} />
                </div>
                <h3 className="text-base font-black text-slate-900 mb-2" style={{fontFamily:'Montserrat,sans-serif'}}>{v.title}</h3>
                <p className="text-xs leading-relaxed" style={{color:'var(--text-low)'}}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products & Services */}
      <section className="py-16" style={{background:'var(--bg-surface2)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10">

            {/* Products */}
            <div className="rounded-xl p-8 bg-white shadow-sm border border-blue-100">
              <h2 className="text-2xl font-black text-slate-900 mb-6" style={{fontFamily:'Montserrat,sans-serif'}}>Our Products</h2>
              <ul className="space-y-3">
                {products.map(({icon:Icon, label}) => (
                  <li key={label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:'rgba(0,102,204,0.1)'}}>
                      <Icon className="w-4 h-4" style={{color:'var(--accent-blue)'}} />
                    </div>
                    <span className="text-sm text-slate-700">{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="rounded-xl p-8 bg-white shadow-sm border border-green-100">
              <h2 className="text-2xl font-black text-slate-900 mb-6" style={{fontFamily:'Montserrat,sans-serif'}}>Our Services</h2>
              <ul className="space-y-3">
                {services.map(({icon:Icon, label}) => (
                  <li key={label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:'rgba(22,163,74,0.1)'}}>
                      <Icon className="w-4 h-4" style={{color:'var(--accent-green)'}} />
                    </div>
                    <span className="text-sm text-slate-700">{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16" style={{background:'var(--bg-surface2)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900" style={{fontFamily:'Montserrat,sans-serif'}}>Meet Our Team</h2>
            <p className="mt-2 text-sm" style={{color:'var(--text-low)'}}>Dedicated professionals committed to your success</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map(({initials,name,role,desc}) => (
              <div key={name} className="rounded-xl p-6 text-center glass glow-card" style={{border:'1px solid rgba(0,123,255,0.2)'}}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-black" style={{background:'var(--accent-blue)',color:'#fff',boxShadow:'0 0 18px rgba(0,123,255,0.4)',fontFamily:'Montserrat,sans-serif'}}>
                  {initials}
                </div>
                <h3 className="text-base font-black text-slate-900 mb-1" style={{fontFamily:'Montserrat,sans-serif'}}>{name}</h3>
                <p className="text-xs font-semibold mb-3" style={{color:'var(--accent-green)',fontFamily:'Fira Code,monospace'}}>{role}</p>
                <p className="text-xs leading-relaxed" style={{color:'var(--text-low)'}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Branches */}
      <section className="py-16" style={{borderTop:'1px solid rgba(0,123,255,0.15)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900" style={{fontFamily:'Montserrat,sans-serif'}}>Find Us Near You</h2>
            <p className="mt-2 text-sm text-slate-500">Two convenient locations — Nakuru &amp; Kisumu</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {branches.map((b: any) => (
              <div key={b.city} className={`rounded-2xl bg-white border-l-4 ${b.color} shadow-sm p-7`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{b.flag}</span>
                    <div>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${b.badge}`}>{b.city}</span>
                    </div>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400" />
                    <span className="text-sm text-slate-700">{b.address}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="w-4 h-4 flex-shrink-0 text-slate-400" />
                    <div>
                      <a href={`tel:${b.phone1.replace(/\s/g,'')}`} className="text-sm font-semibold text-blue-600 hover:underline">{b.phone1}</a>
                      {b.phone2 && <><span className="text-slate-400 mx-1">/</span>
                      <a href={`tel:${b.phone2.replace(/\s/g,'')}`} className="text-sm font-semibold text-blue-600 hover:underline">{b.phone2}</a></>}
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="w-4 h-4 flex-shrink-0 text-slate-400" />
                    <a href={`mailto:${b.email}`} className="text-sm text-slate-600 hover:underline">{b.email}</a>
                  </li>
                  {b.manager && (
                    <li className="flex items-center gap-3">
                      <MessageCircle className="w-4 h-4 flex-shrink-0 text-slate-400" />
                      <span className="text-sm text-slate-700"><strong>{b.manager}</strong></span>
                    </li>
                  )}
                  {b.secretary && (
                    <li className="flex items-start gap-3">
                      <MessageCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-400" />
                      <span className="text-sm text-slate-700"><strong>{b.secretary}</strong></span>
                    </li>
                  )}
                </ul>
                <a href={`https://wa.me/${b.whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-green-500 text-white hover:bg-green-600 transition">
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp This Branch
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
