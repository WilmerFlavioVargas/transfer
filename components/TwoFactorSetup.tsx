'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
/* import { useToast } from "@/components/ui/use-toast" */
import Image from 'next/image'

export default function TwoFactorSetup() {
  const t = useTranslations('TwoFactorSetup')
  const { data: session, update } = useSession()
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [verificationCode, setVerificationCode] = useState('')
  const { toast } = useToast()

  const setupTwoFactor = async () => {
    try {
      const response = await fetch('/api/two-factor/setup', { method: 'POST' })
      if (!response.ok) throw new Error('Failed to setup two-factor authentication')
      const data = await response.json()
      setQrCode(data.qrCode)
    } catch (error) {
      console.error('Error setting up two-factor authentication:', error)
      toast({
        title: t('error'),
        description: t('setupError'),
        variant: "destructive",
      })
    }
  }

  const verifyTwoFactor = async () => {
    try {
      const response = await fetch('/api/two-factor/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verificationCode }),
      })
      if (!response.ok) throw new Error('Failed to verify two-factor authentication')
      toast({
        title: t('success'),
        description: t('verificationSuccess'),
      })
      update({ isTwoFactorEnabled: true })
    } catch (error) {
      console.error('Error verifying two-factor authentication:', error)
      toast({
        title: t('error'),
        description: t('verificationError'),
        variant: "destructive",
      })
    }
  }

  if (!session) return null

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{t('twoFactorSetup')}</h2>
      {!session.user.isTwoFactorEnabled ? (
        <>
          <Button onClick={setupTwoFactor}>{t('setupTwoFactor')}</Button>
          {qrCode && (
            <div className="mt-4">
              <p>{t('scanQrCode')}</p>
              <Image src={qrCode} alt="QR Code" width={200} height={200} />
              <Input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder={t('enterVerificationCode')}
                className="mt-2"
              />
              <Button onClick={verifyTwoFactor} className="mt-2">{t('verifyCode')}</Button>
            </div>
          )}
        </>
      ) : (
        <p>{t('twoFactorEnabled')}</p>
      )}
    </div>
  )
}

