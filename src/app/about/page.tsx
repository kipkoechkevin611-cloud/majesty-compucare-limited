import { Award, Users, Target, CheckCircle, MapPin, Phone, Mail } from 'lucide-react'

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

  return (
    <div className="flex flex-col" style={{background:'var(--bg-primary)'}}>

      {/* Hero */}
      <section className="py-20 relative overflow-hidden" style={{background:'var(--bg-surface2)',borderBottom:'1px solid rgba(0,123,255,0.15)'}}>
        <div className="absolute inset-0 radial-glow" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-label mb-4">// ABOUT_US</p>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4" style={{fontFamily:'Montserrat,sans-serif'}}>
            About <span style={{color:'var(--accent-blue)'}}>Majesty</span> Compucare
          </h1>
          <p className="text-lg max-w-3xl mx-auto" style={{color:'var(--text-low)'}}>
            Your trusted technology partner in Kenya, delivering quality IT solutions since 2014
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-label mb-3">// OUR_STORY</p>
              <h2 className="text-3xl font-black text-slate-900 mb-6" style={{fontFamily:'Montserrat,sans-serif'}}>Our Story</h2>
              {[
                'Majesty Compucare Limited was established with a vision to provide cutting-edge technology solutions to businesses and individuals across Kenya. Founded by Brian Bartoo, our company has grown from a small computer repair shop to a comprehensive IT solutions provider.',
                'Located in Nyakinyua Building, Kangei, Nakuru, we have built a reputation for excellence, reliability, and customer satisfaction. Our team of certified technicians and IT professionals are dedicated to delivering top-notch services and products.',
                'We believe in building long-term relationships with our clients by understanding their unique needs and providing customized solutions that drive growth and efficiency.',
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
                <p className="section-label mb-3">{label}</p>
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
            <p className="section-label mb-3">// CORE_VALUES</p>
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

      {/* Team */}
      <section className="py-16" style={{background:'var(--bg-surface2)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-label mb-3">// THE_TEAM</p>
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

      {/* Contact */}
      <section className="py-16" style={{borderTop:'1px solid rgba(0,123,255,0.15)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-label mb-3">// GET_IN_TOUCH</p>
            <h2 className="text-3xl font-black text-slate-900" style={{fontFamily:'Montserrat,sans-serif'}}>Get In Touch</h2>
            <p className="mt-2 text-sm" style={{color:'var(--text-low)'}}>Visit us or reach out for any inquiries</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {contacts.map(({icon:Icon,label,value}) => (
              <div key={label} className="text-center rounded-xl p-8 glass" style={{border:'1px solid rgba(0,123,255,0.2)'}}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4" style={{background:'rgba(0,123,255,0.12)',border:'1px solid rgba(0,123,255,0.25)'}}>
                  <Icon className="w-7 h-7" style={{color:'var(--accent-blue)'}} />
                </div>
                <h3 className="text-base font-black text-slate-900 mb-2" style={{fontFamily:'Montserrat,sans-serif'}}>{label}</h3>
                <p className="text-sm" style={{color:'var(--text-low)'}}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
