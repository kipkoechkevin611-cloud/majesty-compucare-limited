import axios from 'axios'

const MPESA_BASE_URL = process.env.MPESA_ENV === 'production' 
  ? 'https://api.safaricom.co.ke' 
  : 'https://sandbox.safaricom.co.ke'

export interface MpesaSTKPushResponse {
  MerchantRequestID: string
  CheckoutRequestID: string
  ResponseCode: string
  ResponseDescription: string
  CustomerMessage: string
}

export interface MpesaPaymentRequest {
  phone: string
  amount: number
  orderNumber: string
}

export async function generateMpesaToken() {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64')

  try {
    const response = await axios.get(
      `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    )
    return response.data.access_token
  } catch (error) {
    console.error('Error generating M-Pesa token:', error)
    throw new Error('Failed to generate M-Pesa token')
  }
}

export async function initiateSTKPush(
  phone: string,
  amount: number,
  orderNumber: string
): Promise<MpesaSTKPushResponse> {
  try {
    const token = await generateMpesaToken()
    const timestamp = new Date().toISOString().replace(/\D/g, '').slice(0, 14)
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64')

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phone.replace(/^0/, '254'),
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phone.replace(/^0/, '254'),
        CallBackURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/mpesa/callback`,
        AccountReference: orderNumber,
        TransactionDesc: `Payment for order ${orderNumber}`,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return response.data
  } catch (error) {
    console.error('Error initiating STK Push:', error)
    throw new Error('Failed to initiate M-Pesa payment')
  }
}

export async function queryTransactionStatus(checkoutRequestID: string) {
  try {
    const token = await generateMpesaToken()
    const timestamp = new Date().toISOString().replace(/\D/g, '').slice(0, 14)
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64')

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`,
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return response.data
  } catch (error) {
    console.error('Error querying transaction status:', error)
    throw new Error('Failed to query transaction status')
  }
}
