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
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import { compose } from '@ioc:Adonis/Core/Helpers'
import Feature from 'App/Models/Feature'
import Pricing from 'App/Models/Pricing'

export default class OpenAiChat extends compose(BaseModel, SoftDeletes) {
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
  public type: string

  @column()
  public title: string

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
  public static generateUUID(chat: OpenAiChat) {
    chat.uuid = uuidv4()
  }

  @afterCreate()
  public static changeMessagesDefault(chat: OpenAiChat) {
    chat.messages = { messages: [] } as any
  }

  /*
  |--------------------------------------------------------------------------
  | Methods
  |--------------------------------------------------------------------------
  */

  public static async createChat(user: User, feature: Feature) {
    try {
      const chat = await OpenAiChat.create({
        userId: user.id,
        featureId: feature.id,
        title: 'Sem título',
        behavior: feature.behavior,
        messages: { messages: [] } as any,
      })

      if (!chat) throw new Error('Erro ao criar conversa')

      return chat
    } catch (error) {
      return error.message
    }
  }

  public static async getOpenAiChatWithUuid(uuid: string): Promise<OpenAiChat> {
    try {
      const chat = await OpenAiChat.query()
        .preload('feature', (query) => query.preload('model'))
        .where('uuid', uuid)
        .firstOrFail()

      if (!chat) throw new Error('Chat não encontrado ou não disponível')

      const pricing = await Pricing.latestPriceForModelUuid(chat.feature.model.uuid)
      if (!pricing) throw new Error('Precificação para modelo não encontrado')

      chat.feature.model.pricing = pricing

      return chat
    } catch (error) {
      throw new Error(error)
    }
  }
}
