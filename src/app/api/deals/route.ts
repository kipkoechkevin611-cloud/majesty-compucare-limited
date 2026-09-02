import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/deals - Get active deals for public storefront
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')

    const now = new Date()

    const where: any = {
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now },
    }

    if (type) {
      where.type = type
    }

    const deals = await prisma?.deal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ deals })
  } catch (error) {
    console.error('Error fetching deals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    )
  }
}
