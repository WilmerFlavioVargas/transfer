'use client'

import { useEffect } from 'react'
import { useWebSocket } from '../hooks/useWebSocket'
import { toast } from "@/hooks/use-toast"
/* import { toast } from "@/components/ui/use-toast" */

export default function RealTimeNotifications() {
  const { notifications } = useWebSocket('notifications')

  useEffect(() => {
    notifications.forEach(notification => {
      toast({
        title: "New Notification",
        description: notification,
      })
    })
  }, [notifications])

  return null
}

