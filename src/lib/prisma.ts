import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let prismaInstance: PrismaClient | null = null

try {
  if (process.env.DATABASE_URL) {
    prismaInstance = globalForPrisma.prisma ?? new PrismaClient()
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prismaInstance
    }
  }
} catch (error) {
  console.warn('Failed to initialize Prisma:', error)
}

export const prisma = prismaInstance

