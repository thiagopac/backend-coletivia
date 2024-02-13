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
    await user.load('balance')

    const socket = userSockets[userUuid]
    if (socket) {
      Ws.io
        .to(socket.id)
        .emit('ch_balance_refresh', { message: 'refresh', balance: user.balance.currentBalance })
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

  public static async wsCheckoutRefresh(user: User) {
    const userUuid = user.uuid

    const socket = userSockets[userUuid]
    if (socket) {
      Ws.io.to(socket.id).emit('ch_checkout_refresh', { message: 'refresh' })
    }
  }

  public static async wsInsufficientBalanceAlert(user: User) {
    const userUuid = user.uuid

    const socket = userSockets[userUuid]
    if (socket) {
      Ws.io.to(socket.id).emit('ch_insufficient_balance_alert', { message: 'alert' })
    }
  }

  public static async wsMidjourneyImageGenerationStatus(
    user: User,
    uri: string,
    progress?: string
  ) {
    const userUuid = user.uuid

    const socket = userSockets[userUuid]
    if (socket) {
      Ws.io
        .to(socket.id)
        .emit('ch_midjourney_image_generation_status', { message: 'refresh', uri, progress })
    }
  }
}
