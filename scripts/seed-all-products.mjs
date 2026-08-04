import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'

config()

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
})

const imagesDir = path.join(process.cwd(), 'public', 'images', 'products', 'product_photos')

// Category mapping based on keywords
const categoryKeywords = {
  'laptops': ['laptop', 'macbook', 'thinkpad', 'elitebook', 'probook', 'latitude', 'vostro', 'inspiron', 'ideapad', 'vivobook', 'zenbook', 'rog', 'spectre', 'envy', 'pavilion', 'omnibook', 'yoga', 'surface', 'chromebook'],
  'printers': ['printer', 'laserjet', 'deskjet', 'officejet', 'ecotank', 'pixma', 'image', 'taskalfa', 'ecosys', 'mfp', 'neverstop', 'smart tank'],
  'monitors': ['monitor', 'display', 'screen'],
  'desktops': ['all in one', 'aio', 'desktop', 'tower', 'workstation', 'optiplex', 'thinkcentre', 'ideacentre', 'pro tower', 'prodesk'],
  'networking': ['router', 'switch', 'access point', 'wifi', 'ethernet', 'range extender', 'hotspot', 'mifi'],
  'storage': ['hard drive', 'ssd', 'hdd', 'flash drive', 'usb', 'memory card', 'sd', 'microsd', 'external', 'passport'],
  'accessories': ['mouse', 'keyboard', 'headset', 'webcam', 'speaker', 'adapter', 'hub', 'cable', 'docking', 'stand', 'case', 'sleeve', 'backpack', 'charger', 'battery'],
  'projectors': ['projector', 'screen'],
  'ups': ['ups'],
  'scanners': ['scanner'],
  'software': ['office', 'windows', 'kaspersky', 'mcafee'],
  'tablets': ['ipad', 'tablet'],
  'audio': ['airpods', 'headphone', 'earbuds'],
  'power': ['power station', 'solar panel', 'inverter', 'battery'],
  'gaming': ['gaming', 'rog', 'victus', 'omen', 'legion'],
}

// Brand detection
function detectBrand(filename) {
  const lower = filename.toLowerCase()
  if (lower.includes('hp')) return 'HP'
  if (lower.includes('dell')) return 'Dell'
  if (lower.includes('apple') || lower.includes('macbook') || lower.includes('imac') || lower.includes('mac')) return 'Apple'
  if (lower.includes('lenovo') || lower.includes('thinkpad')) return 'Lenovo'
  if (lower.includes('asus') || lower.includes('rog') || lower.includes('zenbook')) return 'ASUS'
  if (lower.includes('samsung')) return 'Samsung'
  if (lower.includes('epson')) return 'Epson'
  if (lower.includes('canon')) return 'Canon'
  if (lower.includes('logitech')) return 'Logitech'
  if (lower.includes('tp-link') || lower.includes('tplink')) return 'TP-Link'
  if (lower.includes('sandisk')) return 'SanDisk'
  if (lower.includes('transcend')) return 'Transcend'
  if (lower.includes('wd') || lower.includes('western digital')) return 'WD'
  if (lower.includes('seagate')) return 'Seagate'
  if (lower.includes('toshiba')) return 'Toshiba'
  if (lower.includes('microsoft') || lower.includes('surface')) return 'Microsoft'
  if (lower.includes('kyocera')) return 'Kyocera'
  if (lower.includes('brother')) return 'Brother'
  if (lower.includes('apc')) return 'APC'
  if (lower.includes('mercury')) return 'Mercury'
  if (lower.includes('eaton')) return 'Eaton'
  if (lower.includes('eco flow') || lower.includes('ecoflow')) return 'EcoFlow'
  if (lower.includes('hisense')) return 'Hisense'
  if (lower.includes('starlink')) return 'Starlink'
  if (lower.includes('cursor')) return 'Cursor'
  if (lower.includes('baseus')) return 'Baseus'
  if (lower.includes('ugreen') || lower.includes('u-green')) return 'UGREEN'
  if (lower.includes('vention')) return 'Vention'
  if (lower.includes('anker')) return 'Anker'
  if (lower.includes('powerology')) return 'Powerology'
  if (lower.includes('premax')) return 'Premax'
  if (lower.includes('atlas')) return 'Atlas'
  if (lower.includes('tefno') || lower.includes('tecno')) return 'Tecno'
  if (lower.includes('google')) return 'Google'
  if (lower.includes('afox')) return 'Afox'
  if (lower.includes('yatai')) return 'Yatai'
  if (lower.includes('light wave')) return 'Light Wave'
  if (lower.includes('tripod')) return 'Tripod'
  if (lower.includes('officepoint')) return 'OfficePoint'
  if (lower.includes('zilla')) return 'Zilla'
  if (lower.includes('imation')) return 'Imation'
  return 'Generic'
}

// Category detection
function detectCategory(filename) {
  const lower = filename.toLowerCase()
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) return category
    }
  }
  return 'accessories'
}

// Generate description based on category and brand
function generateDescription(info, category) {
  const descriptions = {
    laptops: `Refurbished ${info.brand} laptop in excellent condition. Fully tested and ready for use. Perfect for business, education, and everyday computing tasks. Comes with warranty.`,
    printers: `${info.brand} printer - reliable printing solution for home and office. Features print, scan, and copy functions. Easy to use with wireless connectivity options.`,
    monitors: `${info.brand} monitor - crystal clear display for work and entertainment. Features vibrant colors and sharp resolution. Energy efficient design.`,
    desktops: `${info.brand} desktop computer - powerful performance for productivity. Fully tested and ready to use. Ideal for office work and business applications.`,
    networking: `${info.brand} networking equipment - reliable connectivity solution. Easy setup and configuration. Perfect for home and office networks.`,
    storage: `${info.brand} storage device - reliable data storage solution. Fast transfer speeds and durable design. Keep your files safe and accessible.`,
    accessories: `${info.brand} computer accessory - enhance your computing experience. High quality and reliable performance. Compatible with most devices.`,
    projectors: `${info.brand} projector - bright and clear projection for presentations and entertainment. Easy to set up and use. Multiple connectivity options.`,
    ups: `${info.brand} UPS - reliable power backup solution. Protect your equipment from power surges and outages. Automatic voltage regulation.`,
    scanners: `${info.brand} scanner - high quality document and photo scanning. Easy to use with multiple scan modes. Fast and efficient.`,
    software: `Genuine ${info.brand} software license. Full version with product key. Easy installation and activation. Perfect for home and office use.`,
    tablets: `${info.brand} tablet - powerful and portable device. Perfect for work, entertainment, and creativity. Long battery life and stunning display.`,
    audio: `${info.brand} audio device - premium sound quality for music and calls. Comfortable design for extended use. Wireless connectivity.`,
    power: `${info.brand} power solution - reliable backup power and charging. Portable and easy to use. Perfect for outdoor and emergency use.`,
    gaming: `${info.brand} gaming device - high performance for gaming enthusiasts. Powerful graphics and fast processing. Immersive gaming experience.`,
  }
  
  return descriptions[category] || descriptions.accessories
}

// Generate price based on category, brand, and specs
function generatePrice(info, category, filename) {
  const lower = filename.toLowerCase()
  let basePrice = 5000
  
  // Category base prices
  const categoryPrices = {
    laptops: 35000,
    printers: 15000,
    monitors: 12000,
    desktops: 25000,
    networking: 8000,
    storage: 3000,
    accessories: 2000,
    projectors: 45000,
    ups: 8000,
    scanners: 8000,
    software: 15000,
    tablets: 40000,
    audio: 8000,
    power: 25000,
    gaming: 60000,
  }
  
  basePrice = categoryPrices[category] || 5000
  
  // Brand adjustments
  if (info.brand === 'Apple') basePrice *= 1.5
  else if (info.brand === 'Dell' || info.brand === 'HP' || info.brand === 'Lenovo') basePrice *= 1.0
  else if (info.brand === 'Samsung') basePrice *= 1.1
  else if (info.brand === 'Logitech') basePrice *= 1.2
  else if (info.brand === 'Epson' || info.brand === 'Canon') basePrice *= 1.0
  
  // Spec adjustments
  if (lower.includes('i7') || lower.includes('ryzen 7') || lower.includes('ultra 7')) basePrice += 15000
  else if (lower.includes('i5') || lower.includes('ryzen 5') || lower.includes('ultra 5')) basePrice += 8000
  else if (lower.includes('i3') || lower.includes('ryzen 3')) basePrice += 3000
  
  if (lower.includes('16gb')) basePrice += 5000
  else if (lower.includes('32gb')) basePrice += 12000
  else if (lower.includes('8gb')) basePrice += 2000
  
  if (lower.includes('1tb')) basePrice += 5000
  else if (lower.includes('512gb')) basePrice += 3000
  else if (lower.includes('256gb')) basePrice += 1000
  
  if (lower.includes('rtx') || lower.includes('gtx')) basePrice += 15000
  if (lower.includes('touch')) basePrice += 5000
  if (lower.includes('4k') || lower.includes('uhd')) basePrice += 10000
  if (lower.includes('oled')) basePrice += 15000
  
  // Storage size adjustments
  if (category === 'storage') {
    if (lower.includes('128gb')) basePrice = 2500
    else if (lower.includes('64gb')) basePrice = 1800
    else if (lower.includes('32gb')) basePrice = 1200
    else if (lower.includes('16gb')) basePrice = 800
    else if (lower.includes('8gb')) basePrice = 500
    else if (lower.includes('4tb')) basePrice = 12000
    else if (lower.includes('2tb')) basePrice = 7000
    else if (lower.includes('1tb')) basePrice = 4500
  }
  
  // Monitor size adjustments
  if (category === 'monitors') {
    if (lower.includes('32') || lower.includes('34')) basePrice += 15000
    else if (lower.includes('27')) basePrice += 8000
    else if (lower.includes('24') || lower.includes('23')) basePrice += 3000
  }
  
  return Math.round(basePrice)
}

function slug(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function main() {
  const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.jpg'))
  console.log(`Found ${files.length} product images`)

  // Ensure categories exist
  const categories = Object.keys(categoryKeywords)
  for (const catName of categories) {
    const existing = await prisma.category.findUnique({ where: { slug: catName } })
    if (!existing) {
      await prisma.category.create({
        data: {
          name: catName.charAt(0).toUpperCase() + catName.slice(1),
          slug: catName,
          description: `${catName.charAt(0).toUpperCase() + catName.slice(1)} products`,
        },
      })
      console.log(`Created category: ${catName}`)
    }
  }

  let created = 0
  let updated = 0
  let skipped = 0

  for (const file of files) {
    try {
      const brand = detectBrand(file)
      const category = detectCategory(file)
      const name = file.replace('.jpg', '').replace(/_/g, ' ').replace(/\d{4}_/, '')
      const productSlug = slug(name)
      const price = generatePrice({ brand }, category, file)
      const description = generateDescription({ brand }, category)
      const imagePath = `/images/products/product_photos/${file}`

      const categoryRecord = await prisma.category.findUnique({ where: { slug: category } })
      if (!categoryRecord) {
        console.log(`Skipping ${file} - category ${category} not found`)
        skipped++
        continue
      }

      const existing = await prisma.product.findUnique({ where: { slug: productSlug } })

      if (existing) {
        await prisma.product.update({
          where: { slug: productSlug },
          data: {
            images: [imagePath],
            price,
            description,
            categoryId: categoryRecord.id,
            brand,
            status: 'ACTIVE',
          },
        })
        updated++
        console.log(`Updated: ${name.substring(0, 50)}...`)
      } else {
        await prisma.product.create({
          data: {
            name: name.substring(0, 200),
            slug: productSlug,
            price,
            description,
            images: [imagePath],
            categoryId: categoryRecord.id,
            brand,
            stock: Math.floor(Math.random() * 5) + 1,
            status: 'ACTIVE',
            featured: Math.random() > 0.85,
          },
        })
        created++
        console.log(`Created: ${name.substring(0, 50)}... - KES ${price.toLocaleString()}`)
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message)
      skipped++
    }
  }

  console.log(`\n=== Summary ===`)
  console.log(`Created: ${created}`)
  console.log(`Updated: ${updated}`)
  console.log(`Skipped: ${skipped}`)
  console.log(`Total: ${created + updated + skipped}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
