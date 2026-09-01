import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/deals - List all deals
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const active = searchParams.get('active')
    const type = searchParams.get('type')

    const where: any = {}

    if (active === 'true') {
      where.isActive = true
      const now = new Date()
      where.startDate = { lte: now }
      where.endDate = { gte: now }
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

// POST /api/admin/deals - Create a new deal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.discountType || !body.discountValue || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: title, discountType, discountValue, startDate, endDate' },
        { status: 400 }
      )
    }

    // Validate discount type
    if (!['PERCENTAGE', 'FIXED'].includes(body.discountType)) {
      return NextResponse.json(
        { error: 'Invalid discount type. Must be PERCENTAGE or FIXED' },
        { status: 400 }
      )
    }

    // Validate deal type
    if (body.type && !['MONTHLY', 'FLASH_SALE', 'SEASONAL', 'BUNDLE', 'CLEARANCE'].includes(body.type)) {
      return NextResponse.json(
        { error: 'Invalid deal type' },
        { status: 400 }
      )
    }

    const discountValue = parseFloat(body.discountValue)
    if (isNaN(discountValue) || discountValue <= 0) {
      return NextResponse.json(
        { error: 'Discount value must be a positive number' },
        { status: 400 }
      )
    }

    if (body.discountType === 'PERCENTAGE' && discountValue > 100) {
      return NextResponse.json(
        { error: 'Percentage discount cannot exceed 100%' },
        { status: 400 }
      )
    }

    const startDate = new Date(body.startDate)
    const endDate = new Date(body.endDate)

    if (startDate >= endDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    const deal = await prisma?.deal.create({
      data: {
        title: body.title,
        description: body.description || null,
        type: body.type || 'MONTHLY',
        discountType: body.discountType,
        discountValue,
        startDate,
        endDate,
        isActive: body.isActive !== undefined ? body.isActive : true,
        productIds: body.productIds || [],
        categoryIds: body.categoryIds || [],
        minPurchase: body.minPurchase ? parseFloat(body.minPurchase) : null,
        maxUses: body.maxUses ? parseInt(body.maxUses) : null,
        imageUrl: body.imageUrl || null,
        bannerText: body.bannerText || null,
      },
    })

    return NextResponse.json(deal, { status: 201 })
  } catch (error: any) {
    console.error('Error creating deal:', error)
    return NextResponse.json(
      { error: 'Failed to create deal' },
      { status: 500 }
    )
  }
}
