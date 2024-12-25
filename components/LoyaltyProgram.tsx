'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
/* import { useToast } from "@/components/ui/use-toast" */

export default function LoyaltyProgram() {
  const t = useTranslations('LoyaltyProgram')
  const { data: session, update } = useSession()
  const [isRedeeming, setIsRedeeming] = useState(false)
  const { toast } = useToast()

  const redeemPoints = async () => {
    setIsRedeeming(true)
    try {
      const response = await fetch('/api/loyalty/redeem', { method: 'POST' })
      if (!response.ok) throw new Error('Failed to redeem points')
      const data = await response.json()
      update({ user: { ...session?.user, loyaltyPoints: data.newPoints } })
      toast({
        title: t('success'),
        description: t('pointsRedeemed', { points: data.redeemedPoints }),
      })
    } catch (error) {
      console.error('Error redeeming points:', error)
      toast({
        title: t('error'),
        description: t('redeemError'),
        variant: "destructive",
      })
    } finally {
      setIsRedeeming(false)
    }
  }

  if (!session) return null

  return (
    <div className="mt-4 p-4 border rounded">
      <h2 className="text-xl font-bold mb-2">{t('loyaltyProgram')}</h2>
      <p>{t('currentPoints', { points: session.user.loyaltyPoints })}</p>
      <Button 
        onClick={redeemPoints} 
        disabled={isRedeeming || (session.user.loyaltyPoints ?? 0) < 100}
        className="mt-2"
      >
        {isRedeeming ? t('redeeming') : t('redeemPoints')}
      </Button>
    </div>
  )
}

