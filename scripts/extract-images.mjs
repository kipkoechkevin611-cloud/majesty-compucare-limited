/**
 * Extract individual product images from product_catalog.pdf
 * Maps each product to its image and saves to /public/products/
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import mupdf from 'mupdf'
import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
config()

const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } })
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pdfPath  = path.join(__dirname, '..', 'public', 'uploads', 'product_catalog.pdf')
const outDir   = path.join(__dirname, '..', 'public', 'products')

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

// Map: product name in PDF → product slug in DB + output filename
// Order matches the PDF page layout exactly (top to bottom, page by page)
const PRODUCT_MAP = [
  // Page 1 — Apple MacBooks
  { pdfName: 'MacBook Pro 15" (2019)',  slug: 'apple-macbook-pro-15-2019-i7',  file: 'apple-macbook-pro-15-2019.jpg' },
  { pdfName: 'MacBook Pro 15" (2018)',  slug: 'apple-macbook-pro-15-2018-i7',  file: 'apple-macbook-pro-15-2018.jpg' },
  { pdfName: 'MacBook Air (2017)',       slug: 'apple-macbook-air-2017-i5',     file: 'apple-macbook-air-2017.jpg' },
  { pdfName: 'MacBook Air (2015)',       slug: 'apple-macbook-air-2015-i7',     file: 'apple-macbook-air-2015.jpg' },
  // Page 2
  { pdfName: 'MacBook Pro (2012)',       slug: 'apple-macbook-pro-2012-i5',     file: 'apple-macbook-pro-2012.jpg' },
  { pdfName: 'Dell Precision 7550',      slug: 'dell-precision-7550',           file: 'dell-precision-7550.jpg' },
  { pdfName: 'Dell XPS 13 7390',         slug: 'dell-xps-13-7390',              file: 'dell-xps-13-7390.jpg' },
  { pdfName: 'Dell XPS 13 9350',         slug: 'dell-xps-13-9350',              file: 'dell-xps-13-9350.jpg' },
  // Page 3
  { pdfName: 'Dell Latitude 7400',       slug: 'dell-latitude-7400',            file: 'dell-latitude-7400.jpg' },
  { pdfName: 'Dell Latitude 7320',       slug: 'dell-latitude-7320',            file: 'dell-latitude-7320.jpg' },
  { pdfName: 'Dell Latitude 7310',       slug: 'dell-latitude-7310',            file: 'dell-latitude-7310.jpg' },
  { pdfName: 'Dell Latitude 7300',       slug: 'dell-latitude-7300',            file: 'dell-latitude-7300.jpg' },
  // Page 4
  { pdfName: 'Dell Latitude 7390',       slug: 'dell-latitude-7390',            file: 'dell-latitude-7390.jpg' },
  { pdfName: 'Dell Latitude 7290',       slug: 'dell-latitude-7290',            file: 'dell-latitude-7290.jpg' },
  { pdfName: 'Dell Latitude 5400',       slug: 'dell-latitude-5400',            file: 'dell-latitude-5400.jpg' },
  { pdfName: 'Dell Latitude 5300',       slug: 'dell-latitude-5300',            file: 'dell-latitude-5300.jpg' },
  // Page 5
  { pdfName: 'Dell Latitude 3410',       slug: 'dell-latitude-3410',            file: 'dell-latitude-3410.jpg' },
  { pdfName: 'Dell Latitude 3120',       slug: 'dell-latitude-3120',            file: 'dell-latitude-3120.jpg' },
  // Page 6
  { pdfName: 'HP EliteBook 1040 G10',    slug: 'hp-elitebook-1040-g10-i7',     file: 'hp-elitebook-1040-g10.jpg' },
  { pdfName: 'HP EliteBook 1040 G8',     slug: 'hp-elitebook-1040-g8-i7-x360', file: 'hp-elitebook-1040-g8.jpg' },
  { pdfName: 'HP EliteBook 1040 G7',     slug: 'hp-elitebook-1040-g7-i7-x360', file: 'hp-elitebook-1040-g7.jpg' },
  { pdfName: 'HP EliteBook 1040 G6',     slug: 'hp-elitebook-1040-g6-i7-x360', file: 'hp-elitebook-1040-g6.jpg' },
  // Page 7
  { pdfName: 'HP EliteBook 1040 G5',     slug: 'hp-elitebook-1040-g5-i5-x360', file: 'hp-elitebook-1040-g5.jpg' },
  { pdfName: 'HP EliteBook 1030 G8',     slug: 'hp-elitebook-1030-g8-i7-x360', file: 'hp-elitebook-1030-g8.jpg' },
  { pdfName: 'HP EliteBook 1030 G7',     slug: 'hp-elitebook-1030-g7-i7-x360', file: 'hp-elitebook-1030-g7.jpg' },
  // Page 8
  { pdfName: 'HP EliteBook 1030 G4',     slug: 'hp-elitebook-1030-g4-i5-x360', file: 'hp-elitebook-1030-g4.jpg' },
  { pdfName: 'HP EliteBook 1030 G3 i7',  slug: 'hp-elitebook-1030-g3-i7-x360', file: 'hp-elitebook-1030-g3-i7.jpg' },
  { pdfName: 'HP EliteBook 1030 G2',     slug: 'hp-elitebook-1030-g2-i5-x360', file: 'hp-elitebook-1030-g2.jpg' },
  { pdfName: 'HP EliteBook 850 G7 Touch',slug: 'hp-elitebook-850-g7-i7-touch', file: 'hp-elitebook-850-g7.jpg' },
  { pdfName: 'HP EliteBook 850 G6',      slug: 'hp-elitebook-850-g6-i7-touch', file: 'hp-elitebook-850-g6.jpg' },
  // Page 9
  { pdfName: 'HP EliteBook 850 G3',      slug: 'hp-elitebook-850-g3-i5',       file: 'hp-elitebook-850-g3.jpg' },
  { pdfName: 'HP EliteBook 845 G7',      slug: 'hp-elitebook-845-g7-ryzen-3',  file: 'hp-elitebook-845-g7.jpg' },
  { pdfName: 'HP EliteBook 840 G8',      slug: 'hp-elitebook-840-g8',          file: 'hp-elitebook-840-g8.jpg' },
  // Page 10
  { pdfName: 'HP EliteBook 840 G7',      slug: 'hp-elitebook-840-g7',          file: 'hp-elitebook-840-g7.jpg' },
  { pdfName: 'HP EliteBook 840 G6',      slug: 'hp-elitebook-840-g6',          file: 'hp-elitebook-840-g6.jpg' },
  { pdfName: 'HP EliteBook 840 G5',      slug: 'hp-elitebook-840-g5',          file: 'hp-elitebook-840-g5.jpg' },
  { pdfName: 'HP EliteBook 840 G4',      slug: 'hp-elitebook-840-g4',          file: 'hp-elitebook-840-g4.jpg' },
  // Page 11
  { pdfName: 'HP EliteBook 840 G3',      slug: 'hp-elitebook-840-g3',          file: 'hp-elitebook-840-g3.jpg' },
  { pdfName: 'HP EliteBook 840 G2',      slug: 'hp-elitebook-840-g2',          file: 'hp-elitebook-840-g2.jpg' },
  { pdfName: 'HP EliteBook 840 G1',      slug: 'hp-elitebook-840-g1',          file: 'hp-elitebook-840-g1.jpg' },
  { pdfName: 'HP EliteBook 830 G8',      slug: 'hp-elitebook-830-g8',          file: 'hp-elitebook-830-g8.jpg' },
  // Page 12
  { pdfName: 'HP EliteBook 830 G7',      slug: 'hp-elitebook-830-g7',          file: 'hp-elitebook-830-g7.jpg' },
  { pdfName: 'HP EliteBook 830 G6',      slug: 'hp-elitebook-830-g6',          file: 'hp-elitebook-830-g6.jpg' },
  { pdfName: 'HP EliteBook 830 G5',      slug: 'hp-elitebook-830-g5',          file: 'hp-elitebook-830-g5.jpg' },
  { pdfName: 'HP EliteBook 820 G4',      slug: 'hp-elitebook-820-g4',          file: 'hp-elitebook-820-g4.jpg' },
  // Page 13
  { pdfName: 'HP EliteBook 820 G3',      slug: 'hp-elitebook-820-g3',          file: 'hp-elitebook-820-g3.jpg' },
  { pdfName: 'HP EliteBook 820 G2',      slug: 'hp-elitebook-820-g2',          file: 'hp-elitebook-820-g2.jpg' },
  { pdfName: 'HP EliteBook 820 G1',      slug: 'hp-elitebook-820-g1',          file: 'hp-elitebook-820-g1.jpg' },
  { pdfName: 'HP ProBook 640 G5',        slug: 'hp-probook-640-g5',            file: 'hp-probook-640-g5.jpg' },
  // Page 14
  { pdfName: 'HP ProBook 640 G4',        slug: 'hp-probook-640-g4',            file: 'hp-probook-640-g4.jpg' },
  { pdfName: 'HP ProBook 640 G2',        slug: 'hp-probook-640-g2',            file: 'hp-probook-640-g2.jpg' },
  { pdfName: 'HP EliteBook 745 G6',      slug: 'hp-elitebook-745-g6-ryzen-7',  file: 'hp-elitebook-745-g6.jpg' },
  { pdfName: 'HP EliteBook 8470P',       slug: 'hp-elitebook-8470p',           file: 'hp-elitebook-8470p.jpg' },
  // Page 15
  { pdfName: 'HP Elite Dragonfly',       slug: 'hp-elite-dragonfly-i7-11th-x360', file: 'hp-elite-dragonfly.jpg' },
  { pdfName: 'HP Elite x2 1012',         slug: 'hp-elite-x2-1012-i5-touch',    file: 'hp-elite-x2-1012.jpg' },
  { pdfName: 'HP ProBook 11 G6',         slug: 'hp-probook-11-g6',             file: 'hp-probook-11-g6.jpg' },
  // Page 16
  { pdfName: 'HP ProBook 11 G4',         slug: 'hp-probook-11-g4',             file: 'hp-probook-11-g4.jpg' },
  { pdfName: 'HP ProBook 11 G2',         slug: 'hp-probook-11-g2',             file: 'hp-probook-11-g2.jpg' },
  { pdfName: 'HP ProBook 11 G1',         slug: 'hp-probook-11-g1',             file: 'hp-probook-11-g1.jpg' },
  // Page 17
  { pdfName: 'HP ZBook 15 G8',           slug: 'hp-zbook-15-g8-i7',           file: 'hp-zbook-15-g8.jpg' },
  { pdfName: 'HP ZBook 14 G8',           slug: 'hp-zbook-14-g8-i7-32gb',      file: 'hp-zbook-14-g8.jpg' },
  { pdfName: 'HP ZBook 14 G7',           slug: 'hp-zbook-14-g7-i7-touch',     file: 'hp-zbook-14-g7.jpg' },
  { pdfName: 'HP ZBook 14 G6',           slug: 'hp-zbook-14-g6-i7-touch',     file: 'hp-zbook-14-g6.jpg' },
  // Page 18
  { pdfName: 'ThinkPad X1 Carbon',       slug: 'lenovo-thinkpad-x1-carbon',   file: 'lenovo-thinkpad-x1-carbon.jpg' },
  { pdfName: 'ThinkPad X1 Yoga',         slug: 'lenovo-thinkpad-x1-yoga',     file: 'lenovo-thinkpad-x1-yoga.jpg' },
  { pdfName: 'ThinkPad P14s',            slug: 'lenovo-thinkpad-p14s',        file: 'lenovo-thinkpad-p14s.jpg' },
  // Page 19
  { pdfName: 'ThinkPad T495s',           slug: 'lenovo-thinkpad-t495s',       file: 'lenovo-thinkpad-t495s.jpg' },
  { pdfName: 'ThinkPad T490s',           slug: 'lenovo-thinkpad-t490s',       file: 'lenovo-thinkpad-t490s.jpg' },
  { pdfName: 'ThinkPad T480s',           slug: 'lenovo-thinkpad-t480s',       file: 'lenovo-thinkpad-t480s.jpg' },
  { pdfName: 'ThinkPad T470s',           slug: 'lenovo-thinkpad-t470s',       file: 'lenovo-thinkpad-t470s.jpg' },
  // Page 20
  { pdfName: 'ThinkPad T460s',           slug: 'lenovo-thinkpad-t460s',       file: 'lenovo-thinkpad-t460s.jpg' },
  { pdfName: 'ThinkPad X13',             slug: 'lenovo-thinkpad-x13',         file: 'lenovo-thinkpad-x13.jpg' },
  { pdfName: 'ThinkPad X390',            slug: 'lenovo-thinkpad-x390',        file: 'lenovo-thinkpad-x390.jpg' },
  { pdfName: 'ThinkPad X280',            slug: 'lenovo-thinkpad-x280',        file: 'lenovo-thinkpad-x280.jpg' },
  // Page 21
  { pdfName: 'ThinkPad X270',            slug: 'lenovo-thinkpad-x270',        file: 'lenovo-thinkpad-x270.jpg' },
  { pdfName: 'ThinkPad X260',            slug: 'lenovo-thinkpad-x260',        file: 'lenovo-thinkpad-x260.jpg' },
  { pdfName: 'ThinkPad X250',            slug: 'lenovo-thinkpad-x250',        file: 'lenovo-thinkpad-x250.jpg' },
  { pdfName: 'ThinkPad X240',            slug: 'lenovo-thinkpad-x240',        file: 'lenovo-thinkpad-x240.jpg' },
  // Page 22
  { pdfName: 'ThinkPad Yoga X13',        slug: 'lenovo-thinkpad-yoga-x13',    file: 'lenovo-thinkpad-yoga-x13.jpg' },
  { pdfName: 'ThinkPad Yoga X390',       slug: 'lenovo-thinkpad-yoga-x390',   file: 'lenovo-thinkpad-yoga-x390.jpg' },
  { pdfName: 'ThinkPad Yoga 11e',        slug: 'lenovo-thinkpad-yoga-11e',    file: 'lenovo-thinkpad-yoga-11e.jpg' },
]

// Products per page & header offset (px at 2x/144dpi scale)
const PAGE_CONFIG = {
  1:  { n:4, hdr:220 }, 2:  { n:4, hdr:60  }, 3:  { n:4, hdr:60 },
  4:  { n:4, hdr:60  }, 5:  { n:2, hdr:220 }, 6:  { n:4, hdr:100 },
  7:  { n:3, hdr:60  }, 8:  { n:5, hdr:60  }, 9:  { n:3, hdr:60 },
  10: { n:4, hdr:60  }, 11: { n:4, hdr:60  }, 12: { n:4, hdr:60 },
  13: { n:4, hdr:60  }, 14: { n:4, hdr:60  }, 15: { n:3, hdr:180},
  16: { n:3, hdr:60  }, 17: { n:4, hdr:180 }, 18: { n:3, hdr:180},
  19: { n:4, hdr:60  }, 20: { n:4, hdr:60  }, 21: { n:4, hdr:60 },
  22: { n:3, hdr:60  },
}

const doc = mupdf.Document.openDocument(fs.readFileSync(pdfPath), 'application/pdf')
const scale = 2.0
const matrix = mupdf.Matrix.scale(scale, scale)

let imgIdx = 0, updated = 0, skipped = 0
const slugToFile = {}

console.log(`Extracting images for ${PRODUCT_MAP.length} products...\n`)

for (let p = 0; p < doc.countPages(); p++) {
  const cfg = PAGE_CONFIG[p + 1]
  if (!cfg) continue
  const page = doc.loadPage(p)
  const px = page.toPixmap(matrix, mupdf.ColorSpace.DeviceRGB, false, true)
  const W = px.getWidth(), H = px.getHeight()
  const x0 = Math.floor(W * 0.50), x1 = W - 8
  const contentH = H - cfg.hdr
  const rowH = Math.floor(contentH / cfg.n)

  for (let r = 0; r < cfg.n; r++) {
    if (imgIdx >= PRODUCT_MAP.length) break
    const prod = PRODUCT_MAP[imgIdx]
    const y0 = cfg.hdr + r * rowH
    const y1 = Math.min(y0 + rowH, H)
    const cropped = px.warp([[x0,y0],[x1,y0],[x1,y1],[x0,y1]], x1-x0, y1-y0)
    const outFile = path.join(outDir, prod.file)
    fs.writeFileSync(outFile, cropped.asPNG())
    slugToFile[prod.slug] = `/products/${prod.file}`
    console.log(`  [${imgIdx+1}] ${prod.file}`)
    imgIdx++
  }
}

console.log('\nUpdating database...')
for (const [sl, imgPath] of Object.entries(slugToFile)) {
  try {
    await prisma.product.updateMany({ where: { slug: sl }, data: { images: [imgPath] } })
    updated++
  } catch (e) { console.error(`  SKIP ${sl}: ${e.message}`); skipped++ }
}
console.log(`\nDone — ${imgIdx} images, ${updated} DB updated, ${skipped} skipped`)
await prisma.$disconnect()
