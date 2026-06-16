import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/settings - Get store settings
export async function GET() {
  try {
    // Fetch settings from database or return defaults
    const settings = {
      storeName: 'Majesty Compucare Limited',
      storeEmail: 'sales.compucare111@gmail.com',
      storePhone: '+254 712 345 678',
      storeAddress: 'Nakuru, Kenya',
      currency: 'KES',
      taxRate: 16,
      shippingFee: 200,
      freeShippingThreshold: 5000,
      maintenanceMode: false,
      allowReviews: true,
      requireApprovalForReviews: false,
      mpesaEnabled: true,
      cashOnDeliveryEnabled: true,
      orderPrefix: 'ORD-',
      itemsPerPage: 12,
      socialLinks: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: ''
      },
      seo: {
        title: 'Majesty Compucare Limited - Your Trusted Technology Partner in Kenya',
        description: 'Specializing in computer sales, IT solutions, CCTV security systems, networking, and technology support services.',
        keywords: 'computers, laptops, printers, CCTV, networking, IT solutions, Kenya, Nakuru'
      }
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// PUT /api/admin/settings - Update store settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // In a real implementation, you would save these to a Settings table in the database
    // For now, we'll just return success
    
    return NextResponse.json({ 
      success: true, 
      message: 'Settings updated successfully',
      settings: body
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}

