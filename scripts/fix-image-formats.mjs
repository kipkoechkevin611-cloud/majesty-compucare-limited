/**
 * Fix: extracted images are PNG data with .jpg extension.
 * Renames them to .png and updates the database paths.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
config()

const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } })
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const productsDir = path.join(__dirname, '..', 'public', 'products')

async function main() {
  const files = fs.readdirSync(productsDir).filter(f => f.endsWith('.jpg'))
  let renamed = 0, updated = 0, skipped = 0

  for (const file of files) {
    const oldPath = path.join(productsDir, file)
    const newName = file.replace(/\.jpg$/, '.png')
    const newPath = path.join(productsDir, newName)

    // Rename file
    fs.renameSync(oldPath, newPath)
    renamed++

    // Update DB
    const oldUrl = `/products/${file}`
    const newUrl = `/products/${newName}`

    const result = await prisma.product.updateMany({
      where: { images: { has: oldUrl } },
      data: { images: [newUrl] }
    })

    if (result.count > 0) {
      updated += result.count
      console.log(`✓ ${file} → ${newName} (${result.count} record)`)
    } else {
      skipped++
      console.log(`? ${file} → no DB match`)
    }
  }

  console.log(`\nDone — renamed: ${renamed}, DB records updated: ${updated}, no-match: ${skipped}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
