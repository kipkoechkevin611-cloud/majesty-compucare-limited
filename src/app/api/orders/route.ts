import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma?.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ orders: [] })

    const orders = await prisma?.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: { product: { select: { name: true, images: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ orders: orders || [] })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()

    let userId: string | null = null

    if (session?.user?.email) {
      const user = await prisma?.user.findUnique({ where: { email: session.user.email } })
      userId = user?.id || null
    }

    if (!userId && body.email) {
      const user = await prisma?.user.findUnique({ where: { email: body.email } })
      userId = user?.id || null
    }

    if (!userId) {
      return NextResponse.json({ error: 'User not found. Please register or login.' }, { status: 400 })
    }

    const { items, shippingAddress, paymentMethod, totalAmount } = body

    if (!items?.length || !shippingAddress || !paymentMethod || !totalAmount) {
      return NextResponse.json({ error: 'Missing required order fields' }, { status: 400 })
    }

    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`

    const order = await prisma?.order.create({
      data: {
        orderNumber,
        userId,
        totalAmount,
        paymentMethod,
        shippingAddress,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId || item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
