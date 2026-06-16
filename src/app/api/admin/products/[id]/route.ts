import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

// GET /api/admin/products/[id] - Get a single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!prisma) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
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

// PUT /api/admin/products/[id] - Update a product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

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

    // Generate slug from name if changed
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    if (!prisma) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const product = await prisma.product.update({
      where: { id },
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

    return NextResponse.json(product)
  } catch (error: any) {
    console.error('Error updating product:', error)

    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Product with this slug or SKU already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/products/[id] - Delete a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Some environments drop bodies on DELETE. Parse defensively and default to false.
    let softDelete = false
    try {
      const body = await request.json()
      softDelete = !!body?.softDelete
    } catch {}

    if (!prisma) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    if (softDelete) {
      // Soft delete - just change status to DRAFT
      const product = await prisma.product.update({
        where: { id },
        data: { status: 'DRAFT' },
      })
      return NextResponse.json(product)
    } else {
      // Hard delete
      try {
        await prisma.product.delete({
          where: { id },
        })
        return NextResponse.json({ success: true })
      } catch (e: any) {
        // Fall back to soft delete if relational constraints block hard delete
        const product = await prisma.product.update({
          where: { id },
          data: { status: 'DRAFT' },
        })
        return NextResponse.json({ success: true, softDeleted: true, product, hint: 'Hard delete failed due to references. Product was set to DRAFT instead.' })
      }
    }
  } catch (error: any) {
    console.error('Error deleting product:', error)

    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
