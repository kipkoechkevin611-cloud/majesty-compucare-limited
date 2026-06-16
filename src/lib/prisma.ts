import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let prismaInstance: PrismaClient | null = null

if (process.env.DATABASE_URL) {
  try {
    prismaInstance = globalForPrisma.prisma ?? new PrismaClient()
    globalForPrisma.prisma = prismaInstance
  } catch (error) {
    console.error('Failed to initialize Prisma:', error)
  }
} else {
  console.warn('DATABASE_URL is not set — database features will be unavailable.')
}

export const prisma = prismaInstance

