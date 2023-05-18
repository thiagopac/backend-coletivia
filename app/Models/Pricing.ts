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
import { v4 as uuidv4 } from 'uuid'
import OpenAiModel from 'App/Models/OpenAiModel'
import UserOperation from 'App/Models/UserOperation'

export default class Pricing extends BaseModel {
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

  @column()
  public reference_value: number

  @column()
  public value: number

  @column()
  public variation: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /*
  |--------------------------------------------------------------------------
  | Relations
  |--------------------------------------------------------------------------
  */

  /* :::::::::::::::::::: belongs to :::::::::::::::::::: */

  @belongsTo(() => OpenAiModel, { foreignKey: 'aiModelId' })
  public model: BelongsTo<typeof OpenAiModel>

  /* :::::::::::::::::::: has many :::::::::::::::::::::: */

  @hasMany(() => UserOperation, { localKey: 'id' })
  public operations: HasMany<typeof UserOperation>

  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */

  @beforeCreate()
  public static generateUUID(pricing: Pricing) {
    pricing.uuid = uuidv4()
  }

  /*
  |--------------------------------------------------------------------------
  | Methods
  |--------------------------------------------------------------------------
  */

  public static async latestPriceForModelUuid(modelUuid: string): Promise<Pricing> {
    try {
      const openAiModel = await OpenAiModel.getModelForUuid(modelUuid)
      const modelPricing = await Pricing.query()
        .where('open_ai_model_id', openAiModel.id)
        .orderBy('id', 'desc')
        .firstOrFail()

      if (!modelPricing) throw new Error('Valores não encontrados para modelo')

      return modelPricing
    } catch (error) {
      throw new Error(error)
    }
  }
}
