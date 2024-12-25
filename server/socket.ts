import { Server as HttpServer } from 'http'
import { Server, Socket } from 'socket.io'

export function initSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    path: '/api/socketio',
    cors: {
      origin: process.env.NODE_ENV === 'production' ? 'https://your-production-domain.com' : 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket: Socket) => {
    console.log('A user connected')

    socket.on('joinRoom', (room: string) => {
      socket.join(room)
      console.log(`User joined room: ${room}`)
    })

    socket.on('leaveRoom', (room: string) => {
      socket.leave(room)
      console.log(`User left room: ${room}`)
    })

    socket.on('disconnect', () => {
      console.log('User disconnected')
    })
  })

  return io
}

export function sendNotification(io: Server, room: string, message: string) {
  io.to(room).emit('notification', message)
}

