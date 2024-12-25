import { useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'

export const useWebSocket = (room: string) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [notifications, setNotifications] = useState<string[]>([])

  useEffect(() => {
    const newSocket = io('http://localhost:3000', {
      path: '/api/socketio',
    })
    setSocket(newSocket)

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket')
      newSocket.emit('joinRoom', room)
    })

    newSocket.on('notification', (message: string) => {
      setNotifications(prev => [...prev, message])
    })

    return () => {
      newSocket.emit('leaveRoom', room)
      newSocket.disconnect()
    }
  }, [room])

  return { socket, notifications }
}

