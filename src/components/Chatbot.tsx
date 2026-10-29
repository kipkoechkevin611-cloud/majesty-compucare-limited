'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { MessageCircle, X, Send, RotateCcw, ShoppingBag, FileText, Headphones, ChevronDown, ArrowRight, ShoppingCart, Star } from 'lucide-react'
import Link from 'next/link'

interface Message {
  id: string
  role: 'bot' | 'user'
  text: string
  ts: number
  productCards?: ProductCard[]
  quickReplies?: string[]
}

interface ProductCard {
  id: string
  name: string
  price: number
  salePrice?: number
  stock: number
  category?: { name: string; slug: string }
  images?: string[]
  brand?: string
  description?: string
}

const STORAGE_KEY = 'majesty_chat_history'
const WA_NAKURU = 'https://wa.me/254716000367'
const WA_KISUMU = 'https://wa.me/254111543714'

const QUICK_ACTIONS = [
  { icon: ShoppingBag, label: 'View Products', link: '/products' },
  { icon: FileText, label: 'Request Quote', msg: 'I would like to request a quote' },
  { icon: Headphones, label: 'Contact Support', msg: 'I need technical support' },
]

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [typing, setTyping] = useState(false)
  const [unread, setUnread] = useState(0)
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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
      text: "Hello 👋 Welcome to Majesty Compucare Limited. I'm your AI shopping assistant. How can I help you today?\n\nI can help you:\n• Find the perfect product for your needs\n• Compare products side-by-side\n• Get recommendations based on your budget\n• Answer questions about our products and services",
      ts: Date.now(),
      quickReplies: ['Find a laptop', 'View printers', 'Get a recommendation', 'Contact support']
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
  }, [messages])

  const handleOpen = () => {
    setOpen(true)
    setUnread(0)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const addBotMessage = useCallback((text: string, productCards?: ProductCard[], quickReplies?: string[]) => {
    setTyping(true)
    const delay = Math.min(800 + text.length * 15, 2500)
    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [...prev, { 
        id: `bot-${Date.now()}`, 
        role: 'bot', 
        text, 
        ts: Date.now(),
        productCards,
        quickReplies
      }])
    }, delay)
  }, [])

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setMessages(prev => [...prev, { id: `user-${Date.now()}`, role: 'user', text: trimmed, ts: Date.now() }])
    setInput('')
    setTyping(true)

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: trimmed }],
          sessionId
        })
      })

      const data = await response.json()
      setTyping(false)
      
      if (data.error) {
        addBotMessage(data.text)
      } else {
        addBotMessage(data.text, data.productCards, data.quickReplies)
      }
    } catch (error) {
      console.error('Chatbot error:', error)
      setTyping(false)
      addBotMessage("Sorry, I'm having trouble connecting. Please try again or contact our support team directly via WhatsApp.")
    }
  }, [addBotMessage, messages, sessionId])

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

  const handleQuickReply = (reply: string) => {
    send(reply)
  }

  const clearHistory = () => {
    const welcome: Message = { 
      id: 'welcome-reset', 
      role: 'bot', 
      text: "Hello 👋 Welcome to Majesty Compucare Limited. I'm your AI shopping assistant. How can I help you today?", 
      ts: Date.now(),
      quickReplies: ['Find a laptop', 'View printers', 'Get a recommendation', 'Contact support']
    }
    setMessages([welcome])
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }

  const showWhatsApp = messages.some(
    m => m.role === 'bot' && m.text.toLowerCase().includes('human')
  )

  const renderProductCard = (product: ProductCard) => {
    const displayPrice = product.salePrice || product.price
    const originalPrice = product.salePrice ? product.price : null

    return (
      <Link 
        key={product.id}
        href={`/products/${product.id}`}
        className="block p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-300 group"
      >
        <div className="flex gap-3">
          {product.images?.[0] && (
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-blue-600 mb-1">{product.category?.name || 'General'}</p>
            <p className="text-sm font-bold text-slate-900 line-clamp-2 mb-2">{product.name}</p>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-black text-slate-900">KES {displayPrice.toLocaleString()}</span>
              {originalPrice && (
                <span className="text-xs line-through text-slate-400">KES {originalPrice.toLocaleString()}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <span className={`text-xs font-semibold ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); send(`Add ${product.name} to cart`) }}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <ShoppingCart className="w-3 h-3" /> Add to Cart
          </button>
          <span className="text-xs text-blue-600 font-semibold flex items-center gap-1">
            View Details <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </Link>
    )
  }

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
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
            {unread}
          </span>
        )}
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-6 right-6 z-50 flex flex-col transition-all duration-300 origin-bottom-right ${open ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'}`}
        style={{ width: 'min(400px, calc(100vw - 24px))', height: 'min(600px, calc(100vh - 100px))' }}
      >
        <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-slate-200 shadow-2xl bg-white">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ background: 'var(--accent-blue)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-black text-white leading-none" style={{ fontFamily: 'Montserrat,sans-serif' }}>
                  AI Shopping Assistant
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-[10px] text-blue-100">Online • Powered by AI</p>
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
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 bg-slate-50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.role === 'bot' && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'var(--accent-blue)' }}>
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`max-w-[82%] ${msg.role === 'user' ? 'flex flex-col items-end' : 'flex flex-col'}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
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
                  
                  {/* Product Cards */}
                  {msg.productCards && msg.productCards.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.productCards.map(renderProductCard)}
                    </div>
                  )}
                  
                  {/* Quick Replies */}
                  {msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.quickReplies.map((reply, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickReply(reply)}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold border border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-400 transition"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="flex gap-2 flex-row">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
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

            {/* WhatsApp escalation */}
            {showWhatsApp && !typing && (
              <div className="flex gap-2">
                <div className="w-8 h-8 flex-shrink-0" />
                <div className="flex flex-col gap-2 w-full">
                  <a href={WA_NAKURU} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-white transition hover:opacity-90 shadow-md"
                    style={{ background: '#25D366' }}>
                    <MessageCircle className="w-4 h-4" /> WhatsApp Nakuru
                  </a>
                  <a href={WA_KISUMU} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-white transition hover:opacity-90 shadow-md"
                    style={{ background: '#128C7E' }}>
                    <MessageCircle className="w-4 h-4" /> WhatsApp Kisumu
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
              placeholder="Ask about products, compare, get recommendations..."
              className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-slate-50 text-slate-900"
            />
            <button type="submit" disabled={!input.trim() || typing}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 hover:shadow-md"
              style={{ background: 'var(--accent-blue)' }}>
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
