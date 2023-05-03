import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Admin from 'App/Models/Admin'
import City from 'App/Models/City'
import { v4 as uuidv4 } from 'uuid'

export default class AdminInfo extends BaseModel {
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
  public adminId: number

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public cityId: number

  @column()
  public phone?: string

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

  @belongsTo(() => Admin, { foreignKey: 'adminId' })
  public admin: BelongsTo<typeof Admin>

  @belongsTo(() => City, { foreignKey: 'cityId' })
  public city: BelongsTo<typeof City>

  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */

  @beforeCreate()
  public static generateUUID(adminInfo: AdminInfo) {
    adminInfo.uuid = uuidv4()
  }
}
