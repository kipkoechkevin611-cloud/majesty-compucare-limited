import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
config()

const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } })
const prods = await prisma.product.findMany({ select: { slug: true, images: true } })
const old = prods.filter(p => p.images[0]?.startsWith('/products/'))
console.log('Products still with old paths:', old.length)
old.forEach(p => console.log(p.slug, '→', p.images[0]))
await prisma.$disconnect()
