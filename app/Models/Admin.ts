import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, beforeSave, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import { v4 as uuidv4 } from 'uuid'
import AdminInfo from 'App/Models/AdminInfo'

export default class Admin extends BaseModel {
  /*
  |--------------------------------------------------------------------------
  | Columns
  |--------------------------------------------------------------------------
  */

  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public uuid: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column({ serializeAs: null })
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /*
  |--------------------------------------------------------------------------
  | Relations
  |--------------------------------------------------------------------------
  */

  /* :::::::::::::::::::: has one ::::::::::::::::::::::: */

  @hasOne(() => AdminInfo, { localKey: 'id' })
  public info: HasOne<typeof AdminInfo>

  /* :::::::::::::::::::: has many :::::::::::::::::::::: */

  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */

  @beforeSave()
  public static async hashPassword(admin: Admin) {
    if (admin.$dirty.password) {
      admin.password = await Hash.make(admin.password)
    }
  }

  @beforeCreate()
  public static generateUUID(admin: Admin) {
    admin.uuid = uuidv4()
  }
}
