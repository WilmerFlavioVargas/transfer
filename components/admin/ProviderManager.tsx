'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
/* import { toast } from "@/components/ui/use-toast" */

export default function ProviderManager() {
  const t = useTranslations('ProviderManager')
  const [providers, setProviders] = useState([])
  const [newProvider, setNewProvider] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
  })

  useEffect(() => {
    fetchProviders()
  }, [])

  const fetchProviders = async () => {
    try {
      const response = await fetch('/api/providers')
      if (!response.ok) throw new Error('Failed to fetch providers')
      const data = await response.json()
      setProviders(data)
    } catch (error) {
      console.error('Error fetching providers:', error)
      toast({
        title: "Error",
        description: "Failed to fetch providers. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProvider),
      })
      if (!response.ok) throw new Error('Failed to create provider')
      await fetchProviders()
      setNewProvider({
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
      })
      toast({
        title: "Success",
        description: "Provider created successfully.",
      })
    } catch (error) {
      console.error('Error creating provider:', error)
      toast({
        title: "Error",
        description: "Failed to create provider. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProvider = async (providerId: string) => {
    try {
      const response = await fetch(`/api/providers/${providerId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete provider')
      await fetchProviders()
      toast({
        title: "Success",
        description: "Provider deleted successfully.",
      })
    } catch (error) {
      console.error('Error deleting provider:', error)
      toast({
        title: "Error",
        description: "Failed to delete provider. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t('manageProviders')}</h2>
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <Input
          type="text"
          placeholder={t('providerName')}
          value={newProvider.name}
          onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })}
          required
        />
        <Input
          type="email"
          placeholder={t('email')}
          value={newProvider.email}
          onChange={(e) => setNewProvider({ ...newProvider, email: e.target.value })}
          required
        />
        <Input
          type="tel"
          placeholder={t('phoneNumber')}
          value={newProvider.phoneNumber}
          onChange={(e) => setNewProvider({ ...newProvider, phoneNumber: e.target.value })}
        />
        <Input
          type="text"
          placeholder={t('address')}
          value={newProvider.address}
          onChange={(e) => setNewProvider({ ...newProvider, address: e.target.value })}
        />
        <Button type="submit">{t('addProvider')}</Button>
      </form>
      <ul className="space-y-2">
        {providers.map((provider: any) => (
          <li key={provider._id} className="flex justify-between items-center">
            <span>{provider.name} - {provider.email}</span>
            <Button variant="destructive" onClick={() => handleDeleteProvider(provider._id)}>{t('delete')}</Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

