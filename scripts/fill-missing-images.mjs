/**
 * Fill missing images for product variants that don't have their own PDF image.
 * Maps variants to the closest base-model image.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
config()

const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } })
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const productsDir = path.join(__dirname, '..', 'public', 'images', 'products')

// Map variant slugs to base model image filename
const VARIANT_MAP = {
  // ZBook variants
  'hp-zbook-14-g8-i7-16gb': 'hp-zbook-14-g8.png',
  'hp-zbook-14-g7-i7-non-touch': 'hp-zbook-14-g7.png',
  'hp-zbook-14-g6-i7-non-touch': 'hp-zbook-14-g6.png',
  // Dragonfly variants
  'hp-elite-dragonfly-i7-8th-x360': 'hp-elite-dragonfly.png',
  'hp-elite-dragonfly-i5-8th-x360': 'hp-elite-dragonfly.png',
  // 1040 variants
  'hp-elitebook-1040-g8-i7-x360': 'hp-elitebook-1040-g8.png',
  'hp-elitebook-1040-g8-i5-x360': 'hp-elitebook-1040-g8.png',
  'hp-elitebook-1040-g7-i7-x360': 'hp-elitebook-1040-g7.png',
  'hp-elitebook-1040-g6-i7-x360': 'hp-elitebook-1040-g6.png',
  'hp-elitebook-1040-g5-i5-x360': 'hp-elitebook-1040-g5.png',
  // 1030 variants
  'hp-elitebook-1030-g8-i5-x360': 'hp-elitebook-1030-g8.png',
  'hp-elitebook-1030-g7-i5-x360': 'hp-elitebook-1030-g7.png',
  'hp-elitebook-1030-g3-i5-x360': 'hp-elitebook-1030-g3-i7.png',
  // 850 variants
  'hp-elitebook-850-g7-i7-non-touch': 'hp-elitebook-850-g7.png',
  'hp-elitebook-850-g6-i7-non-touch': 'hp-elitebook-850-g6.png',
  // x2 1012 variants
  'hp-elite-x2-1012-i5-non-touch': 'hp-elite-x2-1012.png',
  // 745 Ryzen 5 variant
  'hp-elitebook-745-g6-ryzen-5': 'hp-elitebook-745-g6.png',
  // Apple Air 2015 i5 variant
  'apple-macbook-air-2015-i5': 'apple-macbook-air-2015.png',
  // MacBook Pro 2018 i7 variant
  'apple-macbook-pro-15-2018-i7': 'apple-macbook-pro-15-2018.png',
  // MacBook Air 2017 i7 variant
  'apple-macbook-air-2015-i7': 'apple-macbook-air-2015.png',
}

async function main() {
  const allProducts = await prisma.product.findMany({
    select: { id: true, slug: true, name: true, images: true }
  })

  let fixed = 0, skipped = 0

  for (const product of allProducts) {
    const imgFile = VARIANT_MAP[product.slug]
    if (!imgFile) continue

    const srcPath = path.join(productsDir, imgFile)
    const newFile = product.slug.replace(/-/g, '-') + '.png'  // keep slug as filename
    const destPath = path.join(productsDir, newFile)
    const dbUrl = `/images/products/${newFile}`

    if (!fs.existsSync(srcPath)) {
      console.log(`  Source image missing for ${product.slug}: ${imgFile}`)
      skipped++
      continue
    }

    // Copy base image to variant filename
    fs.copyFileSync(srcPath, destPath)

    // Update DB
    await prisma.product.update({
      where: { id: product.id },
      data: { images: [dbUrl] }
    })

    fixed++
    console.log(`✓ ${product.slug} → ${dbUrl}`)
  }

  // Also check for any remaining products with external URLs
  const remaining = await prisma.product.findMany({
    where: { images: { has: 'images.unsplash.com' } },
    select: { slug: true, name: true, images: true }
  })

  console.log(`\nDone — fixed: ${fixed}, skipped: ${skipped}`)
  if (remaining.length) {
    console.log(`\nStill ${remaining.length} products with Unsplash images:`)
    remaining.forEach(p => console.log(`  - ${p.slug}`))
  } else {
    console.log('\nAll products now use local PDF-extracted images.')
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
