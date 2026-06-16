import { NextRequest, NextResponse } from 'next/server'
import { queryTransactionStatus } from '@/lib/mpesa'

export async function POST(request: NextRequest) {
  try {
    const { checkoutRequestID } = await request.json()

    if (!checkoutRequestID) {
      return NextResponse.json({ error: 'Missing checkoutRequestID' }, { status: 400 })
    }

    const result = await queryTransactionStatus(checkoutRequestID)

    return NextResponse.json(result)
  } catch (error) {
    console.error('STK Query error:', error)
    return NextResponse.json({ error: 'Failed to query payment status' }, { status: 500 })
  }
}
