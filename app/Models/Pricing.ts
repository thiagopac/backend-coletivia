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
import AiModel from 'App/Models/AiModel'
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
  public aiModelId: number

  @column()
  public inputReferenceValue: number

  @column()
  public inputValue: number

  @column()
  public outputReferenceValue: number

  @column()
  public outputValue: number

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

  @belongsTo(() => AiModel, { foreignKey: 'aiModelId' })
  public model: BelongsTo<typeof AiModel>

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
      const aiModel = await AiModel.query()
        .where('uuid', modelUuid)
        .where('is_available', true)
        .firstOrFail()

      const pricing = await Pricing.query()
        .where('ai_model_id', aiModel.id)
        .orderBy('id', 'desc')
        .firstOrFail()

      if (!pricing) throw new Error('Precificação não encontrada para modelo')

      return pricing
    } catch (error) {
      throw new Error(error)
    }
  }
}
