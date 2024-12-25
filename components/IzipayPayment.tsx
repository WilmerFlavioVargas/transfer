'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
/* import { toast } from "@/components/ui/use-toast" */
import { useTranslations } from 'next-intl'

interface IzipayPaymentProps {
  amount: number
  onPaymentSuccess: () => void
  onPaymentError: (error: string) => void
}

declare global {
  interface Window {
    KR: any
  }
}

export default function IzipayPayment({ amount, onPaymentSuccess, onPaymentError }: IzipayPaymentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formToken, setFormToken] = useState('')
  const t = useTranslations('IzipayPayment')

  useEffect(() => {
    const getFormToken = async () => {
      try {
        const response = await fetch('/api/izipay-form-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: amount * 100 }), // Izipay expects amount in cents
        })
        const data = await response.json()
        setFormToken(data.formToken)
      } catch (error) {
        console.error('Error fetching Izipay form token:', error)
        onPaymentError(t('tokenError'))
      }
    }

    getFormToken()
  }, [amount, onPaymentError, t])

  useEffect(() => {
    if (formToken && window.KR) {
      const form = window.KR.setFormConfig({
        formToken: formToken,
        "kr-language": "es-ES",
      }).attachForm("#izipay-form")

      form.onSubmit((paymentData: any) => {
        if (paymentData.clientAnswer.orderStatus === "PAID") {
          console.log('Pago con Izipay procesado exitosamente')
          toast({
            title: t('paymentSuccessTitle'),
            description: t('paymentSuccessDescription', { amount }),
          })
          onPaymentSuccess()
        } else {
          onPaymentError(t('paymentFailed'))
        }
      })
    }
  }, [formToken, amount, onPaymentSuccess, onPaymentError, t])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    window.KR.submit()
  }

  return (
    <form id="izipay-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="kr-embedded" kr-form-token={formToken}>
        {/* Izipay generará los campos del formulario aquí */}
      </div>
      <Button type="submit" disabled={isLoading || !formToken}>
        {isLoading ? t('processing') : t('pay', { amount })}
      </Button>
    </form>
  )
}

