import { NextApiRequest, NextApiResponse } from 'next'
import redis from '../lib/redis'

const CACHE_DURATION = 60 * 5 // 5 minutos

export default function cache(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
      const key = `cache:${req.url}`
      const cachedData = await redis.get(key)

      if (cachedData) {
        res.setHeader('X-Cache', 'HIT')
        res.status(200).json(JSON.parse(cachedData))
        return
      }

      res.setHeader('X-Cache', 'MISS')
      const originalJson = res.json
      res.json = (body) => {
        redis.setex(key, CACHE_DURATION, JSON.stringify(body))
        return originalJson.call(res, body)
      }
    }

    await handler(req, res)
  }
}

