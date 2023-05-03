import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Country from './Country'
import Region from './Region'
import City from './City'

export default class State extends BaseModel {
  /*
  |--------------------------------------------------------------------------
  | Columns
  |--------------------------------------------------------------------------
  */

  @column({ isPrimary: true })
  public id: number

  @column()
  public countryId: number

  @column()
  public regionId: number

  @column()
  public name: string

  @column()
  public letter: string

  @column()
  public iso: number

  @column()
  public isAvailable: boolean

  /*
  |--------------------------------------------------------------------------
  | Relations
  |--------------------------------------------------------------------------
  */

  /* :::::::::::::::::::: belongs to :::::::::::::::::::: */

  @belongsTo(() => Country, { foreignKey: 'countryId' })
  public country: BelongsTo<typeof Country>

  @belongsTo(() => Region, { foreignKey: 'regionId' })
  public region: BelongsTo<typeof Region>

  /* :::::::::::::::::::: has many :::::::::::::::::::::: */

  @hasMany(() => City, { localKey: 'id' })
  public cities: HasMany<typeof City>
}
