import SocketIOController from 'App/Controllers/Http/SocketIOController'
import Ws from 'App/Services/Ws'
export const userSockets = {}
Ws.boot()

Ws.io.on('connection', (socket) => {
  socket.on('login', (userUuid) => {
    userSockets[userUuid] = socket
  })

  socket.on('disconnect', () => {
    const userUuid = Object.keys(userSockets).find((key) => userSockets[key] === socket)
    if (userUuid) {
      delete userSockets[userUuid]
    }
  })

  socket.on('ch_run_start', async (payload: any) => {
    await new SocketIOController().run(payload)
  })
})
