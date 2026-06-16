import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { config } from 'dotenv'
config()

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
})

async function main() {
  const email = 'admin@majestycompucare.co.ke'
  const password = 'Admin@2024'
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
    { name: 'Laptops', slug: 'laptops', description: 'Laptop computers and notebooks' },
    { name: 'Desktops', slug: 'desktops', description: 'Desktop computers and towers' },
    { name: 'Printers', slug: 'printers', description: 'Printers and scanners' },
    { name: 'CCTV Systems', slug: 'cctv-systems', description: 'Security cameras and surveillance systems' },
    { name: 'Networking', slug: 'networking', description: 'Network equipment and accessories' },
    { name: 'Accessories', slug: 'accessories', description: 'Computer accessories and peripherals' },
    { name: 'Software', slug: 'software', description: 'Software and licenses' },
    { name: 'Electronics', slug: 'electronics', description: 'Electronic devices and components' },
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
