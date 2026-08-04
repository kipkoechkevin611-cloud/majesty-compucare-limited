import fs from 'fs'
import path from 'path'

const imagesDir = path.join(process.cwd(), 'public', 'images', 'products', 'product_photos')
const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.jpg'))

const sizes = files.map(f => {
  const filePath = path.join(imagesDir, f)
  const stats = fs.statSync(filePath)
  return { name: f, size: stats.size }
})

sizes.sort((a, b) => a.size - b.size)

console.log('Smallest 10 files:')
sizes.slice(0, 10).forEach(f => {
  console.log(`${f.name}: ${f.size} bytes`)
})

console.log('\nLargest 10 files:')
sizes.slice(-10).forEach(f => {
  console.log(`${f.name}: ${f.size} bytes`)
})

console.log(`\nAverage size: ${Math.round(sizes.reduce((a, b) => a + b.size, 0) / sizes.length)} bytes`)
