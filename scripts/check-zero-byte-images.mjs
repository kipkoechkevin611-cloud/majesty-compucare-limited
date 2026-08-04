import fs from 'fs'
import path from 'path'

const imagesDir = path.join(process.cwd(), 'public', 'images', 'products', 'product_photos')
const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.jpg'))

const zeroByteFiles = files.filter(f => {
  const filePath = path.join(imagesDir, f)
  const stats = fs.statSync(filePath)
  return stats.size === 0
})

console.log(`Total files: ${files.length}`)
console.log(`Zero-byte files: ${zeroByteFiles.length}`)

if (zeroByteFiles.length > 0) {
  console.log('\nZero-byte files:')
  zeroByteFiles.forEach(f => console.log(`- ${f}`))
}
