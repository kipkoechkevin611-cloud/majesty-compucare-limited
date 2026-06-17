import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function formatMonth(date: Date) {
  return date.toLocaleString('en-US', { month: 'short' })
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '90')
    const now = new Date()
    const since = new Date(now)
    since.setDate(since.getDate() - days)

    // Fetch orders within the range
    const orders = await prisma?.order.findMany({
      where: { createdAt: { gte: since } },
      include: {
        items: {
          include: {
            product: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    const safeOrders = orders || []

    // Totals
    const totalOrders = safeOrders.length
    const totalRevenue = safeOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0

    // Monthly buckets (use last 6 distinct months within range)
    const monthsBack = 6
    const monthKeys: string[] = []
    const monthLabels: string[] = []
    const monthMap = new Map<string, { sales: number; orders: number }>()
    const tmp = new Date(now)
    for (let i = monthsBack - 1; i >= 0; i--) {
      const d = new Date(tmp.getFullYear(), tmp.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`
      monthKeys.push(key)
      monthLabels.push(formatMonth(d))
      monthMap.set(key, { sales: 0, orders: 0 })
    }

    for (const o of safeOrders) {
      const d = new Date(o.createdAt)
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`
      if (!monthMap.has(key)) continue
      const entry = monthMap.get(key)!
      entry.sales += o.totalAmount || 0
      entry.orders += 1
    }

    const salesData = monthKeys.map((k, i) => ({
      month: monthLabels[i],
      sales: monthMap.get(k)?.sales || 0,
      orders: monthMap.get(k)?.orders || 0,
    }))

    // Top products by revenue
    const productAgg = new Map<string, { name: string; sales: number; revenue: number }>()
    for (const o of safeOrders) {
      for (const it of o.items) {
        const name = it.product?.name || 'Unknown Product'
        const revenue = (it.price || 0) * (it.quantity || 0)
        const prev = productAgg.get(name) || { name, sales: 0, revenue: 0 }
        prev.sales += it.quantity || 0
        prev.revenue += revenue
        productAgg.set(name, prev)
      }
    }
    const topProducts = Array.from(productAgg.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Orders by status
    const byStatus: Record<string, number> = {}
    for (const o of safeOrders) {
      byStatus[o.status] = (byStatus[o.status] || 0) + 1
    }

    // Recent activity (orders only for now)
    const recentActivity = safeOrders.slice(-5).reverse().map(o => ({
      type: 'order',
      message: `Order ${o.orderNumber} ${o.status?.toLowerCase() || 'updated'}`,
      time: new Date(o.createdAt).toISOString(),
    }))

    return NextResponse.json({
      summary: {
        totalRevenue,
        totalOrders,
        avgOrderValue,
      },
      salesData,
      topProducts,
      byStatus,
      recentActivity,
    })
  } catch (error) {
    console.error('Error building analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}

