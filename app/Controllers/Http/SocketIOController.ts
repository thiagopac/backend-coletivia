import Ws from 'App/Services/Ws'
import { userSockets } from '../../../start/socket'
import User from 'App/Models/User'

export default class SocketIOController {
  public async run(payload: any) {
    console.log('payload: ', payload)

    const userUuid = payload.user.uuid

    const socket = userSockets[userUuid]
    if (socket) {
      Ws.io.to(socket.id).emit('ch_run_finish', { message: 'finished' })
    }
  }

  public static async wsNotificationRefresh(user: User) {
    const userUuid = user.uuid

    const socket = userSockets[userUuid]
    if (socket) {
      Ws.io.to(socket.id).emit('ch_notification_refresh', { message: 'refresh' })
    }
  }

  public static async wsBalanceRefresh(user: User) {
    const userUuid = user.uuid

    const socket = userSockets[userUuid]
    if (socket) {
      Ws.io.to(socket.id).emit('ch_balance_refresh', { message: 'refresh' })
    }
  }

  public static async wsShowToast(
    user: User,
    message: string,
    icon: 'success' | 'error' | 'warning' | 'info' | 'question'
  ) {
    const userUuid = user.uuid

    const socket = userSockets[userUuid]
    if (socket) {
      Ws.io.to(socket.id).emit('ch_show_toast', { message: message, icon: icon })
    }
  }
}
