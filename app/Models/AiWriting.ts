import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  BelongsTo,
  belongsTo,
  beforeCreate,
  HasMany,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import { v4 as uuidv4 } from 'uuid'
import Feature from 'App/Models/Feature'
import Pricing from 'App/Models/Pricing'
import InstagramPost from 'App/Models/InstagramPost'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'

export default class AiWriting extends compose(BaseModel, SoftDeletes) {
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
  public featureId: number

  @column({ serializeAs: null })
  public userId: number

  @column({ serializeAs: null })
  public behavior: JSON

  @column()
  public prompt: string

  @column()
  public text: string

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

  /* :::::::::::::::::::: belongs to :::::::::::::::::::: */

  @belongsTo(() => User, { foreignKey: 'userId' })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Feature, { foreignKey: 'featureId' })
  public feature: BelongsTo<typeof Feature>

  /* :::::::::::::::::::: has many :::::::::::::::::::::: */

  @hasMany(() => InstagramPost, { localKey: 'id' })
  public instagramPosts: HasMany<typeof InstagramPost>

  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */

  @beforeCreate()
  public static generateUUID(writing: AiWriting) {
    writing.uuid = uuidv4()
  }

  /*
  |--------------------------------------------------------------------------
  | Methods
  |--------------------------------------------------------------------------
  */

  public static async createAiWriting(
    user: User,
    feature: Feature
  ): Promise<AiWriting | { error: string }> {
    try {
      const writing = await AiWriting.create({
        userId: user.id,
        featureId: feature.id,
        behavior: feature.behavior,
      })

      if (!writing) {
        return { error: 'Erro ao criar texto' }
      }

      return writing
    } catch (error) {
      return { error: error.message }
    }
  }

  public static async getAiWritingWith(
    field: string,
    value: any
  ): Promise<AiWriting | { error: string }> {
    try {
      const writing = await AiWriting.query()
        .preload('feature', (feature) => {
          feature.preload('model')
        })
        .where(field, value)
        .firstOrFail()

      if (!writing) {
        return { error: 'Texto não encontrado' }
      }

      const pricing = await Pricing.latestPriceForModelUuid(writing.feature.model.uuid)

      if ('error' in pricing) {
        // Se pricing for um objeto de erro, retornar o objeto de erro
        return pricing
      }

      writing.feature.model.pricing = pricing

      return writing
    } catch (error) {
      return { error: error.message }
    }
  }
}
