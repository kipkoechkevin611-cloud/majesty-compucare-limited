import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const input = path.join(process.cwd(), 'public', 'logo.jpeg')
const outDir = path.join(process.cwd(), 'public')

async function main() {
  const base = await sharp(input).resize(512, 512, { fit: 'contain', background: '#ffffff' }).toBuffer()

  // logo.png
  await sharp(base).png().toFile(path.join(outDir, 'logo.png'))

  // android-chrome sizes
  await sharp(base).resize(192, 192, { fit: 'contain', background: '#ffffff' }).png().toFile(path.join(outDir, 'android-chrome-192x192.png'))
  await sharp(base).resize(512, 512, { fit: 'contain', background: '#ffffff' }).png().toFile(path.join(outDir, 'android-chrome-512x512.png'))

  // apple touch icon
  await sharp(base).resize(180, 180, { fit: 'contain', background: '#ffffff' }).png().toFile(path.join(outDir, 'apple-touch-icon.png'))

  // favicon pngs
  await sharp(base).resize(32, 32, { fit: 'contain', background: '#ffffff' }).png().toFile(path.join(outDir, 'favicon-32x32.png'))
  await sharp(base).resize(16, 16, { fit: 'contain', background: '#ffffff' }).png().toFile(path.join(outDir, 'favicon-16x16.png'))

  // favicon.ico (use 32x32 png as fallback)
  await sharp(base).resize(32, 32, { fit: 'contain', background: '#ffffff' }).png().toFile(path.join(outDir, 'favicon.ico'))

  console.log('Favicon assets generated successfully')
}

main().catch(err => {
  console.error('Favicon generation failed:', err)
  process.exit(1)
})
