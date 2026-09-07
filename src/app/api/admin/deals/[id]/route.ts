import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/deals/[id] - Get a specific deal
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const deal = await prisma?.deal.findUnique({
      where: { id },
    })

    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(deal)
  } catch (error) {
    console.error('Error fetching deal:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deal' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/deals/[id] - Update a deal
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate discount type if provided
    if (body.discountType && !['PERCENTAGE', 'FIXED'].includes(body.discountType)) {
      return NextResponse.json(
        { error: 'Invalid discount type. Must be PERCENTAGE or FIXED' },
        { status: 400 }
      )
    }

    // Validate deal type if provided
    if (body.type && !['MONTHLY', 'FLASH_SALE', 'SEASONAL', 'BUNDLE', 'CLEARANCE'].includes(body.type)) {
      return NextResponse.json(
        { error: 'Invalid deal type' },
        { status: 400 }
      )
    }

    const updateData: any = {}

    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.type !== undefined) updateData.type = body.type
    if (body.discountType !== undefined) updateData.discountType = body.discountType
    if (body.discountValue !== undefined) {
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
      updateData.discountValue = discountValue
    }
    if (body.startDate !== undefined) updateData.startDate = new Date(body.startDate)
    if (body.endDate !== undefined) updateData.endDate = new Date(body.endDate)
    if (body.isActive !== undefined) updateData.isActive = body.isActive
    if (body.productIds !== undefined) updateData.productIds = body.productIds
    if (body.categoryIds !== undefined) updateData.categoryIds = body.categoryIds
    if (body.minPurchase !== undefined) updateData.minPurchase = body.minPurchase ? parseFloat(body.minPurchase) : null
    if (body.maxUses !== undefined) updateData.maxUses = body.maxUses ? parseInt(body.maxUses) : null
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl
    if (body.bannerText !== undefined) updateData.bannerText = body.bannerText

    // Validate dates if both are provided
    if (updateData.startDate && updateData.endDate && updateData.startDate >= updateData.endDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    const deal = await prisma?.deal.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(deal)
  } catch (error: any) {
    console.error('Error updating deal:', error)
    return NextResponse.json(
      { error: 'Failed to update deal' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/deals/[id] - Delete a deal
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma?.deal.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting deal:', error)
    return NextResponse.json(
      { error: 'Failed to delete deal' },
      { status: 500 }
    )
  }
}
