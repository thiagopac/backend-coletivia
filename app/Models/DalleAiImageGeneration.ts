import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  BelongsTo,
  belongsTo,
  beforeCreate,
  afterCreate,
} from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import { v4 as uuidv4 } from 'uuid'
import { compose } from '@ioc:Adonis/Core/Helpers'
import Feature from 'App/Models/Feature'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'

export default class DalleAiImageGeneration extends compose(BaseModel, SoftDeletes) {
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

  @column()
  public size: string

  @column({ serializeAs: null })
  public behavior: JSON

  @column()
  public images: JSON

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

  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */

  @beforeCreate()
  public static generateUUID(imageGeneration: DalleAiImageGeneration) {
    imageGeneration.uuid = uuidv4()
  }

  @afterCreate()
  public static changeImagesDefault(imageGeneration: DalleAiImageGeneration) {
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
    size: string,
    prompt: string
  ): Promise<DalleAiImageGeneration | { error: string }> {
    try {
      const imageGeneration = await DalleAiImageGeneration.create({
        userId: user.id,
        featureId: feature.id,
        size: size,
        prompt: prompt,
        behavior: feature.behavior,
        images: { images: [] } as any,
      })

      if (!imageGeneration) {
        return { error: 'Erro ao gerar imagens' }
      }

      return imageGeneration
    } catch (error) {
      return { error: error.message }
    }
  }
}
