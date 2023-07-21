import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  BelongsTo,
  belongsTo,
  beforeCreate,
  afterCreate,
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

export default class MidjourneyImageGeneration extends compose(BaseModel, SoftDeletes) {
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

  @column()
  public prompt: string

  @column({ serializeAs: null })
  public behavior: JSON

  @column()
  public images: JSON

  @column()
  public variations: JSON

  @column()
  public upscales: JSON

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
  public static generateUUID(imageGeneration: MidjourneyImageGeneration) {
    imageGeneration.uuid = uuidv4()
  }

  @afterCreate()
  public static changeImagesDefault(imageGeneration: MidjourneyImageGeneration) {
    imageGeneration.images = { images: [] } as any
  }

  /*
  |--------------------------------------------------------------------------
  | Methods
  |--------------------------------------------------------------------------
  */

  public static async createImageGeneration(
    user: User,
    feature: Feature,
    prompt: string
  ): Promise<MidjourneyImageGeneration | { error: string }> {
    try {
      const imageGeneration = await MidjourneyImageGeneration.create({
        userId: user.id,
        featureId: feature.id,
        behavior: feature.behavior,
        prompt: prompt,
        images: { images: [] } as any,
        variations: { variations: [] } as any,
        upscales: { upscales: [] } as any,
      })

      if (!imageGeneration) {
        return { error: 'Erro ao gerar imagens' }
      }

      return imageGeneration
    } catch (error) {
      return { error: error.message }
    }
  }

  public static async getImageGenerationWith(
    field: string,
    value: any
  ): Promise<MidjourneyImageGeneration | { error: string }> {
    try {
      const generation = await MidjourneyImageGeneration.query()
        .preload('feature', (feature) => {
          feature.preload('model')
        })
        .where(field, value)
        .first()

      if (!generation) {
        return { error: 'Imagem não encontrada' }
      }

      const pricing = await Pricing.latestPriceForModelUuid(generation.feature.model.uuid)

      if ('error' in pricing) {
        // Se pricing for um objeto de erro, retornar o objeto de erro
        return pricing
      }

      generation.feature.model.pricing = pricing

      return generation
    } catch (error) {
      return { error: error.message }
    }
  }
}
