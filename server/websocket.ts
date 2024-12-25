import { Server } from 'socket.io'
import { createServer } from 'http'
import next from 'next'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

let io: Server | undefined

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res)
  })

  io = new Server(server)

  io.on('connection', (socket) => {
    console.log('A user connected')

    socket.on('joinRoom', (room) => {
      socket.join(room)
      console.log(`User joined room: ${room}`)
    })

    socket.on('leaveRoom', (room) => {
      socket.leave(room)
      console.log(`User left room: ${room}`)
    })

    socket.on('disconnect', () => {
      console.log('User disconnected')
    })
  })

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000')
  })
})

export const sendNotification = (room: string, message: string) => {
  if (io) {
    io.to(room).emit('notification', message)
  }
}

export default io

