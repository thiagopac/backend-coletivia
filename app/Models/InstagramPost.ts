import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import { v4 as uuidv4 } from 'uuid'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import { compose } from '@ioc:Adonis/Core/Helpers'
import MidjourneyImageGeneration from 'App/Models/MidjourneyImageGeneration'
import AiWriting from 'App/Models/AiWriting'
import Pricing from 'App/Models/Pricing'

export default class InstagramPost extends compose(BaseModel, SoftDeletes) {
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
  public userId: number

  @column({ serializeAs: null })
  public aiWritingId: number

  @column({ serializeAs: null })
  public midjourneyImageGenerationId: number

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

  @belongsTo(() => MidjourneyImageGeneration, { foreignKey: 'midjourneyImageGenerationId' })
  public midjourneyImageGeneration: BelongsTo<typeof MidjourneyImageGeneration>

  @belongsTo(() => AiWriting, { foreignKey: 'aiWritingId' })
  public aiWriting: BelongsTo<typeof AiWriting>

  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */

  @beforeCreate()
  public static generateUUID(chat: InstagramPost) {
    chat.uuid = uuidv4()
  }

  /*
  |--------------------------------------------------------------------------
  | Methods
  |--------------------------------------------------------------------------
  */

  public static async createInstagramPost(user: User): Promise<InstagramPost> {
    try {
      const post = await InstagramPost.create({
        userId: user.id,
      })

      if (!post) throw new Error('Erro ao criar post')

      return post
    } catch (error) {
      return error.message
    }
  }

  public static async getInstagramPostWith(field: string, value: any): Promise<InstagramPost> {
    try {
      const post = await InstagramPost.query()
        .preload('aiWriting', (writing) => {
          writing.preload('feature', (feature) => {
            feature.preload('model')
          })
        })
        .preload('midjourneyImageGeneration', (midjourneyImageGeneration) => {
          midjourneyImageGeneration.preload('feature', (feature) => {
            feature.preload('model')
          })
        })
        .where(field, value)
        .firstOrFail()

      if (!post) throw new Error('Post não encontrado')

      post.aiWriting.feature.model.pricing = await Pricing.latestPriceForModelUuid(
        post.aiWriting.feature.model.uuid
      )

      post.midjourneyImageGeneration.feature.model.pricing = await Pricing.latestPriceForModelUuid(
        post.midjourneyImageGeneration.feature.model.uuid
      )

      return post
    } catch (error) {
      throw new Error(error)
    }
  }
}
