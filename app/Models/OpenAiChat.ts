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
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import { compose } from '@ioc:Adonis/Core/Helpers'

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
  public openAiModelId: number

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

  @belongsTo(() => OpenAiModel, { foreignKey: 'openAiModelId' })
  public model: BelongsTo<typeof OpenAiModel>

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

  public static async createChat(user: User, model: string, behavior: any, type: string) {
    try {
      const openAiModel = await OpenAiModel.query()
        .where('uuid', model)
        .andWhere('is_available', true)
        .first()

      if (!openAiModel) throw new Error('Modelo não encontrado ou não disponível')

      const chat = await OpenAiChat.create({
        userId: user.id,
        openAiModelId: openAiModel.id,
        type: type,
        title: 'Nova conversa',
        behavior: behavior,
        messages: { messages: [] } as any,
      })

      if (!chat) throw new Error('Erro ao criar conversa')

      return chat
    } catch (error) {
      return error.message
    }
  }
}
