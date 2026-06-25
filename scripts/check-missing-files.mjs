import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'
config()

const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } })
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const imgDir = path.join(__dirname, '..', 'public', 'images', 'products')

const products = await prisma.product.findMany({ select: { slug: true, images: true } })
const missing = []

for (const p of products) {
  const imgPath = p.images?.[0] || ''
  if (!imgPath.startsWith('/images/products/')) continue
  const filename = path.basename(imgPath)
  const fullPath = path.join(imgDir, filename)
  if (!fs.existsSync(fullPath)) {
    missing.push({ slug: p.slug, filename, path: imgPath })
  }
}

console.log(`Missing ${missing.length} files:`)
missing.forEach(m => console.log(`  - ${m.slug} → ${m.filename}`))
await prisma.$disconnect()
