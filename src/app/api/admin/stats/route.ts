import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      prisma?.product.count(),
      prisma?.order.count(),
      prisma?.user.count({ where: { role: 'CUSTOMER' } }),
      prisma?.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { in: ['DELIVERED', 'CONFIRMED', 'PROCESSING'] } },
      }),
      prisma?.product.count({ where: { stock: { lt: 5 } } }),
      prisma?.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      }),
    ])

    return NextResponse.json({
      totalProducts: totalProducts || 0,
      totalOrders: totalOrders || 0,
      totalCustomers: totalCustomers || 0,
      totalRevenue: totalRevenue?._sum.totalAmount || 0,
      lowStockProducts: lowStockProducts || 0,
      recentOrders: recentOrders || [],
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}

