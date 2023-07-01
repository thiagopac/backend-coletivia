import { DateTime } from 'luxon'
import { BaseModel, HasMany, beforeCreate, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import OpenAiChat from 'App/Models/OpenAiChat'
import { v4 as uuidv4 } from 'uuid'
import Pricing from 'App/Models/Pricing'
import OpenAiImageGeneration from 'App/Models/OpenAiImageGeneration'

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

  @hasMany(() => OpenAiImageGeneration, { localKey: 'id' })
  public imageGenerations: HasMany<typeof OpenAiImageGeneration>

  @hasMany(() => Pricing, { localKey: 'id' })
  public prices: HasMany<typeof Pricing>

  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */

  @beforeCreate()
  public static generateUUID(chat: OpenAiChat) {
    chat.uuid = uuidv4()
  }

  /*
  |--------------------------------------------------------------------------
  | Methods
  |--------------------------------------------------------------------------
  */

  public static async getModelForUuid(modelUuid: string): Promise<OpenAiModel> {
    try {
      const openAiModel = await OpenAiModel.query()
        .preload('prices')
        .where('uuid', modelUuid)
        .where('is_available', true)
        .first()

      if (!openAiModel) throw new Error('Modelo não encontrado ou não disponível')

      return openAiModel
    } catch (error) {
      throw new Error(error)
    }
  }
}
