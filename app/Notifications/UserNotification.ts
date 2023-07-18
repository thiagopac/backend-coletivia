import { NotificationContract } from '@ioc:Verful/Notification'

export default class UserNotification implements NotificationContract {
  private titie: string
  private message: string
  private context?: string
  private icon?: string
  private redirectUrl?: string

  /**
   * Create a new instance
   * @param title - The title of the message - required
   * @param message - The message to be sent - required
   * @param context - The context of the message (success, error, warning, info) - optional
   * @param icon - The icon to be displayed - optional
   * @param redirectUrl - The url to be redirected - optional
   */
  constructor(
    title: string,
    message: string,
    context?: string,
    icon?: string,
    redirectUrl?: string
  ) {
    this.titie = title
    this.message = message
    this.context = context
    this.icon = icon
    this.redirectUrl = redirectUrl
  }

  public via(_notifiable: any) {
    return 'database' as const
  }

  public toDatabase(notifiable: any) {
    return {
      title: this.titie,
      message: this.message,
      context: this.context,
      icon: this.icon,
      redirectUrl: this.redirectUrl,
    }
  }
}
