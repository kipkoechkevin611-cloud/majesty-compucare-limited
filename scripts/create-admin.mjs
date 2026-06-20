import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { config } from 'dotenv'
config()

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
})

async function main() {
  const email = 'sales.compucare111@gmail.com'
  const password = 'Compucare@2026'
  const hashedPassword = await bcrypt.hash(password, 10)

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    await prisma.user.update({ where: { email }, data: { role: 'ADMIN', password: hashedPassword } })
    console.log('Admin user updated:', email)
  } else {
    await prisma.user.create({
      data: { name: 'Admin', email, password: hashedPassword, role: 'ADMIN' }
    })
    console.log('Admin user created:', email)
  }

  // Seed categories
  const categories = [
    { name: 'Laptops & Desktops', slug: 'laptops', description: 'Laptops, desktop computers, and notebooks' },
    { name: 'Printers', slug: 'printers', description: 'Epson, Canon, HP printers and scanners' },
    { name: 'CCTV & Security', slug: 'cctv-systems', description: 'CCTV cameras and security surveillance systems' },
    { name: 'Monitors & Accessories', slug: 'accessories', description: 'Monitors, keyboards, mice, and computer accessories' },
    { name: 'Networking', slug: 'networking', description: 'Routers, switches, and networking equipment' },
    { name: 'Phone Accessories', slug: 'phone-accessories', description: 'Chargers, headsets, smartwatches, and phone accessories' },
    { name: 'Office Stationery', slug: 'stationery', description: 'Office stationery and supplies' },
    { name: 'Toners & Ink', slug: 'toners-ink', description: 'Toners and ink cartridges for printers' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('Categories seeded.')
  console.log('\n=== LOGIN CREDENTIALS ===')
  console.log('Email:   ', email)
  console.log('Password:', password)
  console.log('URL:      http://localhost:3000/login')
}

main().catch(console.error).finally(() => prisma.$disconnect())
