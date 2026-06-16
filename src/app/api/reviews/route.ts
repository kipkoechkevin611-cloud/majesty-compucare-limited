import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/reviews?productId=xxx - Get reviews for a product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const skip = (page - 1) * limit

    const [reviews, total, avgRating] = await Promise.all([
      prisma?.review.findMany({
        where: { productId },
        include: {
          user: {
            select: { name: true, image: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma?.review.count({ where: { productId } }),
      prisma?.review.aggregate({
        where: { productId },
        _avg: { rating: true }
      })
    ])

    return NextResponse.json({
      reviews: reviews || [],
      pagination: {
        total: total || 0,
        pages: Math.ceil((total || 0) / limit),
        currentPage: page,
        limit
      },
      averageRating: avgRating?._avg?.rating || 0,
      totalReviews: total || 0
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

// POST /api/reviews - Create a new review (authenticated users only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized - Please sign in to leave a review' }, { status: 401 })
    }

    const user = await prisma?.user.findUnique({ where: { email: session.user.email } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { productId, rating, comment } = body

    if (!productId || !rating) {
      return NextResponse.json({ error: 'Product ID and rating are required' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    // Check if user already reviewed this product
    const existingReview = await prisma?.review.findFirst({
      where: { productId, userId: user.id }
    })

    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 })
    }

    // Check if user has purchased the product (optional - can be removed if not needed)
    const hasPurchased = await prisma?.order.findFirst({
      where: {
        userId: user.id,
        items: {
          some: { productId }
        },
        status: { in: ['DELIVERED', 'CONFIRMED'] }
      }
    })

    // Create the review
    const review = await prisma?.review.create({
      data: {
        productId,
        userId: user.id,
        rating,
        comment: comment || null
      },
      include: {
        user: {
          select: { name: true, image: true }
        }
      }
    })

    return NextResponse.json({
      review,
      message: 'Review submitted successfully',
      verified: !!hasPurchased
    })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}
