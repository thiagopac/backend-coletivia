import { DateTime } from 'luxon'
import { BaseModel, HasMany, beforeCreate, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import OpenAiChat from 'App/Models/OpenAiChat'
import { v4 as uuidv4 } from 'uuid'

export default class OpenAiModel extends BaseModel {
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
  public name: string

  @column()
  public release: string

  @column()
  public type: string

  @column()
  public isAvailable: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /*
  |--------------------------------------------------------------------------
  | Relations
  |--------------------------------------------------------------------------
  */

  /* :::::::::::::::::::: has many :::::::::::::::::::::: */

  @hasMany(() => OpenAiChat, { localKey: 'id' })
  public chats: HasMany<typeof OpenAiChat>

  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */

  @beforeCreate()
  public static generateUUID(chat: OpenAiChat) {
    chat.uuid = uuidv4()
  }
}
