'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
/* import { toast } from "@/components/ui/use-toast" */
import { useApi } from '@/hooks/useApi'

type Review = {
  _id: string
  user: {
    name: string
  }
  rating: number
  comment: string
  createdAt: string
}

export default function Reviews({ reservationId }: { reservationId: string }) {
  const t = useTranslations('Reviews')
  const { data: session } = useSession()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const { data: reviews, mutate } = useApi<Review[]>(`/api/reviews?reservationId=${reservationId}`)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reservationId, rating, comment }),
      })
      if (!response.ok) throw new Error('Failed to submit review')
      toast({
        title: t('reviewSubmitted'),
        description: t('reviewSubmittedDescription'),
      })
      setRating(5)
      setComment('')
      mutate()
    } catch (error) {
      console.error('Error submitting review:', error)
      toast({
        title: t('error'),
        description: t('reviewSubmissionError'),
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{t('reviews')}</h2>
      {reviews && reviews.map((review) => (
        <div key={review._id} className="mb-4 p-4 border rounded">
          <p className="font-bold">{review.user.name}</p>
          <p>{t('rating')}: {review.rating}/5</p>
          <p>{review.comment}</p>
          <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
      {session && (
        <form onSubmit={handleSubmit} className="mt-4">
          <h3 className="text-xl font-bold mb-2">{t('leaveReview')}</h3>
          <div className="mb-2">
            <label htmlFor="rating" className="block">{t('rating')}</label>
            <Input
              type="number"
              id="rating"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="comment" className="block">{t('comment')}</label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>
          <Button type="submit">{t('submitReview')}</Button>
        </form>
      )}
    </div>
  )
}

