import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import State from './State'

export default class Region extends BaseModel {
  /*
  |--------------------------------------------------------------------------
  | Columns
  |--------------------------------------------------------------------------
  */

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public isAvailable: boolean

  /*
  |--------------------------------------------------------------------------
  | Relations
  |--------------------------------------------------------------------------
  */

  @hasMany(() => State, { localKey: 'id' })
  public states: HasMany<typeof State>
}
