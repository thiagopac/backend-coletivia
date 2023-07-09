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
import OpenAiModel from 'App/Models/OpenAiModel'

export default class OpenAiImageGeneration extends BaseModel {
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
  public type: string

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

  /*
  |--------------------------------------------------------------------------
  | Relations
  |--------------------------------------------------------------------------
  */

  /* :::::::::::::::::::: belongs to :::::::::::::::::::: */

  @belongsTo(() => User, { foreignKey: 'userId' })
  public user: BelongsTo<typeof User>

  @belongsTo(() => OpenAiModel, { foreignKey: 'openAiModelId' })
  public model: BelongsTo<typeof OpenAiModel>

  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */

  @beforeCreate()
  public static generateUUID(imageGeneration: OpenAiImageGeneration) {
    imageGeneration.uuid = uuidv4()
  }

  @afterCreate()
  public static changeImagesDefault(imageGeneration: OpenAiImageGeneration) {
    imageGeneration.images = { images: [] } as any
  }

  /*
  |--------------------------------------------------------------------------
  | Methods
  |--------------------------------------------------------------------------
  */

  public static async createImageGeneration(
    user: User,
    model: string,
    behavior: any,
    type: string,
    size: string
  ) {
    try {
      const openAiModel = await OpenAiModel.query()
        .where('uuid', model)
        .andWhere('is_available', true)
        .firstOrFail()

      const imageGeneration = await OpenAiImageGeneration.create({
        userId: user.id,
        openAiModelId: openAiModel.id,
        type: type,
        size: size,
        behavior: behavior,
        images: { images: [] } as any,
      })

      if (!imageGeneration) throw new Error('Erro ao geração de imagens')

      return imageGeneration
    } catch (error) {
      return error.message
    }
  }
}
