import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
config()

const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } })
const prods = await prisma.product.findMany({ take: 10, select: { name: true, slug: true, images: true } })
console.log(JSON.stringify(prods, null, 2))
await prisma.$disconnect()
