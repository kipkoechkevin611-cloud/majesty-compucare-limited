import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'

function slug(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

config()

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
})

const imagesDir = path.join(process.cwd(), 'public', 'images', 'products')

const productDescriptions = {
  hp: {
    elitebook: 'Refurbished HP EliteBook business laptop in excellent condition. Perfect for professionals, students, and office work. Features reliable performance, durable build, and long battery life. Fully tested and comes with warranty.',
    probook: 'Refurbished HP ProBook laptop designed for business and productivity. Offers solid performance at an affordable price. Ideal for everyday computing tasks, office work, and students.',
    zbook: 'Refurbished HP ZBook mobile workstation - powerful performance for professionals. Built for demanding tasks like CAD, video editing, and data analysis. Enterprise-grade reliability.',
    elite: 'Refurbished HP Elite premium laptop with cutting-edge design and performance. Ultra-thin, lightweight, and packed with features for executives and professionals.',
  },
  dell: {
    latitude: 'Refurbished Dell Latitude business laptop - reliable and durable. Perfect for corporate environments, students, and everyday computing. Tested and certified for quality.',
    xps: 'Refurbished Dell XPS premium ultrabook with stunning display and premium build. High-performance laptop for professionals who demand the best.',
    precision: 'Refurbished Dell Precision mobile workstation - engineered for professionals. Powerful performance for CAD, 3D modeling, and content creation.',
  },
  apple: {
    macbook: 'Refurbished Apple MacBook in excellent condition. macOS experience with premium build quality and reliable performance. Perfect for creatives, students, and professionals.',
  },
  lenovo: {
    thinkpad: 'Refurbished Lenovo ThinkPad business laptop - legendary durability and performance. Trusted by professionals worldwide. Excellent keyboard, robust build, and reliable performance.',
  },
}

function parseProductInfo(filename) {
  const name = filename.replace('.png', '').replace(/-/g, ' ')
  const parts = filename.replace('.png', '').split('-')
  
  let brand = 'Unknown'
  let series = 'Unknown'
  let model = parts.join(' ')
  let processor = null
  let ram = null
  let touchscreen = false

  if (parts[0] === 'hp') {
    brand = 'HP'
    if (parts[1] === 'elitebook') series = 'EliteBook'
    else if (parts[1] === 'probook') series = 'ProBook'
    else if (parts[1] === 'zbook') series = 'ZBook'
    else if (parts[1] === 'elite') series = 'Elite'
  } else if (parts[0] === 'dell') {
    brand = 'Dell'
    if (parts[1] === 'latitude') series = 'Latitude'
    else if (parts[1] === 'xps') series = 'XPS'
    else if (parts[1] === 'precision') series = 'Precision'
  } else if (parts[0] === 'apple') {
    brand = 'Apple'
    series = 'MacBook'
  } else if (parts[0] === 'lenovo') {
    brand = 'Lenovo'
    series = 'ThinkPad'
  }

  // Extract processor
  const processorMatch = name.match(/(i[357]|ryzen\s*\d+|m\d+)/i)
  if (processorMatch) {
    processor = processorMatch[0].toUpperCase()
  }

  // Extract RAM
  const ramMatch = name.match(/(\d+)\s*gb/i)
  if (ramMatch) {
    ram = parseInt(ramMatch[1])
  }

  // Check for touchscreen
  if (name.toLowerCase().includes('non-touch')) {
    touchscreen = false
  } else if (name.toLowerCase().includes('touch') || name.toLowerCase().includes('x360')) {
    touchscreen = true
  }

  return {
    brand,
    series,
    model: name,
    processor,
    ram,
    touchscreen,
    filename,
  }
}

function generatePrice(info) {
  let basePrice = 25000
  
  if (info.brand === 'Apple') basePrice = 45000
  else if (info.brand === 'HP' && info.series === 'ZBook') basePrice = 55000
  else if (info.brand === 'Dell' && info.series === 'Precision') basePrice = 55000
  else if (info.brand === 'Dell' && info.series === 'XPS') basePrice = 50000
  else if (info.brand === 'HP' && info.series === 'Elite') basePrice = 48000
  else if (info.series === 'EliteBook' || info.series === 'ThinkPad') basePrice = 35000
  else if (info.series === 'ProBook' || info.series === 'Latitude') basePrice = 28000

  if (info.processor?.includes('I7')) basePrice += 8000
  else if (info.processor?.includes('I5')) basePrice += 4000
  else if (info.processor?.includes('RYZEN 5')) basePrice += 5000
  else if (info.processor?.includes('RYZEN 7')) basePrice += 9000

  if (info.ram && info.ram >= 16) basePrice += 5000
  else if (info.ram && info.ram >= 8) basePrice += 2000

  if (info.touchscreen) basePrice += 3000

  return Math.round(basePrice)
}

function generateDescription(info) {
  const descKey = info.brand.toLowerCase()
  const seriesKey = info.series.toLowerCase().replace(/\s/g, '')
  
  let baseDesc = productDescriptions[descKey]?.[seriesKey] || productDescriptions[descKey]?.[Object.keys(productDescriptions[descKey] || {})[0]] || 'Refurbished laptop in excellent condition. Fully tested and ready for use.'
  
  let specs = []
  if (info.processor) specs.push(`${info.processor} processor`)
  if (info.ram) specs.push(`${info.ram}GB RAM`)
  if (info.touchscreen) specs.push('touchscreen display')
  
  if (specs.length > 0) {
    baseDesc += ` Features include ${specs.join(', ')}.`
  }
  
  return baseDesc
}

async function main() {
  const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.png'))
  console.log(`Found ${files.length} product images`)

  const laptopCat = await prisma.category.findUnique({ where: { slug: 'laptops' } })
  if (!laptopCat) {
    console.log('Creating laptops category...')
    await prisma.category.create({
      data: {
        name: 'Laptops',
        slug: 'laptops',
        description: 'Laptops from top brands including HP, Dell, Apple, and Lenovo',
      },
    })
  }

  let created = 0
  let updated = 0

  for (const file of files) {
    const info = parseProductInfo(file)
    const productSlug = slug(info.model)
    const price = generatePrice(info)
    const description = generateDescription(info)
    const imagePath = `/images/products/${file}`

    const existing = await prisma.product.findUnique({ where: { slug: productSlug } })

    if (existing) {
      await prisma.product.update({
        where: { slug: productSlug },
        data: {
          images: [imagePath],
          price,
          description,
          categoryId: laptopCat?.id || (await prisma.category.findUnique({ where: { slug: 'laptops' } }))?.id,
          brand: info.brand,
          status: 'ACTIVE',
        },
      })
      updated++
      console.log(`Updated: ${info.model}`)
    } else {
      await prisma.product.create({
        data: {
          name: info.model,
          slug: productSlug,
          price,
          description,
          images: [imagePath],
          categoryId: laptopCat?.id || (await prisma.category.findUnique({ where: { slug: 'laptops' } }))?.id,
          brand: info.brand,
          stock: Math.floor(Math.random() * 5) + 1,
          status: 'ACTIVE',
          featured: Math.random() > 0.7,
        },
      })
      created++
      console.log(`Created: ${info.model} - KES ${price.toLocaleString()}`)
    }
  }

  console.log(`\n=== Summary ===`)
  console.log(`Created: ${created}`)
  console.log(`Updated: ${updated}`)
  console.log(`Total: ${created + updated}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
