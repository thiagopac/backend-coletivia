import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Notification from 'App/Models/Notification'

export default class RechargeController {
  public async list({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user
      const { type } = request.params()

      if (type === 'unread') {
        const notifications = await user?.getUnreadNotifications()
        return notifications
      } else if (type === 'read') {
        const notifications = await user?.getReadNotifications()
        return notifications
      } else if (type === 'all') {
        const notifications = await user?.getAllNotifications()

        const unreadCount = await Notification.query()
          .where('notifiable_id', user!.id)
          .whereNull('read_at')

        const readCount = await Notification.query()
          .where('notifiable_id', user!.id)
          .whereNotNull('read_at')

        return {
          data: notifications,
          meta: {
            unread_count: (unreadCount as any).length,
            read_count: (readCount as any).length,
          },
        }
      }
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  public async markAsRead({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user
      const { id } = request.body()

      const notification = await user?.markNotificationAsRead(id)
      return notification
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  public async markAsUnread({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user
      const { id } = request.body()

      const notification = await user?.markNotificationAsUnread(id)
      return notification
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  public async markAllAsRead({ auth, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user

      const notifications = await user?.markAllNotificationsAsRead()
      return notifications
    } catch (error) {
      return response.notFound(error.message)
    }
  }
}
