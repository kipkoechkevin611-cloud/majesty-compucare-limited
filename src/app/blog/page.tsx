import Link from 'next/link'
import { ArrowRight, Clock, User, Tag, Rss } from 'lucide-react'

const posts = [
  {
    slug: 'how-to-maintain-your-laptop',
    title: 'How to Maintain Your Laptop for Longer Life',
    excerpt: 'Simple habits that keep your laptop running fast and cool — cleaning vents, managing startup apps, updating drivers, and knowing when to bring it in for a service.',
    category: 'Tips & Tricks',
    author: 'Majesty Compucare',
    date: 'June 10, 2025',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80&auto=format&fit=crop',
    featured: true,
  },
  {
    slug: 'why-cctv-matters-for-your-business',
    title: 'Why Every Business in Kenya Needs a CCTV System',
    excerpt: 'Security cameras are no longer a luxury — they are a necessity. Learn how CCTV reduces theft, improves staff accountability, and lowers insurance costs.',
    category: 'Security',
    author: 'Majesty Compucare',
    date: 'May 28, 2025',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop',
    featured: true,
  },
  {
    slug: 'best-printers-for-office-2025',
    title: 'Best Printers for Small Offices in Kenya — 2025 Guide',
    excerpt: 'Epson, Canon or HP? We break down the top printers available at Majesty Compucare, what they cost to run, and which is best for your business needs.',
    category: 'Buying Guide',
    author: 'Majesty Compucare',
    date: 'May 15, 2025',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&q=80&auto=format&fit=crop',
    featured: false,
  },
  {
    slug: 'networking-basics-for-small-business',
    title: 'Networking Basics Every Small Business Owner Should Know',
    excerpt: 'Routers, switches, Wi-Fi extenders — what does your business actually need? Our technicians explain the essentials in plain language.',
    category: 'Networking',
    author: 'Majesty Compucare',
    date: 'April 30, 2025',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80&auto=format&fit=crop',
    featured: false,
  },
  {
    slug: 'data-backup-guide',
    title: 'Never Lose Your Data Again — A Simple Backup Guide',
    excerpt: 'Hard drives fail without warning. Learn how to set up automatic backups using cloud storage and external drives — before it is too late.',
    category: 'Tips & Tricks',
    author: 'Majesty Compucare',
    date: 'April 18, 2025',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=800&q=80&auto=format&fit=crop',
    featured: false,
  },
  {
    slug: 'signs-your-computer-needs-repair',
    title: '7 Signs Your Computer Needs a Professional Repair',
    excerpt: 'Slow performance, random crashes, overheating, strange noises — know when to stop Googling fixes and bring your machine to the experts.',
    category: 'Repair',
    author: 'Majesty Compucare',
    date: 'March 22, 2025',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800&q=80&auto=format&fit=crop',
    featured: false,
  },
]

const categoryColors: Record<string, string> = {
  'Tips & Tricks': 'bg-blue-100 text-blue-700',
  'Security':      'bg-red-100 text-red-700',
  'Buying Guide':  'bg-green-100 text-green-700',
  'Networking':    'bg-purple-100 text-purple-700',
  'Repair':        'bg-orange-100 text-orange-700',
}

export default function BlogPage() {
  const featured = posts.filter(p => p.featured)
  const rest     = posts.filter(p => !p.featured)

  return (
    <div className="flex flex-col" style={{ background: 'var(--bg-primary)' }}>

      {/* Hero */}
      <section className="py-16 relative overflow-hidden" style={{ background: 'var(--bg-surface2)', borderBottom: '1px solid rgba(0,123,255,0.15)' }}>
        <div className="absolute inset-0 radial-glow" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs bg-blue-100 text-blue-700 mb-4" style={{ fontFamily: 'Fira Code,monospace' }}>
            <Rss className="w-3.5 h-3.5" />
            // TECH_BLOG
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3" style={{ fontFamily: 'Montserrat,sans-serif' }}>
            Tech Tips &amp; <span style={{ color: 'var(--accent-blue)' }}>Insights</span>
          </h1>
          <p className="text-base max-w-2xl mx-auto text-slate-600">
            Expert advice, buying guides, repair tips, and tech news from the Majesty Compucare team in Nakuru &amp; Kisumu.
          </p>
        </div>
      </section>

      {/* Featured posts */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm mb-2 text-blue-600" style={{ fontFamily: 'Fira Code,monospace' }}>// FEATURED_POSTS</p>
          <h2 className="text-2xl font-black text-slate-900 mb-8" style={{ fontFamily: 'Montserrat,sans-serif' }}>Editor&apos;s Picks</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featured.map(post => (
              <article key={post.slug} className="group rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition bg-white">
                <div className="relative h-52 overflow-hidden">
                  <img src={post.image} alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full ${categoryColors[post.category] || 'bg-gray-100 text-gray-700'}`}>
                    {post.category}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3" style={{ fontFamily: 'Fira Code,monospace' }}>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-blue-600 transition leading-snug" style={{ fontFamily: 'Montserrat,sans-serif' }}>
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{post.excerpt}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 group-hover:gap-2.5 transition-all">
                    Read Article <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* All posts */}
      <section className="py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm mb-2 text-blue-600" style={{ fontFamily: 'Fira Code,monospace' }}>// MORE_ARTICLES</p>
          <h2 className="text-2xl font-black text-slate-900 mb-8" style={{ fontFamily: 'Montserrat,sans-serif' }}>More Articles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map(post => (
              <article key={post.slug} className="group rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition bg-white flex flex-col">
                <div className="relative h-44 overflow-hidden flex-shrink-0">
                  <img src={post.image} alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${categoryColors[post.category] || 'bg-gray-100 text-gray-700'}`}>
                    {post.category}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-2" style={{ fontFamily: 'Fira Code,monospace' }}>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 mb-2 group-hover:text-blue-600 transition leading-snug flex-1" style={{ fontFamily: 'Montserrat,sans-serif' }}>
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 mt-auto">
                    Read More <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-blue-600">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-white mb-3" style={{ fontFamily: 'Montserrat,sans-serif' }}>
            Need Tech Help? We&apos;re Just a Call Away.
          </h2>
          <p className="text-blue-100 mb-6">Visit us in Nakuru or Kisumu — our technicians are ready to help.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold bg-white text-blue-600 hover:bg-blue-50 transition">
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/services" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold bg-transparent text-white border border-white/40 hover:bg-white/10 transition">
              Our Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
