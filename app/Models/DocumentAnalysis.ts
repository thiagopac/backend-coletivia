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
import AiDocument from 'App/Models/AiDocument'

export default class DocumentAnalysis extends compose(BaseModel, SoftDeletes) {
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
  public aiDocumentId: number

  @column({ serializeAs: null })
  public userId: number

  @column()
  public type: string

  @column({ serializeAs: null })
  public behavior: JSON

  @column()
  public content: JSON

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

  @belongsTo(() => AiDocument, { foreignKey: 'aiDocumentId' })
  public document: BelongsTo<typeof AiDocument>

  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */

  @beforeCreate()
  public static generateUUID(documentAnalysis: DocumentAnalysis) {
    documentAnalysis.uuid = uuidv4()
  }

  @afterCreate()
  public static changeMessagesDefault(documentAnalysis: DocumentAnalysis) {
    documentAnalysis.messages = { messages: [] } as any
  }

  /*
  |--------------------------------------------------------------------------
  | Methods
  |--------------------------------------------------------------------------
  */

  public static async createDocumentAnalysis(user: User, feature: Feature, document: AiDocument) {
    try {
      const analysis = await DocumentAnalysis.create({
        userId: user.id,
        featureId: feature.id,
        aiDocumentId: document.id,
        behavior: feature.behavior,
        content: { content: [] } as any,
        messages: { messages: [] } as any,
      })

      if (!analysis) throw new Error('Erro ao criar análise de documento')

      return analysis
    } catch (error) {
      return error.message
    }
  }

  public static async getDocumentAnalysisWith(
    field: string,
    value: any
  ): Promise<DocumentAnalysis> {
    try {
      const analysis = await DocumentAnalysis.query()
        .preload('feature', (query) => query.preload('model'))
        .where(field, value)
        .firstOrFail()

      if (!analysis) throw new Error('Análise de documento não encontrada ou não disponível')

      const pricing = await Pricing.latestPriceForModelUuid(analysis.feature.model.uuid)
      if (!pricing) throw new Error('Precificação para modelo não encontrado')

      analysis.feature.model.pricing = pricing

      return analysis
    } catch (error) {
      throw new Error(error)
    }
  }
}
