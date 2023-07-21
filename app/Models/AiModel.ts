import { DateTime } from 'luxon'
import { BaseModel, HasMany, beforeCreate, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import OpenAiChat from 'App/Models/OpenAiChat'
import { v4 as uuidv4 } from 'uuid'
import Pricing from 'App/Models/Pricing'
import Feature from 'App/Models/Feature'

export default class AiModel extends BaseModel {
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
  public pricing: Pricing

  @column()
  public contextLength: number

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

  @hasMany(() => Feature, { localKey: 'id' })
  public features: HasMany<typeof Feature>

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

  public static async getModelWith(
    field: string,
    value: any
  ): Promise<AiModel | { error: string }> {
    try {
      const aiModel = await AiModel.query().where(field, value).where('is_available', true).first()

      if (!aiModel) {
        return { error: 'Modelo não encontrado ou não disponível' }
      }

      const pricing = await Pricing.latestPriceForModelUuid(aiModel.uuid)

      if ('error' in pricing) {
        return { error: pricing.error }
      }

      aiModel.pricing = pricing

      return aiModel
    } catch (error) {
      return { error: error.message }
    }
  }
}
