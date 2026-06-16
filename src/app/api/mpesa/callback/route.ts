import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // M-Pesa callback structure
    const {
      Body: {
        stkCallback: {
          MerchantRequestID,
          CheckoutRequestID,
          ResultCode,
          ResultDesc,
          CallbackMetadata: {
            Item: metadata
          }
        }
      }
    } = body

    // Extract payment details from metadata
    const amount = metadata.find((item: any) => item.Name === 'Amount')?.Value
    const mpesaReceipt = metadata.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value
    const transactionDate = metadata.find((item: any) => item.Name === 'TransactionDate')?.Value
    const phoneNumber = metadata.find((item: any) => item.Name === 'PhoneNumber')?.Value

    // Find the order by MerchantRequestID (we'd need to store this when creating the order)
    // For now, we'll log the payment details
    console.log('M-Pesa Callback:', {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      amount,
      mpesaReceipt,
      transactionDate,
      phoneNumber,
    })

    // Update order status based on ResultCode
    // 0 = success, any other code = failure
    if (ResultCode === '0') {
      // Payment successful - update order status
      // In a real implementation, you would:
      // 1. Find the order by MerchantRequestID
      // 2. Update payment status to COMPLETED
      // 3. Save payment details (receipt number, transaction date)
      // 4. Send confirmation email to customer
      
      console.log('Payment successful:', {
        amount,
        mpesaReceipt,
        transactionDate,
        phoneNumber,
      })
    } else {
      // Payment failed
      console.log('Payment failed:', ResultDesc)
    }

    // Always return 200 to M-Pesa to acknowledge receipt
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: 'Success',
    })
  } catch (error) {
    console.error('M-Pesa callback error:', error)
    // Still return 200 to avoid M-Pesa retrying
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: 'Success',
    })
  }
}
