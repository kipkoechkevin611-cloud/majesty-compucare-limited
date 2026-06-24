import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import mupdf from 'mupdf'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads')

function extractText(filePath) {
  const buf = fs.readFileSync(filePath)
  const doc = mupdf.Document.openDocument(buf, 'application/pdf')
  let text = ''
  const count = doc.countPages()
  for (let i = 0; i < count; i++) {
    const page = doc.loadPage(i)
    const txt = page.toStructuredText('preserve-whitespace').asText()
    text += `\n--- Page ${i + 1} ---\n${txt}`
  }
  return { numPages: count, text }
}

const files = fs.readdirSync(uploadsDir).filter(f => f.endsWith('.pdf'))
console.log('Found PDFs:', files)

for (const file of files) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`FILE: ${file}`)
  console.log('='.repeat(60))
  try {
    const { numPages, text } = extractText(path.join(uploadsDir, file))
    console.log(`Pages: ${numPages}`)
    console.log('\n--- EXTRACTED TEXT (first 6000 chars) ---\n')
    console.log(text)
  } catch (e) {
    console.error('Error:', e.message)
  }
}
