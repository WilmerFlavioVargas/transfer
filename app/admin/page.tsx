'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
/* import { toast } from "@/components/ui/use-toast" */
import CityManager from '@/components/admin/CityManager'
import LocationManager from '@/components/admin/LocationManager'
import ProviderManager from '@/components/admin/ProviderManager'
import RouteManager from '@/components/admin/RouteManager'
import VehicleManager from '@/components/admin/VehicleManager'
import UserManager from '@/components/admin/UserManager'

export default function AdminPanel() {
  const t = useTranslations('AdminPanel')
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user.role !== 'admin') {
      router.push('/')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">{t('loading')}</div>
  }

  if (!session || session.user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8 text-center">{t('adminPanel')}</h1>
        <Tabs defaultValue="cities" className="space-y-4">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-4">
            <TabsTrigger value="cities">{t('cities')}</TabsTrigger>
            <TabsTrigger value="locations">{t('locations')}</TabsTrigger>
            <TabsTrigger value="providers">{t('providers')}</TabsTrigger>
            <TabsTrigger value="routes">{t('routes')}</TabsTrigger>
            <TabsTrigger value="vehicles">{t('vehicles')}</TabsTrigger>
            <TabsTrigger value="users">{t('users')}</TabsTrigger>
          </TabsList>
          <TabsContent value="cities">
            <Card>
              <CardHeader>
                <CardTitle>{t('cities')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CityManager />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="locations">
            <Card>
              <CardHeader>
                <CardTitle>{t('locations')}</CardTitle>
              </CardHeader>
              <CardContent>
                <LocationManager />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="providers">
            <Card>
              <CardHeader>
                <CardTitle>{t('providers')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ProviderManager />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="routes">
            <Card>
              <CardHeader>
                <CardTitle>{t('routes')}</CardTitle>
              </CardHeader>
              <CardContent>
                <RouteManager />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="vehicles">
            <Card>
              <CardHeader>
                <CardTitle>{t('vehicles')}</CardTitle>
              </CardHeader>
              <CardContent>
                <VehicleManager />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>{t('users')}</CardTitle>
              </CardHeader>
              <CardContent>
                <UserManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

