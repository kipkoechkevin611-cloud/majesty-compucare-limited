/**
 * Move restored files from /public/products to /public/images/products.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const oldDir = path.join(__dirname, '..', 'public', 'products')
const newDir = path.join(__dirname, '..', 'public', 'images', 'products')

if (!fs.existsSync(newDir)) fs.mkdirSync(newDir, { recursive: true })

const files = fs.readdirSync(oldDir).filter(f => f.endsWith('.png'))
for (const file of files) {
  const src = path.join(oldDir, file)
  const dest = path.join(newDir, file)
  fs.renameSync(src, dest)
  console.log(`Moved ${file}`)
}

console.log(`\nDone — moved ${files.length} files`)
