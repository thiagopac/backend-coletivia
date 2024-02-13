import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import { v4 as uuidv4 } from 'uuid'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import { compose } from '@ioc:Adonis/Core/Helpers'

export default class AiDocument extends compose(BaseModel, SoftDeletes) {
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

  @column()
  public extension: string

  @column()
  public title: string

  @column()
  public content: JSON

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

  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */

  @beforeCreate()
  public static generateUUID(document: AiDocument) {
    document.uuid = uuidv4()
  }

  /*
  |--------------------------------------------------------------------------
  | Methods
  |--------------------------------------------------------------------------
  */

  public static async createDocument(user: User, extension: string) {
    try {
      const document = await AiDocument.create({
        userId: user.id,
        extension: extension,
        title: 'Novo documento',
        content: { content: [] } as any,
      })

      if (!document) {
        return { error: 'Erro ao criar documento' }
      }

      return document
    } catch (error) {
      return { error: error.message }
    }
  }

  public static async getAiDocumentWith(
    field: string,
    value: any
  ): Promise<AiDocument | { error: string }> {
    try {
      const document = await AiDocument.query().where(field, value).first()

      if (!document) return { error: 'Documento não encontrado ou não disponível' }

      return document
    } catch (error) {
      return { error: error.message }
    }
  }
}
