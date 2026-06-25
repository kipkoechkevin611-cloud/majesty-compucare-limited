/**
 * Move product images from /public/products/ to /public/images/products/
 * to avoid conflict with the Next.js /products/[id] dynamic route.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
config()

const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } })
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const oldDir = path.join(__dirname, '..', 'public', 'products')
const newDir = path.join(__dirname, '..', 'public', 'images', 'products')

if (!fs.existsSync(newDir)) fs.mkdirSync(newDir, { recursive: true })

async function main() {
  const products = await prisma.product.findMany({ select: { id: true, slug: true, images: true } })
  let moved = 0, updated = 0, missing = 0

  for (const product of products) {
    const oldPath = product.images?.[0] || ''
    if (!oldPath.startsWith('/products/')) continue

    const filename = path.basename(oldPath)
    const oldFile = path.join(oldDir, filename)
    const newFile = path.join(newDir, filename)
    const newUrl = `/images/products/${filename}`

    if (!fs.existsSync(oldFile)) {
      console.log(`  MISSING file: ${filename}`)
      missing++
      continue
    }

    fs.renameSync(oldFile, newFile)
    moved++

    await prisma.product.update({
      where: { id: product.id },
      data: { images: [newUrl] }
    })
    updated++
    console.log(`✓ ${filename} → ${newUrl}`)
  }

  console.log(`\nDone — moved: ${moved}, DB updated: ${updated}, missing: ${missing}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
