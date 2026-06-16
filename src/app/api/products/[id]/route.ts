import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

// GET /api/products/[id] - Get a single product by id or slug (excluding DRAFT)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    if (!prisma) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const key = id
    const isObjectId = /^[a-f\d]{24}$/i.test(key)

    const product = await prisma.product.findFirst({
      where: isObjectId
        ? { status: { not: 'DRAFT' }, id: key }
        : { status: { not: 'DRAFT' }, slug: key },
      include: { category: { select: { name: true, slug: true } } },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
