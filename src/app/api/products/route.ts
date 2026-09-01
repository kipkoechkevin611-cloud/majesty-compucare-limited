import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const featured = searchParams.get('featured') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const sort = searchParams.get('sort') || 'createdAt_desc'
    const skip = (page - 1) * limit

    const where: any = { status: 'ACTIVE' }
    if (featured) where.featured = true
    if (category) where.category = { slug: category }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [sortField, sortDir] = sort.split('_')
    const orderBy: any = { [sortField === 'price' ? 'price' : 'createdAt']: sortDir === 'asc' ? 'asc' : 'desc' }

    const [products, total] = await Promise.all([
      prisma?.product.findMany({
        where,
        include: { category: { select: { name: true, slug: true } } },
        orderBy,
        skip,
        take: limit,
      }),
      prisma?.product.count({ where }),
    ])

    const response = NextResponse.json({
      products: products || [],
      pagination: { total: total || 0, page, limit, totalPages: Math.ceil((total || 0) / limit) },
    })

    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    return response
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 })
  response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}
