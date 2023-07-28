import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { v4 as uuidv4 } from 'uuid'
import {
  column,
  beforeSave,
  BaseModel,
  HasMany,
  hasMany,
  HasOne,
  hasOne,
  beforeCreate,
} from '@ioc:Adonis/Lucid/Orm'
import UserInfo from './UserInfo'
import OpenAiChat from 'App/Models/OpenAiChat'
import UserBalance from 'App/Models/UserBalance'
import UserOperation from 'App/Models/UserOperation'
import DalleAiImageGeneration from 'App/Models/DalleAiImageGeneration'
import AiDocument from 'App/Models/AiDocument'
import InstagramPost from 'App/Models/InstagramPost'
import Recharge from 'App/Models/Recharge'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Notifiable } from '@ioc:Verful/Notification/Mixins'
import Notification from 'App/Models/Notification'
import SocketIOController from 'App/Controllers/Http/SocketIOController'

export default class User extends compose(BaseModel, Notifiable('notifications')) {
  /*
  |--------------------------------------------------------------------------
  | Columns
  |--------------------------------------------------------------------------
  */

  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public uuid: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password?: string

  @column({ serializeAs: null })
  public rememberMeToken?: string

  @column()
  public socialLogin?: boolean

  @column()
  public socialService?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /*
  |--------------------------------------------------------------------------
  | Relations
  |--------------------------------------------------------------------------
  */

  /* :::::::::::::::::::: has one ::::::::::::::::::::::: */

  @hasOne(() => UserInfo, { localKey: 'id' })
  public info: HasOne<typeof UserInfo>

  @hasOne(() => UserBalance, { localKey: 'id' })
  public balance: HasOne<typeof UserBalance>

  /* :::::::::::::::::::: has many :::::::::::::::::::::: */

  @hasMany(() => OpenAiChat, { localKey: 'id' })
  public chats: HasMany<typeof OpenAiChat>

  @hasMany(() => AiDocument, { localKey: 'id' })
  public documents: HasMany<typeof AiDocument>

  @hasMany(() => DalleAiImageGeneration, { localKey: 'id' })
  public imageGenerations: HasMany<typeof DalleAiImageGeneration>

  @hasMany(() => UserOperation, { localKey: 'id' })
  public operations: HasMany<typeof UserOperation>

  @hasMany(() => InstagramPost, { localKey: 'id' })
  public instagramPosts: HasMany<typeof InstagramPost>

  @hasMany(() => Recharge, { localKey: 'id' })
  public recharges: HasMany<typeof Recharge>

  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password && user.password !== undefined) {
      user.password = await Hash.make(user.password as string)
    }
  }

  @beforeCreate()
  public static generateUUID(user: User) {
    user.uuid = uuidv4()
  }

  /*
  |--------------------------------------------------------------------------
  | Methods
  |--------------------------------------------------------------------------
  */

  public async getAllNotifications() {
    try {
      const notifications = await Notification.query()
        .where('notifiable_id', this.id)
        .orderBy('id', 'desc')
      return notifications
    } catch (error) {
      return { error: error.message }
    }
  }

  public async getUnreadNotifications() {
    try {
      const notifications = await Notification.query()
        .where('notifiable_id', this.id)
        .andWhereNull('read_at')
        .orderBy('id', 'desc')
      return notifications
    } catch (error) {
      return { error: error.message }
    }
  }

  public async getReadNotifications() {
    try {
      const notifications = await Notification.query()
        .where('notifiable_id', this.id)
        .andWhereNotNull('read_at')
        .orderBy('id', 'desc')
      return notifications
    } catch (error) {
      return { error: error.message }
    }
  }

  public async markAllNotificationsAsRead() {
    try {
      const notifications = await Notification.query()
        .where('notifiable_id', this.id)
        .andWhereNull('read_at')
        .update({ read_at: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss') })
      return notifications
    } catch (error) {
      return { error: error.message }
    }
  }

  public async markNotificationAsRead(notification: number) {
    try {
      const result = await Notification.query()
        .where('notifiable_id', this.id)
        .andWhere('id', notification)
        .update({ read_at: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss') })

      return result
    } catch (error) {
      return { error: error.message }
    }
  }

  public async markNotificationAsUnread(notification: number) {
    try {
      const result = await Notification.query()
        .where('notifiable_id', this.id)
        .andWhere('id', notification)
        .update({ read_at: null })

      return result
    } catch (error) {
      return { error: error.message }
    }
  }

  public async notificationRefresh() {
    SocketIOController.wsNotificationRefresh(this)
  }

  public async hasEnoughBalance(): Promise<boolean | { error: string }> {
    try {
      const balance = await UserBalance.query().where('user_id', this.id).firstOrFail()

      if (balance.currentBalance <= 0) {
        SocketIOController.wsInsufficientBalanceAlert(this)
      }

      return balance.currentBalance >= 0
    } catch (error) {
      return { error: error.message }
    }
  }
}
