import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid'

export default class PasswordReset extends BaseModel {
  /*
  |--------------------------------------------------------------------------
  | Columns
  |--------------------------------------------------------------------------
  */

  @column({ serializeAs: null })
  public email: string

  @column({ serializeAs: null })
  public token: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */
  @beforeCreate()
  public static generateUUID(reset: PasswordReset) {
    reset.token = uuidv4()
  }
}
