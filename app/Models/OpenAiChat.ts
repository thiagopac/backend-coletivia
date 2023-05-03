import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  BelongsTo,
  belongsTo,
  beforeCreate,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import { v4 as uuidv4 } from 'uuid'
import OpenAiChatMessage from 'App/Models/OpenAiChatMessage'
import OpenAiModel from 'App/Models/OpenAiModel'

export default class OpenAiChat extends BaseModel {
  /*
  |--------------------------------------------------------------------------
  | Columns
  |--------------------------------------------------------------------------
  */

  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public uuid: string

  @column({ serializeAs: null })
  public openAiModelId: number

  @column({ serializeAs: null })
  public userId: number

  @column()
  public title: string

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

  @hasMany(() => OpenAiChatMessage, { localKey: 'id' })
  public messages: HasMany<typeof OpenAiChatMessage>

  /* :::::::::::::::::::: belongs to :::::::::::::::::::: */

  @belongsTo(() => User, { foreignKey: 'userId' })
  public user: BelongsTo<typeof User>

  @belongsTo(() => OpenAiModel, { foreignKey: 'aiModelId' })
  public model: BelongsTo<typeof OpenAiModel>

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
