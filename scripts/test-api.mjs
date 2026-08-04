import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

config()

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
})

async function main() {
  // Test the same query as the API
  const products = await prisma.product.findMany({
    where: { status: 'ACTIVE' },
    include: { category: { select: { name: true, slug: true } } },
    orderBy: { createdAt: 'desc' },
    take: 12,
  })
  
  console.log(`Found ${products.length} products`)
  console.log('\nFirst product:')
  if (products[0]) {
    console.log(JSON.stringify(products[0], null, 2))
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
