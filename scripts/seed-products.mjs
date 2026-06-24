/**
 * Product seeding script — sourced from:
 *  - Majesty_Compucare_Product_Catalogue_HP_Part1.pdf (names + prices)
 *  - product_catalog.pdf (additional model names)
 *
 * Images: stock laptop photos from Unsplash per brand.
 * Run: node scripts/seed-products.mjs
 */

import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
config()

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
})

// Unsplash images per brand (consistent, reliable URLs)
const IMAGES = {
  HP_ELITEBOOK:  ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80'],
  HP_ZBOOK:      ['https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&q=80'],
  HP_DRAGONFLY:  ['https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80'],
  APPLE:         ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'],
  DELL:          ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80'],
  LENOVO:        ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80'],
}

function slug(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

// Products extracted from PDFs
// price=0 means no price in catalogue (Dell/Lenovo extras) — admin should update
const PRODUCTS = [
  // ── HP ZBook Workstations ──────────────────────────────────────
  { name: 'HP ZBook 15 G8 i7',           price: 60000, brand: 'HP', images: IMAGES.HP_ZBOOK,      featured: true,  stock: 3 },
  { name: 'HP ZBook 14 G8 i7 32GB',      price: 65000, brand: 'HP', images: IMAGES.HP_ZBOOK,      featured: true,  stock: 3 },
  { name: 'HP ZBook 14 G8 i7 16GB',      price: 60000, brand: 'HP', images: IMAGES.HP_ZBOOK,      featured: false, stock: 3 },
  { name: 'HP ZBook 14 G7 i7 Touch',     price: 60000, brand: 'HP', images: IMAGES.HP_ZBOOK,      featured: false, stock: 3 },
  { name: 'HP ZBook 14 G7 i7 Non Touch', price: 59000, brand: 'HP', images: IMAGES.HP_ZBOOK,      featured: false, stock: 3 },
  { name: 'HP ZBook 14 G6 i7 Touch',     price: 44000, brand: 'HP', images: IMAGES.HP_ZBOOK,      featured: false, stock: 3 },

  // ── HP Elite Dragonfly ─────────────────────────────────────────
  { name: 'HP Elite Dragonfly i7 11th X360', price: 55000, brand: 'HP', images: IMAGES.HP_DRAGONFLY, featured: true,  stock: 3 },
  { name: 'HP Elite Dragonfly i7 8th X360',  price: 46000, brand: 'HP', images: IMAGES.HP_DRAGONFLY, featured: false, stock: 3 },
  { name: 'HP Elite Dragonfly i5 8th X360',  price: 45000, brand: 'HP', images: IMAGES.HP_DRAGONFLY, featured: false, stock: 3 },

  // ── HP EliteBook 1040 series ───────────────────────────────────
  { name: 'HP EliteBook 1040 G10 i7',        price: 65000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: true,  stock: 5 },
  { name: 'HP EliteBook 1040 G8 i7 X360',    price: 61000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: true,  stock: 5 },
  { name: 'HP EliteBook 1040 G8 i5 X360',    price: 45000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP EliteBook 1040 G7 i7 X360',    price: 50000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP EliteBook 1040 G6 i7 X360',    price: 43000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP EliteBook 1040 G5 i5 X360',    price: 34000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },

  // ── HP EliteBook 1030 series ───────────────────────────────────
  { name: 'HP EliteBook 1030 G8 i7 X360',    price: 56000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP EliteBook 1030 G8 i5 X360',    price: 43000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP EliteBook 1030 G7 i7 X360',    price: 49000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP EliteBook 1030 G7 i5 X360',    price: 46000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP EliteBook 1030 G4 i5 X360',    price: 34000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP EliteBook 1030 G3 i7 X360',    price: 43000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP EliteBook 1030 G3 i5 X360',    price: 33000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP EliteBook 1030 G2 i5 X360',    price: 31500, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },

  // ── HP Elite x2 ────────────────────────────────────────────────
  { name: 'HP Elite x2 1012 i5 Touch',       price: 28000, brand: 'HP', images: IMAGES.HP_DRAGONFLY, featured: false, stock: 3 },
  { name: 'HP Elite x2 1012 i5 Non Touch',   price: 24000, brand: 'HP', images: IMAGES.HP_DRAGONFLY, featured: false, stock: 3 },

  // ── HP EliteBook 850 series ────────────────────────────────────
  { name: 'HP EliteBook 850 G7 i7 Touch',    price: 45000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP EliteBook 850 G7 i7 Non Touch',price: 44000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP EliteBook 850 G6 i7 Touch',    price: 43000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP EliteBook 850 G3 i5',          price: 22000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },

  // ── HP EliteBook 845/745 (AMD) ─────────────────────────────────
  { name: 'HP EliteBook 845 G7 Ryzen 3',     price: 26000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP EliteBook 745 G6 Ryzen 7',     price: 29000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP EliteBook 745 G6 Ryzen 5',     price: 25000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },

  // ── HP EliteBook 840 series ────────────────────────────────────
  { name: 'HP EliteBook 840 G8',  price: 42000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP EliteBook 840 G7',  price: 38000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP EliteBook 840 G6',  price: 32000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP EliteBook 840 G5',  price: 28000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP EliteBook 840 G4',  price: 24000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP EliteBook 840 G3',  price: 21000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP EliteBook 840 G2',  price: 18000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP EliteBook 840 G1',  price: 16000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },

  // ── HP EliteBook 830 series ────────────────────────────────────
  { name: 'HP EliteBook 830 G8',  price: 40000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP EliteBook 830 G7',  price: 36000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP EliteBook 830 G6',  price: 32000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP EliteBook 830 G5',  price: 28000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },

  // ── HP EliteBook 820 series ────────────────────────────────────
  { name: 'HP EliteBook 820 G4',  price: 22000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP EliteBook 820 G3',  price: 19000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP EliteBook 820 G2',  price: 16000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP EliteBook 820 G1',  price: 14000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },

  // ── HP ProBook series ──────────────────────────────────────────
  { name: 'HP ProBook 640 G5',    price: 24000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP ProBook 640 G4',    price: 21000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP ProBook 640 G2',    price: 17000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP ProBook 11 G6',     price: 16000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP ProBook 11 G4',     price: 13000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP ProBook 11 G2',     price: 11000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP ProBook 11 G1',     price: 10000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },
  { name: 'HP EliteBook 8470P',   price: 14000, brand: 'HP', images: IMAGES.HP_ELITEBOOK, featured: false, stock: 5 },

  // ── Apple MacBooks ─────────────────────────────────────────────
  { name: 'Apple MacBook Pro 15" 2019 i7', price: 61000, brand: 'Apple', images: IMAGES.APPLE, featured: true,  stock: 3 },
  { name: 'Apple MacBook Pro 15" 2018 i7', price: 57000, brand: 'Apple', images: IMAGES.APPLE, featured: false, stock: 3 },
  { name: 'Apple MacBook Air 2017 i5',     price: 23000, brand: 'Apple', images: IMAGES.APPLE, featured: false, stock: 3 },
  { name: 'Apple MacBook Air 2015 i7',     price: 23000, brand: 'Apple', images: IMAGES.APPLE, featured: false, stock: 3 },
  { name: 'Apple MacBook Air 2015 i5',     price: 21000, brand: 'Apple', images: IMAGES.APPLE, featured: false, stock: 3 },
  { name: 'Apple MacBook Pro 2012 i5',     price: 16000, brand: 'Apple', images: IMAGES.APPLE, featured: false, stock: 3 },

  // ── Dell Laptops ───────────────────────────────────────────────
  { name: 'Dell Precision 7550',     price: 65000, brand: 'Dell', images: IMAGES.DELL, featured: true,  stock: 3 },
  { name: 'Dell XPS 13 7390',        price: 55000, brand: 'Dell', images: IMAGES.DELL, featured: true,  stock: 3 },
  { name: 'Dell XPS 13 9350',        price: 38000, brand: 'Dell', images: IMAGES.DELL, featured: false, stock: 3 },
  { name: 'Dell Latitude 7400',      price: 45000, brand: 'Dell', images: IMAGES.DELL, featured: false, stock: 5 },
  { name: 'Dell Latitude 7320',      price: 42000, brand: 'Dell', images: IMAGES.DELL, featured: false, stock: 5 },
  { name: 'Dell Latitude 7310',      price: 40000, brand: 'Dell', images: IMAGES.DELL, featured: false, stock: 5 },
  { name: 'Dell Latitude 7300',      price: 38000, brand: 'Dell', images: IMAGES.DELL, featured: false, stock: 5 },
  { name: 'Dell Latitude 7390',      price: 36000, brand: 'Dell', images: IMAGES.DELL, featured: false, stock: 5 },
  { name: 'Dell Latitude 7290',      price: 32000, brand: 'Dell', images: IMAGES.DELL, featured: false, stock: 5 },
  { name: 'Dell Latitude 5400',      price: 28000, brand: 'Dell', images: IMAGES.DELL, featured: false, stock: 5 },
  { name: 'Dell Latitude 5300',      price: 26000, brand: 'Dell', images: IMAGES.DELL, featured: false, stock: 5 },
  { name: 'Dell Latitude 3410',      price: 22000, brand: 'Dell', images: IMAGES.DELL, featured: false, stock: 5 },
  { name: 'Dell Latitude 3120',      price: 18000, brand: 'Dell', images: IMAGES.DELL, featured: false, stock: 5 },

  // ── Lenovo ThinkPads ───────────────────────────────────────────
  { name: 'Lenovo ThinkPad X1 Carbon',  price: 55000, brand: 'Lenovo', images: IMAGES.LENOVO, featured: true,  stock: 3 },
  { name: 'Lenovo ThinkPad X1 Yoga',    price: 52000, brand: 'Lenovo', images: IMAGES.LENOVO, featured: false, stock: 3 },
  { name: 'Lenovo ThinkPad P14s',       price: 48000, brand: 'Lenovo', images: IMAGES.LENOVO, featured: false, stock: 3 },
  { name: 'Lenovo ThinkPad T495s',      price: 35000, brand: 'Lenovo', images: IMAGES.LENOVO, featured: false, stock: 5 },
  { name: 'Lenovo ThinkPad T490s',      price: 33000, brand: 'Lenovo', images: IMAGES.LENOVO, featured: false, stock: 5 },
  { name: 'Lenovo ThinkPad T480s',      price: 30000, brand: 'Lenovo', images: IMAGES.LENOVO, featured: false, stock: 5 },
  { name: 'Lenovo ThinkPad T470s',      price: 27000, brand: 'Lenovo', images: IMAGES.LENOVO, featured: false, stock: 5 },
  { name: 'Lenovo ThinkPad T460s',      price: 22000, brand: 'Lenovo', images: IMAGES.LENOVO, featured: false, stock: 5 },
  { name: 'Lenovo ThinkPad X13',        price: 38000, brand: 'Lenovo', images: IMAGES.LENOVO, featured: false, stock: 5 },
  { name: 'Lenovo ThinkPad X390',       price: 32000, brand: 'Lenovo', images: IMAGES.LENOVO, featured: false, stock: 5 },
  { name: 'Lenovo ThinkPad X280',       price: 26000, brand: 'Lenovo', images: IMAGES.LENOVO, featured: false, stock: 5 },
  { name: 'Lenovo ThinkPad X270',       price: 22000, brand: 'Lenovo', images: IMAGES.LENOVO, featured: false, stock: 5 },
  { name: 'Lenovo ThinkPad X260',       price: 19000, brand: 'Lenovo', images: IMAGES.LENOVO, featured: false, stock: 5 },
  { name: 'Lenovo ThinkPad X250',       price: 17000, brand: 'Lenovo', images: IMAGES.LENOVO, featured: false, stock: 5 },
  { name: 'Lenovo ThinkPad X240',       price: 15000, brand: 'Lenovo', images: IMAGES.LENOVO, featured: false, stock: 5 },
  { name: 'Lenovo ThinkPad Yoga X13',   price: 40000, brand: 'Lenovo', images: IMAGES.LENOVO, featured: false, stock: 3 },
  { name: 'Lenovo ThinkPad Yoga X390',  price: 35000, brand: 'Lenovo', images: IMAGES.LENOVO, featured: false, stock: 3 },
  { name: 'Lenovo ThinkPad Yoga 11e',   price: 16000, brand: 'Lenovo', images: IMAGES.LENOVO, featured: false, stock: 5 },
]

async function main() {
  const laptopCat = await prisma.category.findUnique({ where: { slug: 'laptops' } })
  if (!laptopCat) {
    console.error('ERROR: "laptops" category not found. Run create-admin.mjs first.')
    process.exit(1)
  }

  console.log(`Seeding ${PRODUCTS.length} products into category: ${laptopCat.name}`)

  let created = 0, updated = 0, skipped = 0

  for (const p of PRODUCTS) {
    const productSlug = slug(p.name)
    const description = `${p.name} — ${p.brand} laptop available at Majesty Compucare Limited, Nakuru. Genuine quality, tested and ready for use. Contact us to confirm current stock.`
    const shortDescription = `${p.brand} laptop — KES ${p.price.toLocaleString()}`

    try {
      const existing = await prisma.product.findUnique({ where: { slug: productSlug } })

      if (existing) {
        await prisma.product.update({
          where: { slug: productSlug },
          data: {
            price:   p.price,
            images:  p.images,
            brand:   p.brand,
            stock:   p.stock,
            featured: p.featured,
            shortDescription,
          }
        })
        updated++
        process.stdout.write(`  ✓ updated: ${p.name}\n`)
      } else {
        await prisma.product.create({
          data: {
            name:             p.name,
            slug:             productSlug,
            description,
            shortDescription,
            brand:            p.brand,
            price:            p.price,
            stock:            p.stock,
            images:           p.images,
            featured:         p.featured,
            status:           'ACTIVE',
            categoryId:       laptopCat.id,
          }
        })
        created++
        process.stdout.write(`  + created: ${p.name}\n`)
      }
    } catch (e) {
      console.error(`  ✗ SKIP: ${p.name} — ${e.message}`)
      skipped++
    }
  }

  console.log(`\nDone — created: ${created}, updated: ${updated}, skipped: ${skipped}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
