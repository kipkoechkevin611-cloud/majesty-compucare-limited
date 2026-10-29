import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Check if prisma is available
if (!prisma) {
  console.warn('Chatbot API: Prisma client not initialized - database features will be limited')
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  messages: ChatMessage[]
  sessionId?: string
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

// Security: Sanitize input to prevent prompt injection
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .slice(0, 2000)
}

// Extract product-related information from user query
function extractProductInfo(query: string): {
  category?: string
  brand?: string
  priceRange?: { min?: number; max?: number }
  features?: string[]
  intent: 'search' | 'compare' | 'recommend' | 'info' | 'general'
} {
  const lower = query.toLowerCase()
  const intent: any = 'general'
  
  // Detect intent
  if (lower.includes('compare') || lower.includes('difference') || lower.includes('vs')) {
    return { ...extractProductInfo(query), intent: 'compare' }
  }
  if (lower.includes('recommend') || lower.includes('suggest') || lower.includes('best') || lower.includes('which')) {
    return { ...extractProductInfo(query), intent: 'recommend' }
  }
  if (lower.includes('show') || lower.includes('find') || lower.includes('search') || lower.includes('looking for')) {
    return { ...extractProductInfo(query), intent: 'search' }
  }
  
  // Extract category
  const categories = ['laptop', 'desktop', 'printer', 'cctv', 'camera', 'networking', 'router', 'monitor', 'accessory', 'phone', 'software']
  const category = categories.find(c => lower.includes(c))
  
  // Extract brand
  const brands = ['hp', 'dell', 'lenovo', 'asus', 'acer', 'apple', 'canon', 'epson', 'tp-link', 'samsung']
  const brand = brands.find(b => lower.includes(b))
  
  // Extract price range
  let priceRange: { min?: number; max?: number } | undefined
  const priceMatch = lower.match(/under\s*(\d+)/i)
  if (priceMatch) {
    priceRange = { max: parseInt(priceMatch[1]) }
  } else {
    const rangeMatch = lower.match(/between\s*(\d+)\s*and\s*(\d+)/i)
    if (rangeMatch) {
      priceRange = { min: parseInt(rangeMatch[1]), max: parseInt(rangeMatch[2]) }
    }
  }
  
  // Extract features
  const features: string[] = []
  if (lower.includes('gaming')) features.push('gaming')
  if (lower.includes('business') || lower.includes('office')) features.push('business')
  if (lower.includes('student') || lower.includes('school')) features.push('student')
  if (lower.includes('touch')) features.push('touchscreen')
  if (lower.includes('ssd')) features.push('ssd')
  if (lower.includes('hdd')) features.push('hdd')
  if (lower.includes('ram') || lower.includes('memory')) {
    const ramMatch = lower.match(/(\d+)\s*gb/i)
    if (ramMatch) features.push(`ram_${ramMatch[1]}gb`)
  }
  
  return { category, brand, priceRange, features, intent }
}

// Search products based on extracted info
async function searchProducts(info: ReturnType<typeof extractProductInfo>): Promise<ProductCard[]> {
  try {
    if (!prisma) {
      console.warn('Prisma client not available, returning empty product list')
      return []
    }

    // Start with basic query
    const where: any = { status: 'ACTIVE' }
    
    // Add category filter if specified
    if (info.category) {
      where.category = { slug: { contains: info.category } }
    }
    
    // Add brand filter if specified
    if (info.brand) {
      where.brand = { contains: info.brand, mode: 'insensitive' }
    }
    
    // Add price filter if specified
    if (info.priceRange) {
      if (info.priceRange.max) {
        where.price = { lte: info.priceRange.max }
      }
      if (info.priceRange.min) {
        where.price = { ...where.price, gte: info.priceRange.min }
      }
    }
    
    console.log('Executing Prisma query with where clause:', JSON.stringify(where))
    
    const products = await prisma.product.findMany({
      where,
      include: { category: { select: { name: true, slug: true } } },
      take: 10,
      orderBy: { createdAt: 'desc' }
    })
    
    console.log('Prisma query returned:', products.length, 'products')
    
    return products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      salePrice: p.salePrice || undefined,
      stock: p.stock,
      category: p.category,
      images: p.images as string[] || [],
      brand: p.brand || undefined,
      description: p.description || undefined
    }))
  } catch (error) {
    console.error('Error searching products:', error)
    return []
  }
}

// Generate AI response based on intent and products
async function generateResponse(
  query: string,
  products: ProductCard[],
  intent: string,
  conversationHistory: ChatMessage[]
): Promise<{ text: string; productCards?: ProductCard[]; quickReplies?: string[] }> {
  const lower = query.toLowerCase()
  
  // Product search results
  if (intent === 'search' && products.length > 0) {
    const quickReplies = ['Show more details', 'Compare prices', 'Add to cart']
    return {
      text: `I found ${products.length} product${products.length === 1 ? '' : 's'} matching your request. Here are the top results:`,
      productCards: products.slice(0, 3),
      quickReplies
    }
  }
  
  if (intent === 'search' && products.length === 0) {
    return {
      text: "I couldn't find any products matching your criteria. Would you like me to:\n• Show you all products in this category\n• Help you with a different search\n• Connect you with our team for personalized assistance",
      quickReplies: ['Show all products', 'New search', 'Talk to human']
    }
  }
  
  // Product recommendations
  if (intent === 'recommend') {
    if (products.length > 0) {
      const topProduct = products[0]
      return {
        text: `Based on your needs, I recommend the **${topProduct.name}**. It's ${topProduct.stock > 0 ? 'currently in stock' : 'temporarily out of stock'} and priced at KES ${(topProduct.salePrice || topProduct.price).toLocaleString()}. This product offers great value for your requirements.`,
        productCards: [topProduct],
        quickReplies: ['Show alternatives', 'View full details', 'Add to cart']
      }
    }
    return {
      text: "To give you the best recommendation, could you tell me more about:\n• Your budget range\n• What you'll use it for\n• Any specific features you need",
      quickReplies: ['Under KES 50,000', 'For business', 'For gaming', 'For students']
    }
  }
  
  // Product comparison
  if (intent === 'compare') {
    if (products.length >= 2) {
      const [p1, p2] = products.slice(0, 2)
      return {
        text: `Here's a comparison between the **${p1.name}** and **${p2.name}**:\n\n**${p1.name}**: KES ${(p1.salePrice || p1.price).toLocaleString()} - ${p1.brand || 'Various'}\n**${p2.name}**: KES ${(p2.salePrice || p2.price).toLocaleString()} - ${p2.brand || 'Various'}\n\nBoth are excellent choices. The main difference is in price and specifications.`,
        productCards: [p1, p2],
        quickReplies: ['View detailed comparison', 'Choose first', 'Choose second']
      }
    }
    return {
      text: "I need at least 2 products to compare. Please specify which products you'd like me to compare, or I can show you similar products in a category.",
      quickReplies: ['Show laptops', 'Show printers', 'Show all products']
    }
  }
  
  // General product info
  if (intent === 'info' || products.length > 0) {
    if (products.length === 1) {
      const p = products[0]
      return {
        text: `Here's information about **${p.name}**:\n\nPrice: KES ${(p.salePrice || p.price).toLocaleString()}\n${p.salePrice ? `Sale Price: KES ${p.salePrice.toLocaleString()}\n` : ''}Stock: ${p.stock > 10 ? 'Available' : p.stock > 0 ? `Only ${p.stock} left` : 'Out of stock'}\nCategory: ${p.category?.name || 'General'}\n${p.brand ? `Brand: ${p.brand}\n` : ''}${p.description ? `\n${p.description.substring(0, 150)}...` : ''}`,
        productCards: [p],
        quickReplies: ['Add to cart', 'View full details', 'Show similar products']
      }
    }
  }
  
  // Comprehensive company knowledge base
  const companyInfo: { [key: string]: string } = {
    // Location questions
    'location': 'We have two locations:\n\n**Nakuru HQ**: Nyakinyua Building, Kangei, Nakuru\nPhone: 0716 000 367 / 0722 717 846\n\n**Kisumu Branch**: Mega Plaza, Ground Floor, Oginga Odinga Street\nPhone: 0111 543 714 / 0702 881 106',
    'where': 'We have two locations:\n\n**Nakuru HQ**: Nyakinyua Building, Kangei, Nakuru\nPhone: 0716 000 367 / 0722 717 846\n\n**Kisumu Branch**: Mega Plaza, Ground Floor, Oginga Odinga Street\nPhone: 0111 543 714 / 0702 881 106',
    'address': 'We have two locations:\n\n**Nakuru HQ**: Nyakinyua Building, Kangei, Nakuru\nPhone: 0716 000 367 / 0722 717 846\n\n**Kisumu Branch**: Mega Plaza, Ground Floor, Oginga Odinga Street\nPhone: 0111 543 714 / 0702 881 106',
    'nakuru': 'Our Nakuru HQ is at Nyakinyua Building, Kangei, Nakuru. You can reach us at 0716 000 367 or 0722 717 846.',
    'kisumu': 'Our Kisumu branch is at Mega Plaza, Ground Floor, Oginga Odinga Street. You can reach us at 0111 543 714 or 0702 881 106.',
    'branch': 'We have two branches:\n\n**Nakuru HQ**: Nyakinyua Building, Kangei, Nakuru\nPhone: 0716 000 367\n\n**Kisumu Branch**: Mega Plaza, Ground Floor, Oginga Odinga Street\nPhone: 0111 543 714',
    
    // Contact questions
    'contact': 'You can reach us at:\n📞 Nakuru: 0716 000 367 / 0722 717 846\n📞 Kisumu: 0111 543 714 / 0702 881 106\n📧 sales.compucare111@gmail.com\n🌐 www.majestycompucarelimited.com',
    'reach': 'You can reach us at:\n📞 Nakuru: 0716 000 367 / 0722 717 846\n📞 Kisumu: 0111 543 714 / 0702 881 106\n📧 sales.compucare111@gmail.com\n🌐 www.majestycompucarelimited.com',
    'phone': 'Our phone numbers:\n📞 Nakuru: 0716 000 367 / 0722 717 846\n📞 Kisumu: 0111 543 714 / 0702 881 106',
    'whatsapp': 'Our WhatsApp numbers:\n📱 Nakuru: 0716 000 367\n📱 Kisumu: 0111 543 714\nClick the WhatsApp buttons below to chat with us directly!',
    'email': 'Our email address: sales.compucare111@gmail.com',
    'website': 'Our website: www.majestycompucarelimited.com',
    
    // Business hours
    'hours': 'We are open:\nMonday - Friday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 4:00 PM\nSunday: Closed',
    'open': 'We are open:\nMonday - Friday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 4:00 PM\nSunday: Closed',
    'time': 'We are open:\nMonday - Friday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 4:00 PM\nSunday: Closed',
    
    // Products
    'products': 'We sell:\n• Laptops & Desktop Computers (HP, Dell, Lenovo, Asus, Acer, Apple)\n• Printers (Epson, Canon, HP)\n• CCTV Cameras & Security Systems\n• Networking Equipment (routers, switches)\n• Monitors & Computer Accessories\n• Phone Accessories\n• Office Stationery\n• Toners & Ink Cartridges',
    'sell': 'We sell:\n• Laptops & Desktop Computers (HP, Dell, Lenovo, Asus, Acer, Apple)\n• Printers (Epson, Canon, HP)\n• CCTV Cameras & Security Systems\n• Networking Equipment (routers, switches)\n• Monitors & Computer Accessories\n• Phone Accessories\n• Office Stationery\n• Toners & Ink Cartridges',
    'offer': 'We offer:\n• Products: Laptops, Desktops, Printers, CCTV, Networking, Accessories, Stationery\n• Services: Computer Repair, Printer Maintenance, CCTV Installation, Network Setup, Software Installation',
    
    // Delivery
    'delivery': 'We offer delivery within Nakuru and Kisumu. Delivery fees start from KES 500 depending on location. For orders over KES 50,000, delivery may be free. Same-day delivery is available within Nakuru CBD.',
    'shipping': 'We offer delivery within Nakuru and Kisumu. Delivery fees start from KES 500 depending on location. For orders over KES 50,000, delivery may be free. Same-day delivery is available within Nakuru CBD.',
    'deliver': 'We deliver within Nakuru and Kisumu. Delivery fees start from KES 500. Same-day delivery available in Nakuru CBD.',
    
    // Warranty
    'warranty': 'All our products come with manufacturer warranty:\n• Laptops: 1-2 years\n• Printers: 1 year\n• Accessories: 6-12 months\nExtended warranty options are available for purchase.',
    'guarantee': 'All our products come with manufacturer warranty. Extended warranty options are available for purchase.',
    
    // Payment
    'payment': 'We accept:\n• M-Pesa (0716 000 367)\n• Bank transfers\n• Cash\n• Card payments\nFor bank transfers, account details are provided on request.',
    'pay': 'We accept M-Pesa, bank transfers, cash, and card payments. M-Pesa number: 0716 000 367.',
    'mpesa': 'Our M-Pesa number is 0716 000 367.',
    
    // Return policy
    'return': 'Returns are accepted within 7 days for manufacturing defects. The product must be in original condition with all accessories. Software and consumables (ink, toner) cannot be returned once opened.',
    'refund': 'Returns are accepted within 7 days for manufacturing defects. Refunds are processed within 3-5 business days.',
    
    // About company
    'about': 'Majesty Compucare Limited is a trusted ICT solutions provider based in Nakuru, serving businesses, institutions, and individuals since 2016. We specialize in computer sales, repairs, CCTV installation, networking, and IT support.',
    'company': 'Majesty Compucare Limited is a trusted ICT solutions provider based in Nakuru and Kisumu, serving since 2016. We offer quality tech products and professional IT services.',
    'majesty': 'Majesty Compucare Limited is your trusted ICT partner since 2016. We have branches in Nakuru and Kisumu.',
  }
  
  // Check company knowledge base first (prioritize company-specific answers)
  // Use more specific matching to avoid partial matches - order matters!
  const specificMatches = [
    { keywords: ['delivery', 'shipping', 'deliver'], key: 'delivery' },
    { keywords: ['email'], key: 'email' },
    { keywords: ['whatsapp'], key: 'whatsapp' },
    { keywords: ['mpesa'], key: 'mpesa' },
    { keywords: ['phone'], key: 'phone' },
    { keywords: ['reach', 'contact'], key: 'contact' },
    { keywords: ['nakuru'], key: 'nakuru' },
    { keywords: ['kisumu'], key: 'kisumu' },
    { keywords: ['branch'], key: 'branch' },
    { keywords: ['where', 'located', 'address'], key: 'location' },
    { keywords: ['hours', 'open', 'time'], key: 'hours' },
    { keywords: ['products', 'sell'], key: 'products' },
    { keywords: ['offer'], key: 'offer' },
    { keywords: ['warranty', 'guarantee'], key: 'warranty' },
    { keywords: ['payment', 'pay'], key: 'payment' },
    { keywords: ['return', 'refund'], key: 'return' },
    { keywords: ['about', 'company', 'majesty'], key: 'about' },
  ]
  
  for (const match of specificMatches) {
    if (match.keywords.some(kw => lower.includes(kw))) {
      return { text: companyInfo[match.key], quickReplies: ['View products', 'Request quote', 'Talk to human'] }
    }
  }
  
  // Greeting
  if (lower.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
    return {
      text: "Hello! 👋 Welcome to Majesty Compucare Limited. I'm your AI shopping assistant. How can I help you today?\n\nI can help you:\n• Find the perfect product for your needs\n• Compare products side-by-side\n• Get recommendations based on your budget\n• Answer questions about our products and services",
      quickReplies: ['Find a laptop', 'View printers', 'Get a recommendation', 'Contact support']
    }
  }
  
  // Fallback with escalation option
  return {
    text: "I'm not sure I understood that correctly. I can help you find products, compare options, or answer questions about our products and services.\n\nWould you like me to connect you with a human representative who can assist you better?",
    quickReplies: ['Show products', 'Compare products', 'Talk to human']
  }
}

// Log conversation for analytics
async function logConversation(sessionId: string, messages: ChatMessage[]) {
  try {
    // In a real implementation, this would save to a database
    // For now, we'll just log to console
    console.log(`[Chatbot Session: ${sessionId}]`, JSON.stringify(messages, null, 2))
  } catch (error) {
    console.error('Failed to log conversation:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { messages, sessionId = 'anonymous' } = body
    
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 })
    }
    
    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role !== 'user') {
      return NextResponse.json({ error: 'Last message must be from user' }, { status: 400 })
    }
    
    // Sanitize input
    const sanitizedQuery = sanitizeInput(lastMessage.content)
    
    // Extract product information
    const productInfo = extractProductInfo(sanitizedQuery)
    console.log('Product info:', JSON.stringify(productInfo))
    
    // Search products
    const products = await searchProducts(productInfo)
    console.log('Found products:', products.length)
    
    // Generate response
    const response = await generateResponse(
      sanitizedQuery,
      products,
      productInfo.intent,
      messages
    )
    
    console.log('Generated response:', JSON.stringify(response).substring(0, 200))
    
    // Log conversation
    await logConversation(sessionId, messages)
    
    return NextResponse.json({
      ...response,
      sessionId,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Chatbot API error:', error)
    console.error('Error details:', error instanceof Error ? error.message : String(error))
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
    return NextResponse.json(
      { error: 'Failed to process request', text: 'Sorry, I encountered an error. Please try again or contact our support team directly.' },
      { status: 500 }
    )
  }
}
