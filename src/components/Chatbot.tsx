'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { MessageCircle, X, Send, RotateCcw, ShoppingBag, FileText, Headphones, ChevronDown } from 'lucide-react'

interface Message {
  id: string
  role: 'bot' | 'user'
  text: string
  ts: number
}

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  shortDescription?: string
  brand?: string
  price: number
  salePrice?: number
  stock: number
  category?: { name: string; slug: string }
  images?: string[]
  featured?: boolean
}

const STORAGE_KEY = 'majesty_chat_history'
const WA_NAKURU   = 'https://wa.me/254716000367'
const WA_KISUMU   = 'https://wa.me/254111543714'

const KB: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['laptop', 'laptops', 'notebook', 'computer', 'computers', 'desktop', 'pc'],
    answer: 'We stock Laptops & Desktop Computers from major brands. Visit our Products page or WhatsApp us for current stock and pricing.',
  },
  {
    keywords: ['printer', 'printers', 'printing', 'epson', 'canon', 'hp printer', 'inkjet', 'laser'],
    answer: 'We carry Printers from Epson, Canon, and HP — inkjet, laser, and all-in-one models. We also offer Printer Repair & Maintenance services.',
  },
  {
    keywords: ['cctv', 'camera', 'cameras', 'security', 'surveillance', 'nvr', 'dvr'],
    answer: 'We supply and install CCTV Cameras & Security Systems for homes, offices, and businesses. We also offer CCTV Installation & Maintenance services.',
  },
  {
    keywords: ['network', 'networking', 'router', 'switch', 'wifi', 'wi-fi', 'lan', 'internet', 'cable'],
    answer: 'We supply Networking Equipment including routers and switches. We offer Network Setup & Support for offices and homes.',
  },
  {
    keywords: ['accessory', 'accessories', 'keyboard', 'mouse', 'monitor', 'headset', 'charger', 'cable', 'usb', 'hub'],
    answer: 'We stock Monitors & Computer Accessories including keyboards, mice, and more. Visit our store or WhatsApp us for current stock.',
  },
  {
    keywords: ['phone', 'smartphone', 'mobile', 'charger', 'headset', 'smartwatch'],
    answer: 'We stock Phone Accessories including chargers, headsets, and smartwatches. Visit our store for the full range.',
  },
  {
    keywords: ['software', 'windows', 'antivirus', 'os', 'operating system', 'license', 'office', 'microsoft'],
    answer: 'We offer Software Installation & Troubleshooting services including Windows OS, Microsoft Office, and antivirus software.',
  },
  {
    keywords: ['repair', 'fix', 'broken', 'screen', 'battery', 'slow', 'virus', 'format', 'service', 'maintenance'],
    answer: 'We offer Computer & Laptop Repair services including screen replacements, motherboard repair, and more. We also offer Printer Repair & Maintenance.',
  },
  {
    keywords: ['support', 'it support', 'help', 'technical', 'technician', 'issue', 'problem'],
    answer: 'Our certified technicians offer IT support for hardware, software, and network issues. Call 0716 000 367 or WhatsApp us.',
  },
  {
    keywords: ['toner', 'ink', 'cartridge', 'refill', 'drum'],
    answer: 'We stock Toners & Ink Cartridges for all major printer brands. WhatsApp us with your printer model for availability.',
  },
  {
    keywords: ['stationery', 'paper', 'office supplies', 'supplies', 'pen', 'file'],
    answer: 'We stock Office Stationery and supplies. Visit our store in Nakuru or Kisumu for the full range.',
  },
  {
    keywords: ['price', 'cost', 'how much', 'pricing', 'quote', 'budget', 'cheap', 'affordable'],
    answer: 'Prices vary by product and model. WhatsApp us on 0716 000 367 with what you need and we will give you a quick quote.',
  },
  {
    keywords: ['location', 'where', 'address', 'find', 'directions', 'nakuru'],
    answer: 'Our Nakuru HQ is at Nyakinyua Building, Kangei, Nakuru. Call 0716 000 367 or WhatsApp us for directions.',
  },
  {
    keywords: ['kisumu', 'branch', 'kisumu branch', 'oginga', 'mega plaza'],
    answer: 'Our Kisumu branch is at Mega Plaza, Ground Floor, Oginga Odinga Street, Kisumu. Manager: Seth Awuoth (0111 543 714), Secretary: Christine Ochang (0702 881 106).',
  },
  {
    keywords: ['delivery', 'shipping', 'deliver', 'ship', 'courier'],
    answer: 'Contact us to arrange delivery for your order. We serve Nakuru and Kisumu areas.',
  },
  {
    keywords: ['warranty', 'guarantee', 'return', 'refund', 'exchange'],
    answer: 'All our products come with manufacturer warranty. Contact us within the warranty period if you have any issues.',
  },
  {
    keywords: ['whatsapp', 'contact', 'call', 'phone', 'email', 'reach', 'talk'],
    answer: 'You can reach us on:\n📞 Nakuru: 0716 000 367 / 0722 717 846\n📞 Kisumu: 0111 543 714 / 0702 881 106\n📧 sales.compucare111@gmail.com\nOr click the WhatsApp button below!',
  },
  {
    keywords: ['hours', 'open', 'time', 'working hours', 'opening'],
    answer: 'We are open Monday–Friday 8:00 AM – 6:00 PM and Saturday 9:00 AM – 4:00 PM. Closed on Sundays.',
  },
  {
    keywords: ['data', 'backup', 'recovery', 'recover', 'lost data', 'hard drive'],
    answer: 'We offer Data Backup & System Optimization services. Bring in your device and our technicians will assess the situation.',
  },
  {
    keywords: ['school', 'ict', 'lab', 'institution', 'bulk', 'tender'],
    answer: 'We offer special packages for schools and institutions — bulk laptop supply, ICT lab setup, networking, and staff training. Call or WhatsApp us.',
  },
  {
    keywords: ['about', 'company', 'who', 'majesty', 'compucare', 'story'],
    answer: 'Majesty Compucare Limited is a trusted ICT solutions provider based in Nakuru, serving businesses, institutions, and individuals since 2016. Our slogan: "Reliable Tech Solutions for Everyday Needs."',
  },
  {
    keywords: ['product', 'products', 'what do you sell', 'offer'],
    answer: 'Our Products: Laptops & Desktop Computers, Printers (Epson, Canon, HP), CCTV Cameras & Security Systems, Monitors & Computer Accessories, Networking Equipment, Phone Accessories, Office Stationery, and Toners & Ink Cartridges.',
  },
  {
    keywords: ['service', 'services', 'what do you do'],
    answer: 'Our Services: Computer & Laptop Repair, Printer Repair & Maintenance, CCTV Installation & Maintenance, Software Installation & Troubleshooting, Network Setup & Support, and Data Backup & System Optimization.',
  },
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'hallo', 'habari'],
    answer: 'Hello! 😊 Welcome to Majesty Compucare Limited. How can I help you today? You can ask me about our products, services, prices, or locations.',
  },
  {
    keywords: ['thank', 'thanks', 'asante', 'sawa'],
    answer: "You're welcome! 😊 Is there anything else I can help you with? We're always happy to assist.",
  },
]

function formatProductLink(product: Product) {
  return `https://www.majestycompucarelimited.com/products/${product.id}`
}

function searchProducts(products: Product[], input: string): Product[] {
  const lower = input.toLowerCase()
  const terms = lower.split(/\s+/).filter(t => t.length > 2)
  return products.filter(p => {
    const haystack = [
      p.name,
      p.description,
      p.shortDescription,
      p.brand,
      p.category?.name,
      p.category?.slug,
    ].filter(Boolean).join(' ').toLowerCase()
    return terms.some(t => haystack.includes(t))
  })
}

function buildProductAnswer(products: Product[], input: string): string | null {
  const lower = input.toLowerCase()
  if (products.length === 0) return null

  // Category-wide or generic product questions
  if (lower.includes('what') && (lower.includes('product') || lower.includes('sell') || lower.includes('have'))) {
    const list = products.slice(0, 8).map(p => {
      const price = (p.salePrice || p.price).toLocaleString()
      return `• ${p.name} — KES ${price}`
    }).join('\n')
    return `Here are some products we currently have in stock:\n${list}\n\nVisit our products page for the full catalogue.`
  }

  // Specific product matches
  const matches = searchProducts(products, input)
  if (matches.length === 0) return null

  if (matches.length === 1) {
    const p = matches[0]
    const price = (p.salePrice || p.price).toLocaleString()
    const oldPrice = p.salePrice ? ` (was KES ${p.price.toLocaleString()})` : ''
    const stock = p.stock > 10 ? 'In stock' : p.stock > 0 ? `Only ${p.stock} left` : 'Out of stock'
    const link = formatProductLink(p)
    return `We have **${p.name}** priced at **KES ${price}${oldPrice}**.\nCategory: ${p.category?.name || 'General'}\nStock status: ${stock}\n\nView it here: ${link}`
  }

  const list = matches.slice(0, 6).map(p => {
    const price = (p.salePrice || p.price).toLocaleString()
    return `• ${p.name} — KES ${price}`
  }).join('\n')
  return `I found ${matches.length} matching product${matches.length === 1 ? '' : 's'}:\n${list}\n\nVisit our products page to see more details.`
}

function getBotReply(input: string, products: Product[] = []): string {
  const lower = input.toLowerCase()

  // Try product catalogue first
  const productAnswer = buildProductAnswer(products, input)
  if (productAnswer) return productAnswer

  // Fallback to FAQ knowledge base
  for (const entry of KB) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      return entry.answer
    }
  }
  return "I'm not sure about that, but our team can help you directly! I can connect you with our team on WhatsApp. 👇"
}

const QUICK_ACTIONS = [
  { icon: ShoppingBag, label: 'View Products',    link: '/products' },
  { icon: FileText,    label: 'Request Quote',    msg: 'I would like to request a quote' },
  { icon: Headphones,  label: 'Contact Support',  msg: 'I need technical support' },
]

export default function Chatbot() {
  const [open, setOpen]       = useState(false)
  const [input, setInput]     = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [typing, setTyping]   = useState(false)
  const [unread, setUnread]   = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(false)
  const endRef  = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load product catalogue when chat opens
  useEffect(() => {
    if (!open || products.length > 0) return
    setProductsLoading(true)
    fetch('/api/products?limit=1000')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.products)) {
          setProducts(data.products)
        }
      })
      .catch(err => console.error('Chatbot failed to load products:', err))
      .finally(() => setProductsLoading(false))
  }, [open, products.length])

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setMessages(JSON.parse(saved))
        return
      }
    } catch {}
    // First visit — show welcome message
    const welcome: Message = {
      id: 'welcome',
      role: 'bot',
      text: "Hello 👋 Welcome to Majesty Compucare Limited. How can I help you today?",
      ts: Date.now(),
    }
    setMessages([welcome])
  }, [])

  // Persist to localStorage whenever messages change
  useEffect(() => {
    if (messages.length === 0) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)) } catch {}
  }, [messages])

  // Scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  // Unread badge when closed
  useEffect(() => {
    if (!open && messages.length > 0 && messages[messages.length - 1].role === 'bot') {
      setUnread(n => n + 1)
    }
  }, [messages]) // eslint-disable-line

  const handleOpen = () => {
    setOpen(true)
    setUnread(0)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const addBotMessage = useCallback((text: string) => {
    setTyping(true)
    const delay = Math.min(600 + text.length * 12, 2200)
    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [...prev, { id: `bot-${Date.now()}`, role: 'bot', text, ts: Date.now() }])
    }, delay)
  }, [])

  const send = useCallback((text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setMessages(prev => [...prev, { id: `user-${Date.now()}`, role: 'user', text: trimmed, ts: Date.now() }])
    setInput('')
    const reply = getBotReply(trimmed, products)
    addBotMessage(reply)
  }, [addBotMessage, products])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    send(input)
  }

  const handleQuickAction = (action: typeof QUICK_ACTIONS[0]) => {
    if ('link' in action && action.link) {
      window.location.href = action.link
    } else if ('msg' in action && action.msg) {
      send(action.msg)
    }
  }

  const clearHistory = () => {
    const welcome: Message = { id: 'welcome-reset', role: 'bot', text: "Hello 👋 Welcome to Majesty Compucare Limited. How can I help you today?", ts: Date.now() }
    setMessages([welcome])
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }

  const showWhatsApp = messages.some(
    m => m.role === 'bot' && m.text.includes("connect you with our team")
  )

  return (
    <>
      {/* FAB */}
      <button
        onClick={handleOpen}
        aria-label="Open chat"
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${open ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        style={{ background: 'var(--accent-blue)', boxShadow: '0 4px 24px rgba(0,102,204,0.45)' }}
      >
        <MessageCircle className="w-7 h-7 text-white" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-6 right-6 z-50 flex flex-col transition-all duration-300 origin-bottom-right ${open ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'}`}
        style={{ width: 'min(380px, calc(100vw - 24px))', height: 'min(560px, calc(100vh - 100px))' }}
      >
        <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-slate-200 shadow-2xl bg-white">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ background: 'var(--accent-blue)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-black text-white leading-none" style={{ fontFamily: 'Montserrat,sans-serif' }}>
                  Majesty Assistant
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-[10px] text-blue-100">Online now</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={clearHistory} title="Clear chat"
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition">
                <RotateCcw className="w-4 h-4" />
              </button>
              <button onClick={() => setOpen(false)} title="Close"
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-slate-50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.role === 'bot' && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'var(--accent-blue)' }}>
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'rounded-tr-sm text-white'
                      : 'rounded-tl-sm text-slate-800 border border-slate-200'
                  }`}
                  style={msg.role === 'user'
                    ? { background: 'var(--accent-blue)' }
                    : { background: '#fff' }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="flex gap-2 flex-row">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: 'var(--accent-blue)' }}>
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white border border-slate-200 flex items-center gap-1.5">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp button when bot can't answer */}
            {showWhatsApp && !typing && (
              <div className="flex gap-2">
                <div className="w-7 h-7 flex-shrink-0" />
                <div className="flex flex-col gap-2">
                  <a href={WA_NAKURU} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-white transition hover:opacity-90"
                    style={{ background: '#25D366' }}>
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Nakuru
                  </a>
                  <a href={WA_KISUMU} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-white transition hover:opacity-90"
                    style={{ background: '#128C7E' }}>
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Kisumu
                  </a>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Quick actions */}
          <div className="px-3 py-2 border-t border-slate-100 bg-white flex gap-2 overflow-x-auto scrollbar-hide flex-shrink-0">
            {QUICK_ACTIONS.map(action => (
              <button key={action.label}
                onClick={() => handleQuickAction(action)}
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition">
                <action.icon className="w-3 h-3" />
                {action.label}
              </button>
            ))}
            <a href={WA_NAKURU} target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition">
              <MessageCircle className="w-3 h-3" />
              WhatsApp Us
            </a>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit}
            className="px-3 py-3 border-t border-slate-100 bg-white flex items-center gap-2 flex-shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-slate-50 text-slate-900"
            />
            <button type="submit" disabled={!input.trim() || typing}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition disabled:opacity-40 flex-shrink-0"
              style={{ background: 'var(--accent-blue)' }}>
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
