import { NextRequest, NextResponse } from 'next/server'
import { initiateSTKPush } from '@/lib/mpesa'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, amount, orderNumber } = body

    // Validate input
    if (!phone || !amount || !orderNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate phone number format
    const phoneRegex = /^(0|254)?[7]\d{8}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    // Validate amount
    if (amount < 1) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }

    // Initiate STK Push
    const response = await initiateSTKPush(phone, amount, orderNumber)

    return NextResponse.json({
      success: true,
      data: response,
    })
  } catch (error) {
    console.error('STK Push error:', error)
    return NextResponse.json(
      { error: 'Failed to initiate payment' },
      { status: 500 }
    )
  }
}
