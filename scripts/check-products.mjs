import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

config()

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
})

async function main() {
  const totalProducts = await prisma.product.count()
  const activeProducts = await prisma.product.count({ where: { status: 'ACTIVE' } })
  const categories = await prisma.category.count()
  
  const sampleProducts = await prisma.product.findMany({
    take: 5,
    include: { category: true }
  })
  
  console.log(`Total products in database: ${totalProducts}`)
  console.log(`Active products: ${activeProducts}`)
  console.log(`Categories: ${categories}`)
  console.log('\nSample products:')
  sampleProducts.forEach(p => {
    console.log(`- ${p.name} (${p.category?.name}) - KES ${p.price} - Status: ${p.status}`)
  })
}

main().catch(console.error).finally(() => prisma.$disconnect())
