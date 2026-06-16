import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { config } from 'dotenv'
config()

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
})

async function main() {
  console.log('Connecting to:', process.env.DATABASE_URL?.substring(0, 60))

  const user = await prisma.user.findUnique({
    where: { email: 'admin@majestycompucare.co.ke' }
  })

  if (!user) {
    console.log('❌ User NOT found in database — creating now...')
    const hashed = await bcrypt.hash('Admin@2024', 10)
    await prisma.user.create({
      data: { name: 'Admin', email: 'admin@majestycompucare.co.ke', password: hashed, role: 'ADMIN' }
    })
    console.log('✅ Admin created successfully')
  } else {
    console.log('✅ User found')
    console.log('   Role:', user.role)
    console.log('   Has password:', !!user.password)

    // Verify password matches
    const match = await bcrypt.compare('Admin@2024', user.password || '')
    console.log('   Password "Admin@2024" matches:', match)

    if (!match || user.role !== 'ADMIN') {
      console.log('🔧 Fixing user...')
      const hashed = await bcrypt.hash('Admin@2024', 10)
      await prisma.user.update({
        where: { email: 'admin@majestycompucare.co.ke' },
        data: { password: hashed, role: 'ADMIN' }
      })
      console.log('✅ Fixed — password reset and role set to ADMIN')
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
