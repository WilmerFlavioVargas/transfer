import { Server } from 'socket.io'
import { Server as HttpServer } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'

export const initWebSocket = (server: HttpServer) => {
  const io = new Server(server, {
    path: '/api/websocket',
  })

  io.on('connection', (socket) => {
    console.log('A user connected')

    socket.on('join', (room) => {
      socket.join(room)
      console.log(`User joined room: ${room}`)
    })

    socket.on('leave', (room) => {
      socket.leave(room)
      console.log(`User left room: ${room}`)
    })

    socket.on('disconnect', () => {
      console.log('A user disconnected')
    })
  })

  return io
}

export const getWebSocketServer = (req: NextApiRequest, res: NextApiResponse) => {
  // Asegúrate de que el objeto `server` y `io` existen
  const server = (res.socket as any)?.server
  if (!server.io) {
    server.io = new Server(server, {
      path: '/api/websocket',
    })
  }
  return server.io
}


