import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'

const IZIPAY_ENDPOINT = process.env.IZIPAY_ENDPOINT
const IZIPAY_PUBLIC_KEY = process.env.IZIPAY_PUBLIC_KEY
const IZIPAY_PRIVATE_KEY = process.env.IZIPAY_PRIVATE_KEY

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const { amount } = req.body

    const formData = new URLSearchParams()
    formData.append('amount', amount.toString())
    formData.append('currency', 'PEN')
    formData.append('orderId', `ORDER-${Date.now()}`)

    const timestamp = Math.floor(Date.now() / 1000)
    const toSign = `${timestamp}${IZIPAY_PUBLIC_KEY}${formData.toString()}`
    const signature = crypto.createHmac('sha256', IZIPAY_PRIVATE_KEY!).update(toSign).digest('hex')

    const response = await fetch(`${IZIPAY_ENDPOINT}/api-payment/V4/Charge/CreatePayment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `${IZIPAY_PUBLIC_KEY}:${signature}:${timestamp}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to create Izipay form token')
    }

    const data = await response.json()
    res.status(200).json({ formToken: data.answer.formToken })
  } catch (error) {
    console.error('Error creating Izipay form token:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

