/**
 * Update DB paths for products whose images were already moved to /images/products/.
 */
import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
config()

const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } })

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function main() {
  const all = await prisma.product.findMany({ select: { id: true, slug: true, images: true } })
  const products = all.filter(p => p.images?.[0]?.startsWith('/products/'))

  console.log(`Found ${products.length} products with old paths`)

  for (const product of products) {
    const oldPath = product.images[0]
    const filename = oldPath.replace('/products/', '')
    const newUrl = `/images/products/${filename}`

    let attempts = 0
    while (attempts < 3) {
      try {
        await prisma.product.update({
          where: { id: product.id },
          data: { images: [newUrl] }
        })
        console.log(`✓ ${product.slug} → ${newUrl}`)
        break
      } catch (e) {
        attempts++
        console.error(`  Retry ${attempts} for ${product.slug}: ${e.message}`)
        await sleep(500)
      }
    }
  }

  console.log('\nDone')
}

main().catch(console.error).finally(() => prisma.$disconnect())
