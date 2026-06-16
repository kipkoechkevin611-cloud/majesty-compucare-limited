import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/products - List all products
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (category) {
      where.categoryId = category
    }

    if (status) {
      where.status = status
    }

    const [products, total] = await Promise.all([
      prisma?.product.findMany({
        where,
        include: {
          category: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma?.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil((total || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/admin/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.description || !body.price || !body.categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, price, categoryId' },
        { status: 400 }
      )
    }

    // Validate field types and values
    if (typeof body.name !== 'string' || body.name.length < 3 || body.name.length > 200) {
      return NextResponse.json(
        { error: 'Name must be between 3 and 200 characters' },
        { status: 400 }
      )
    }

    if (typeof body.description !== 'string' || body.description.length < 10) {
      return NextResponse.json(
        { error: 'Description must be at least 10 characters' },
        { status: 400 }
      )
    }

    const price = parseFloat(body.price)
    if (isNaN(price) || price < 0) {
      return NextResponse.json(
        { error: 'Price must be a valid positive number' },
        { status: 400 }
      )
    }

    if (body.salePrice) {
      const salePrice = parseFloat(body.salePrice)
      if (isNaN(salePrice) || salePrice < 0) {
        return NextResponse.json(
          { error: 'Sale price must be a valid positive number' },
          { status: 400 }
        )
      }
    }

    if (body.stock !== undefined) {
      const stock = parseInt(body.stock)
      if (isNaN(stock) || stock < 0) {
        return NextResponse.json(
          { error: 'Stock must be a valid non-negative number' },
          { status: 400 }
        )
      }
    }

    if (!['ACTIVE', 'DRAFT', 'OUT_OF_STOCK'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be ACTIVE, DRAFT, or OUT_OF_STOCK' },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const product = await prisma?.product.create({
      data: {
        name: body.name,
        slug,
        description: body.description,
        shortDescription: body.shortDescription || null,
        categoryId: body.categoryId,
        brand: body.brand || null,
        price,
        salePrice: body.salePrice ? parseFloat(body.salePrice) : null,
        stock: body.stock ? parseInt(body.stock) : 0,
        sku: body.sku || null,
        images: body.images || [],
        featured: body.featured || false,
        status: body.status || 'ACTIVE',
        specifications: body.specifications || null,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product:', error)

    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Product with this slug or SKU already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
