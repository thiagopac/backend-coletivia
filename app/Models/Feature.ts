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
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import { compose } from '@ioc:Adonis/Core/Helpers'
import OpenAiChat from 'App/Models/OpenAiChat'
import DalleAiImageGeneration from 'App/Models/DalleAiImageGeneration'
import MidjourneyImageGeneration from 'App/Models/MidjourneyImageGeneration'
import DocumentAnalysis from 'App/Models/DocumentAnalysis'
import Pricing from 'App/Models/Pricing'

export default class Feature extends compose(BaseModel, SoftDeletes) {
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
  public name: string

  @column()
  public suitness: string

  @column({ serializeAs: null })
  public behavior: JSON

  @column()
  public messages: JSON

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime | null

  /*
  |--------------------------------------------------------------------------
  | Relations
  |--------------------------------------------------------------------------
  */

  /* :::::::::::::::::::: has many :::::::::::::::::::::: */

  @hasMany(() => OpenAiChat, { localKey: 'id' })
  public chats: HasMany<typeof OpenAiChat>

  @hasMany(() => DalleAiImageGeneration, { localKey: 'id' })
  public dalleAiImageGenerations: HasMany<typeof DalleAiImageGeneration>

  @hasMany(() => MidjourneyImageGeneration, { localKey: 'id' })
  public midjourneyImageGenerations: HasMany<typeof MidjourneyImageGeneration>

  @hasMany(() => DocumentAnalysis, { localKey: 'id' })
  public analyses: HasMany<typeof DocumentAnalysis>

  /* :::::::::::::::::::: belongs to :::::::::::::::::::: */

  @belongsTo(() => AiModel, { foreignKey: 'aiModelId' })
  public model: BelongsTo<typeof AiModel>

  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */

  @beforeCreate()
  public static generateUUID(feature: Feature) {
    feature.uuid = uuidv4()
  }

  /*
  |--------------------------------------------------------------------------
  | Methods
  |--------------------------------------------------------------------------
  */

  public static async getFeatureWith(
    field: string,
    value: any
  ): Promise<Feature | { error: string }> {
    try {
      const feature = await Feature.query().preload('model').where(field, value).first()

      if (!feature) {
        return { error: 'Funcionalidade não encontrada' }
      }

      const pricing = await Pricing.latestPriceForModelUuid(feature.model.uuid)

      if ('error' in pricing) {
        // Se pricing for um objeto de erro, retornar o objeto de erro
        return pricing
      }

      feature.model.pricing = pricing

      return feature
    } catch (error) {
      return { error: error.message }
    }
  }
}
