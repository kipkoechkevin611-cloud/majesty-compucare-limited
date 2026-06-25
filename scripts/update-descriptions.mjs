/**
 * Add meaningful per-product descriptions.
 * Does not touch price, stock, category, images or other fields.
 */
import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
config()

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
})

// Per-product descriptions keyed by slug
const DESCRIPTIONS = {
  // ── Apple MacBooks ──────────────────────────────────────────────
  'apple-macbook-pro-15-2019-i7': '15-inch MacBook Pro (2019) with Intel Core i7. Designed for creative professionals, developers, and power users. Features a brilliant Retina display, premium aluminum unibody, and macOS-ready performance. Available in excellent condition at Majesty Compucare, Nakuru.',
  'apple-macbook-pro-15-2018-i7': '15-inch MacBook Pro (2018) with Intel Core i7. A reliable workstation for video editing, design, and software development. Thin, light, and built with Apple’s signature quality. Contact us to check current stock.',
  'apple-macbook-air-2017-i5': 'MacBook Air (2017) with Intel Core i5. Ultra-portable and lightweight, perfect for students, writers, and everyday productivity. Great battery life and a crisp display.',
  'apple-macbook-air-2015-i7': 'MacBook Air (2015) with Intel Core i7. A solid, dependable ultrabook for browsing, office work, and media. Lightweight and budget-friendly within the Apple ecosystem.',
  'apple-macbook-air-2015-i5': 'MacBook Air (2015) with Intel Core i5. Ideal for everyday computing, schoolwork, and light professional use. Reliable performance in a slim, portable design.',
  'apple-macbook-pro-2012-i5': 'MacBook Pro (2012) with Intel Core i5. A classic MacBook Pro offering great value for basic macOS tasks, learning, and light creative work. Fully tested and ready to use.',

  // ── Dell Laptops ────────────────────────────────────────────────
  'dell-precision-7550': 'Dell Precision 7550 mobile workstation. Built for engineers, architects, and designers who need serious CPU and GPU power. Rugged, expandable, and ISV-certified.',
  'dell-xps-13-7390': 'Dell XPS 13 7390 ultrabook with near-borderless InfinityEdge display. Premium build, excellent portability, and strong performance for professionals and students.',
  'dell-xps-13-9350': 'Dell XPS 13 9350 ultrabook. Compact, lightweight, and stylish with a stunning display. Great for mobile productivity and everyday performance.',
  'dell-latitude-7400': 'Dell Latitude 7400 business laptop. Thin, light, and secure with enterprise-grade features. Built for professionals who travel.',
  'dell-latitude-7320': 'Dell Latitude 7320 business laptop. Modern design, fast performance, and excellent connectivity for office and remote work.',
  'dell-latitude-7310': 'Dell Latitude 7310 business laptop. Reliable, well-built, and ready for everyday business productivity.',
  'dell-latitude-7300': 'Dell Latitude 7300 business laptop. Compact 13-inch form factor with solid performance and good battery life for professionals.',
  'dell-latitude-7390': 'Dell Latitude 7390 business laptop. Versatile 13-inch convertible-capable design with strong security and manageability.',
  'dell-latitude-7290': 'Dell Latitude 7290 business laptop. Lightweight and durable for daily business use. Great value for office and school work.',
  'dell-latitude-5400': 'Dell Latitude 5400 business laptop. 14-inch workhorse with reliable performance, good connectivity, and a comfortable keyboard.',
  'dell-latitude-5300': 'Dell Latitude 5300 business laptop. Compact 13-inch business machine with strong build quality and modern features.',
  'dell-latitude-3410': 'Dell Latitude 3410 business laptop. Practical, affordable, and dependable for everyday office and educational tasks.',
  'dell-latitude-3120': 'Dell Latitude 3120 compact laptop. Ideal for education, basic office work, and light daily use. Durable and portable.',

  // ── HP ZBook Workstations ───────────────────────────────────────
  'hp-zbook-15-g8-i7': 'HP ZBook 15 G8 with Intel Core i7. Professional mobile workstation for CAD, 3D rendering, video editing, and engineering workloads. ISV-certified and built tough.',
  'hp-zbook-14-g8-i7-32gb': 'HP ZBook 14 G8 with Intel Core i7 and 32GB RAM. Compact workstation with plenty of memory for heavy multitasking, design, and development.',
  'hp-zbook-14-g8-i7-16gb': 'HP ZBook 14 G8 with Intel Core i7 and 16GB RAM. Portable workstation for professionals who need power on the move.',
  'hp-zbook-14-g7-i7-touch': 'HP ZBook 14 G7 with Intel Core i7 and touchscreen. Flexible creative workstation with precise touch input and pro-level performance.',
  'hp-zbook-14-g7-i7-non-touch': 'HP ZBook 14 G7 with Intel Core i7. Reliable mobile workstation for design, engineering, and content creation.',
  'hp-zbook-14-g6-i7-touch': 'HP ZBook 14 G6 with Intel Core i7 and touchscreen. Versatile workstation for creative professionals and field engineers.',

  // ── HP Elite Dragonfly ──────────────────────────────────────────
  'hp-elite-dragonfly-i7-11th-x360': 'HP Elite Dragonfly with Intel Core i7 11th Gen. Premium 2-in-1 convertible, ultra-light, and built for executives. Stunning design, long battery life, and 5G-ready options.',
  'hp-elite-dragonfly-i7-8th-x360': 'HP Elite Dragonfly with Intel Core i7 8th Gen. Lightweight, premium 2-in-1 laptop with excellent build quality and travel-friendly features.',
  'hp-elite-dragonfly-i5-8th-x360': 'HP Elite Dragonfly with Intel Core i5 8th Gen. Elegant convertible business laptop with great portability and solid performance.',

  // ── HP EliteBook 1040 series ───────────────────────────────────
  'hp-elitebook-1040-g10-i7': 'HP EliteBook 1040 G10 with Intel Core i7. Premium 14-inch business laptop with advanced security, sleek design, and modern performance.',
  'hp-elitebook-1040-g8-i7-x360': 'HP EliteBook 1040 G8 X360 with Intel Core i7. Convertible business laptop with touchscreen, privacy features, and pro performance.',
  'hp-elitebook-1040-g8-i5-x360': 'HP EliteBook 1040 G8 X360 with Intel Core i5. Flexible 2-in-1 business laptop with strong security and great build quality.',
  'hp-elitebook-1040-g7-i7-x360': 'HP EliteBook 1040 G7 X360 with Intel Core i7. Premium convertible built for business leaders and mobile professionals.',
  'hp-elitebook-1040-g6-i7-x360': 'HP EliteBook 1040 G6 X360 with Intel Core i7. Versatile 2-in-1 with enterprise security and a sleek aluminum chassis.',
  'hp-elitebook-1040-g5-i5-x360': 'HP EliteBook 1040 G5 X360 with Intel Core i5. Convertible business laptop with touchscreen and robust security features.',

  // ── HP EliteBook 1030 series ───────────────────────────────────
  'hp-elitebook-1030-g8-i7-x360': 'HP EliteBook 1030 G8 X360 with Intel Core i7. Ultra-slim 13-inch convertible with premium design, privacy camera, and strong performance.',
  'hp-elitebook-1030-g8-i5-x360': 'HP EliteBook 1030 G8 X360 with Intel Core i5. Lightweight, secure, and ready for business travel and remote work.',
  'hp-elitebook-1030-g7-i7-x360': 'HP EliteBook 1030 G7 X360 with Intel Core i7. Elegant convertible with robust security and all-day battery life.',
  'hp-elitebook-1030-g7-i5-x360': 'HP EliteBook 1030 G7 X360 with Intel Core i5. Premium 13-inch business 2-in-1 with excellent portability.',
  'hp-elitebook-1030-g4-i5-x360': 'HP EliteBook 1030 G4 X360 with Intel Core i5. Compact convertible with solid build quality for business users.',
  'hp-elitebook-1030-g3-i7-x360': 'HP EliteBook 1030 G3 X360 with Intel Core i7. Versatile 13-inch business laptop with touch and enterprise security.',
  'hp-elitebook-1030-g3-i5-x360': 'HP EliteBook 1030 G3 X360 with Intel Core i5. Reliable convertible for business professionals and students.',
  'hp-elitebook-1030-g2-i5-x360': 'HP EliteBook 1030 G2 X360 with Intel Core i5. Lightweight 2-in-1 business laptop with good battery and performance.',

  // ── HP Elite x2 ────────────────────────────────────────────────
  'hp-elite-x2-1012-i5-touch': 'HP Elite x2 1012 with Intel Core i5. Detachable business tablet-laptop hybrid with touchscreen and keyboard. Great for mobile presentations and field work.',
  'hp-elite-x2-1012-i5-non-touch': 'HP Elite x2 1012 with Intel Core i5. Versatile detachable business device with keyboard attachment. Portable and practical for professionals.',

  // ── HP EliteBook 850 series ────────────────────────────────────
  'hp-elitebook-850-g7-i7-touch': 'HP EliteBook 850 G7 with Intel Core i7 and touchscreen. 15-inch business laptop with large display, strong performance, and touch input.',
  'hp-elitebook-850-g7-i7-non-touch': 'HP EliteBook 850 G7 with Intel Core i7. 15-inch business laptop with robust performance and a comfortable full-size keyboard.',
  'hp-elitebook-850-g6-i7-touch': 'HP EliteBook 850 G6 with Intel Core i7 and touchscreen. Reliable 15-inch business laptop with touch and enterprise security.',
  'hp-elitebook-850-g3-i5': 'HP EliteBook 850 G3 with Intel Core i5. 15-inch business laptop offering great value, solid performance, and a large screen.',

  // ── HP EliteBook 845/745 (AMD) ───────────────────────────────
  'hp-elitebook-845-g7-ryzen-3': 'HP EliteBook 845 G7 with AMD Ryzen 3. 14-inch AMD-powered business laptop with modern security and good everyday performance.',
  'hp-elitebook-745-g6-ryzen-7': 'HP EliteBook 745 G6 with AMD Ryzen 7. 14-inch AMD business laptop with strong multi-core performance and enterprise features.',
  'hp-elitebook-745-g6-ryzen-5': 'HP EliteBook 745 G6 with AMD Ryzen 5. Balanced 14-inch AMD business laptop for productivity and multitasking.',

  // ── HP EliteBook 840 series ───────────────────────────────────
  'hp-elitebook-840-g8': 'HP EliteBook 840 G8. 14-inch business laptop with modern Intel performance, security, and a sleek design.',
  'hp-elitebook-840-g7': 'HP EliteBook 840 G7. 14-inch business laptop known for durability, performance, and enterprise manageability.',
  'hp-elitebook-840-g6': 'HP EliteBook 840 G6. 14-inch business laptop with excellent keyboard, strong build, and reliable performance.',
  'hp-elitebook-840-g5': 'HP EliteBook 840 G5. 14-inch business laptop with great value, security, and professional design.',
  'hp-elitebook-840-g4': 'HP EliteBook 840 G4. 14-inch business laptop for everyday office work, reliable and cost-effective.',
  'hp-elitebook-840-g3': 'HP EliteBook 840 G3. 14-inch business laptop offering dependable performance for office and education.',
  'hp-elitebook-840-g2': 'HP EliteBook 840 G2. 14-inch business laptop, solid build quality and practical performance for daily tasks.',
  'hp-elitebook-840-g1': 'HP EliteBook 840 G1. 14-inch business laptop, budget-friendly option for office work and browsing.',

  // ── HP EliteBook 830 series ───────────────────────────────────
  'hp-elitebook-830-g8': 'HP EliteBook 830 G8. 13-inch business laptop with compact design, modern performance, and strong security.',
  'hp-elitebook-830-g7': 'HP EliteBook 830 G7. 13-inch business laptop, lightweight and portable with enterprise features.',
  'hp-elitebook-830-g6': 'HP EliteBook 830 G6. 13-inch business laptop with great portability and reliable performance for professionals.',
  'hp-elitebook-830-g5': 'HP EliteBook 830 G5. 13-inch business laptop, compact and practical for mobile work and travel.',

  // ── HP EliteBook 820 series ───────────────────────────────────
  'hp-elitebook-820-g4': 'HP EliteBook 820 G4. 12-inch compact business laptop, highly portable and durable for mobile professionals.',
  'hp-elitebook-820-g3': 'HP EliteBook 820 G3. 12-inch business laptop, lightweight and reliable for travel and field work.',
  'hp-elitebook-820-g2': 'HP EliteBook 820 G2. 12-inch business laptop, compact and affordable for basic productivity.',
  'hp-elitebook-820-g1': 'HP EliteBook 820 G1. 12-inch business laptop, ultra-portable and budget-friendly for everyday tasks.',

  // ── HP ProBook series ─────────────────────────────────────────
  'hp-probook-640-g5': 'HP ProBook 640 G5. 14-inch business laptop with solid performance, security, and value for SMBs and schools.',
  'hp-probook-640-g4': 'HP ProBook 640 G4. 14-inch business laptop with reliable performance and durable design for everyday work.',
  'hp-probook-640-g2': 'HP ProBook 640 G2. 14-inch business laptop, cost-effective and dependable for office and educational use.',
  'hp-probook-11-g6': 'HP ProBook 11 G6. Education-focused laptop with rugged design, long battery, and student-friendly features.',
  'hp-probook-11-g4': 'HP ProBook 11 G4. Durable education laptop for students, browsing, and classroom productivity.',
  'hp-probook-11-g2': 'HP ProBook 11 G2. Budget-friendly education laptop for basic schoolwork and learning.',
  'hp-probook-11-g1': 'HP ProBook 11 G1. Entry-level education laptop, practical and durable for young learners.',
  'hp-elitebook-8470p': 'HP EliteBook 8470p. Classic 14-inch business laptop, robust and reliable for office tasks and basic computing.',

  // ── Lenovo ThinkPads ─────────────────────────────────────────
  'lenovo-thinkpad-x1-carbon': 'Lenovo ThinkPad X1 Carbon. Ultralight premium business ultrabook with carbon-fiber chassis, brilliant display, and top-tier keyboard.',
  'lenovo-thinkpad-x1-yoga': 'Lenovo ThinkPad X1 Yoga. Premium 2-in-1 convertible business laptop with touchscreen and legendary ThinkPad reliability.',
  'lenovo-thinkpad-p14s': 'Lenovo ThinkPad P14s. Mobile workstation with professional graphics and ISV certification for engineers and designers.',
  'lenovo-thinkpad-t495s': 'Lenovo ThinkPad T495s. Slim AMD-powered business laptop with great performance, security, and portability.',
  'lenovo-thinkpad-t490s': 'Lenovo ThinkPad T490s. Thin and light Intel business laptop with excellent build quality and battery life.',
  'lenovo-thinkpad-t480s': 'Lenovo ThinkPad T480s. Reliable slim business laptop with strong performance and professional design.',
  'lenovo-thinkpad-t470s': 'Lenovo ThinkPad T470s. Lightweight business laptop with great keyboard and dependable performance.',
  'lenovo-thinkpad-t460s': 'Lenovo ThinkPad T460s. Slim business laptop offering great value for office work and productivity.',
  'lenovo-thinkpad-x13': 'Lenovo ThinkPad X13. Compact 13-inch business laptop with modern performance, security, and portability.',
  'lenovo-thinkpad-x390': 'Lenovo ThinkPad X390. 13-inch business laptop with solid build, good battery life, and travel-ready design.',
  'lenovo-thinkpad-x280': 'Lenovo ThinkPad X280. 12-inch business laptop, compact and durable for mobile professionals.',
  'lenovo-thinkpad-x270': 'Lenovo ThinkPad X270. 12-inch business laptop, lightweight and reliable with great battery life.',
  'lenovo-thinkpad-x260': 'Lenovo ThinkPad X260. 12-inch business laptop, practical and portable for everyday work.',
  'lenovo-thinkpad-x250': 'Lenovo ThinkPad X250. 12-inch business laptop, budget-friendly and durable for basic tasks.',
  'lenovo-thinkpad-x240': 'Lenovo ThinkPad X240. 12-inch business laptop, compact and affordable for office and education.',
  'lenovo-thinkpad-yoga-x13': 'Lenovo ThinkPad Yoga X13. 13-inch 2-in-1 convertible business laptop with touchscreen and pen support.',
  'lenovo-thinkpad-yoga-x390': 'Lenovo ThinkPad Yoga X390. 13-inch convertible business laptop with flexible hinge and strong build.',
  'lenovo-thinkpad-yoga-11e': 'Lenovo ThinkPad Yoga 11e. Rugged convertible education laptop with touchscreen and durable design for students.',
}

async function main() {
  let updated = 0, skipped = 0

  for (const [slug, description] of Object.entries(DESCRIPTIONS)) {
    try {
      const count = await prisma.product.count({ where: { slug } })
      if (count === 0) {
        console.log(`  SKIP (not found): ${slug}`)
        skipped++
        continue
      }
      await prisma.product.updateMany({
        where: { slug },
        data: { description }
      })
      updated++
      console.log(`  ✓ ${slug}`)
    } catch (e) {
      console.error(`  ERROR ${slug}: ${e.message}`)
      skipped++
    }
  }

  // Report any products in DB that did not get a new description
  const allProducts = await prisma.product.findMany({ select: { slug: true, name: true } })
  const missing = allProducts.filter(p => !DESCRIPTIONS[p.slug])

  console.log(`\nDone — updated: ${updated}, skipped: ${skipped}`)
  if (missing.length) {
    console.log(`\nMissing descriptions for ${missing.length} products:`)
    missing.forEach(p => console.log(`  - ${p.slug}`))
  } else {
    console.log('\nAll products have descriptions.')
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
