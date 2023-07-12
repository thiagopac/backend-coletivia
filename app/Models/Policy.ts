import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import State from './State'
import { DateTime } from 'luxon'

export default class Policy extends BaseModel {
  /*
  |--------------------------------------------------------------------------
  | Columns
  |--------------------------------------------------------------------------
  */

  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public type: string

  @column()
  public content: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /*
  |--------------------------------------------------------------------------
  | Relations
  |--------------------------------------------------------------------------
  */

  @hasMany(() => State, { localKey: 'id' })
  public states: HasMany<typeof State>
}
