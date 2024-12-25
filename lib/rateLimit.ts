import { NextApiRequest, NextApiResponse } from 'next'
import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'

const applyMiddleware =
  (middleware: (req: NextApiRequest, res: NextApiResponse, next: (err?: any) => void) => void) =>
  (request: NextApiRequest, response: NextApiResponse) =>
    new Promise<void>((resolve, reject) => {
      middleware(request, response, (result: unknown) =>
        result instanceof Error ? reject(result) : resolve()
      )
    })

const getIP = (request: NextApiRequest): string =>
  request.headers['x-real-ip']?.toString() ||
  request.headers['x-forwarded-for']?.toString() ||
  request.connection.remoteAddress ||
  '0.0.0.0'

export const rateLimiter = rateLimit({
  keyGenerator: getIP,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
})

export const speedLimiter = slowDown({
  keyGenerator: getIP,
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per 15 minutes, then...
  delayMs: 500, // begin adding 500ms of delay per request above 50
})

export default async function applyRateLimit(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  await applyMiddleware(rateLimiter)(request, response)
  await applyMiddleware(speedLimiter)(request, response)
}


