import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

config()

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
})

async function main() {
  const products = await prisma.product.findMany({
    where: {
      images: {
        has: '1240_Hp_Officejet_8710_Printer.jpg'
      }
    }
  })

  if (products.length > 0) {
    for (const product of products) {
      await prisma.product.delete({
        where: { id: product.id }
      })
      console.log(`Deleted product with zero-byte image: ${product.name}`)
    }
  } else {
    console.log('No product found with zero-byte image')
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
