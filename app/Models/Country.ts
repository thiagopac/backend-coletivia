import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import State from './State'

export default class Country extends BaseModel {
  /*
  |--------------------------------------------------------------------------
  | Columns
  |--------------------------------------------------------------------------
  */

  @column({ isPrimary: true })
  public id: number

  @column()
  public isoCode: string

  @column()
  public name: string

  @column()
  public lat: string

  @column()
  public lon: string

  @column()
  public isAvailable: boolean

  /*
  |--------------------------------------------------------------------------
  | Relations
  |--------------------------------------------------------------------------
  */

  /* :::::::::::::::::::: has many :::::::::::::::::::::: */

  @hasMany(() => State, { localKey: 'id' })
  public states: HasMany<typeof State>
}
